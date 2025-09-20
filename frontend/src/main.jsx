import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './context/userContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const CLIENT_ID = "600707487068-304patsc4up5atl2bc5cuhaeodqkoafu.apps.googleusercontent.com" 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <UserProvider>
          <App />
      </UserProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
