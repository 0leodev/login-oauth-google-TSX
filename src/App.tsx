import './App.css';
import { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

// Helper function to set a cookie
function setCookie(name: string, value: string, days: number): void {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Helper function to get a cookie
function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Helper function to remove a cookie
function removeCookie(name: string): void {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// User interface
interface User {
  name: string;
  email: string;
  picture: string;
}

// Get current user from cookie
function getUser(): User | null {
  const user = getCookie("user");
  if (user) {
    return JSON.parse(user);
  }
  return null;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(getUser());

  return (
    <>
      {currentUser ? (
        <div>
          <h1>Hello, {currentUser.name}</h1>
          <p>Your email: {currentUser.email}</p>
          <div>
            <img
              src={currentUser.picture}
              alt="dp"
              width="50px"
              height="50px"
              style={{ borderRadius: "50%" }}
              referrerPolicy="no-referrer"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              removeCookie("user");
              setCurrentUser(null);
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <GoogleLogin
            onSuccess={(credentialResponse: CredentialResponse) => {
              if (credentialResponse.credential) {
                const decodedUser = jwtDecode(credentialResponse.credential) as User;
                setCurrentUser(decodedUser);
                setCookie("user", JSON.stringify(decodedUser), 1); // 1 means one day expiry, after 24 hours user will be auto cleared
              }
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </div>
      )}
    </>
  );
}