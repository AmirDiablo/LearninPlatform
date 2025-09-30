import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { useUser } from "../context/userContext";
import GoogleLoginButton from "../components/GoogleLoginButton";

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { login } = useUser()

    const loginToAccount = async(e)=> {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:3000/api/user/login", {
            method: "POST",
            body: JSON.stringify({email, password}),
            headers: {
                "Content-Type" : "application/json"
            }
        })

        const json = await response.json()

        if(response.ok) {
            localStorage.setItem("user", JSON.stringify(json))
            setLoading(false)
            login(json._id)
            setError(null)
            navigate("/")
        }
        if(!response.ok) {
            setLoading(false)
            setError(json.error)
        }
    }

    return ( 
        <div className="flex flex-col md:flex-row md:justify-center md:-space-x-100  md:items-center">

            <picture className="">
                <source media="(max-width: 465px)" srcSet="/mobileLogin.png" />
                <source media="(min-width: 1024px)" srcSet="/loginOrange.jpeg" />
                <img src="/loginImage.png" className="w-[90%] mx-auto md:w-[50%] md:mx-10" />
            </picture>

            <form className="mt-10 mx-5 md:mx-10">
                <div className="flex justify-between">
                    <p className="font-[500]">Login to your account</p>
                    <p className="text-black/30">login with</p>
                </div>
                <div className="flex gap-2 justify-end *:text-white mt-5">
                    <div className="p-3 relative bg-black/20  aspect-square rounded-full w-10 "><FaGoogle /><div className="absolute left-0 top-0 z-10 w-10 overflow-hidden opacity-0"><GoogleLoginButton /></div></div>
                    <div className="p-3 bg-black/20 rounded-full w-max "><FaFacebookF /></div>
                    <div className="p-3 bg-black/20 rounded-full w-max "><FaLinkedinIn /></div>
                </div>

                <input type="text" onChange={(e)=> setEmail(e.target.value)} value={email} placeholder="Your Email" className="p-5 bg-white rounded-[7px] mt-5 w-[100%]" /> 
                <input type="text" onChange={(e)=> setPassword(e.target.value)} value={password} placeholder="password" className="p-5 bg-white rounded-[7px] w-[100%] mt-5" />

                <div className="flex items-center justify-between mt-5">
                    <p className="text-black/30">Forgot password?</p>
                    <button disabled={loading} onClick={loginToAccount} className="py-2 px-5 flex items-center bg-orange-500 text-white rounded-full">{loading && <div className="rounded-full animate-spin border-t-4 border-white w-5 aspect-square"></div>}Log in</button>
                </div>

                <Link to="/signup" className="text-orange-500">don't Have an account?</Link>

                {error && <div className="bg-red-500 text-white text-center p-2 mx-auto w-[70%] rounded-[10px] mt-10">{error}</div>}
            </form>
        </div>
     );
}
 
export default Login;