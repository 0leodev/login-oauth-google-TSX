import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'

const clientId = import.meta.env.VITE_CLIENT_ID_GOOGLE;

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={clientId}>
  <StrictMode>
    <App />
  </StrictMode>
  </GoogleOAuthProvider>,
)
