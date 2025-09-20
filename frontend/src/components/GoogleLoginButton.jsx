import { useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/userContext';

export default function GoogleLoginButton() {
  const navigate = useNavigate()
  const {login} = useUser()
  
  return (
      <GoogleLogin
        shape='pill'
        onSuccess={(credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential);
        
        // ارسال اطلاعات به سرور
        fetch("http://localhost:3000/api/user/googleSign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ googleId: decoded.sub, email: decoded.email, username: decoded.name }),
        })
        .then(res => res.json())
        .then(data => {
          console.log("Server Response:", data);
          console.log(data)
          localStorage.setItem("user", JSON.stringify(data))
          login(data)
          navigate("/")
        }
        );
        }}
        onError={() => {
          console.log("Login Failed");
        }}
        
      />
  );
}