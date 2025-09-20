import { Link, useNavigate } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { FaGoogle } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { useState } from "react";

const TeacherLogin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e)=> {
        e.preventDefault()
        setLoading(true)
        const response = await fetch("http://localhost:3000/api/user/login", {
            method: "POST",
            body: JSON.stringify({email, password}),
            headers: {
                "Content-Type" : "application/json"
            }
        })

        const json = await response.json()

        if(!response.ok) {
            setError(json.error)
            setLoading(false)
        }

        if(response.ok) {
            localStorage.setItem("user", JSON.stringify(json))
            setError(null)
            setLoading(false)
            navigate("/")
        }
    }

    return ( 
        <div className="flex flex-col md:flex-row md:justify-center md:-space-x-100  md:items-center">
            
            <picture className="">
                <source media="(max-width: 465px)" srcSet="/mobileLogin.png" />
                <source media="(min-width: 1024px)" srcSet="/loginOrange.jpeg" />
                <img src="/loginImage.png" className="w-[90%] mx-auto md:w-[50%] md:mx-10" />
            </picture>

            <form className="mt-10 mx-5 md:mx-10 md:w-[30%]">
                <div className="flex justify-between">
                    <p className="font-[500]">Create account</p>
                    <p className="text-black/30">login with</p>
                </div>
                <div className="flex gap-2 justify-end *:text-white mt-5">
                    <div className="p-3 relative bg-black/20  aspect-square rounded-full w-10 "><FaGoogle /><div className="absolute left-0 top-0 z-10 w-10 overflow-hidden opacity-0"><GoogleLoginButton /></div></div>
                    <div className="p-3 bg-black/20 rounded-full w-max "><FaFacebookF /></div>
                    <div className="p-3 bg-black/20 rounded-full w-max "><FaLinkedinIn /></div>
                </div>

                <input onChange={(e)=> setEmail(e.target.value)} value={email} type="text" placeholder="Your Email" className="p-5 bg-white rounded-[7px] mt-5 w-[100%]" /> 
                <input onChange={(e)=> setPassword(e.target.value)} value={password} type="text" placeholder="Password" className="p-5 bg-white rounded-[7px] mt-5 w-[100%]" /> 
                

                <div className="flex justify-between mt-5 items-center">
                    <Link className="text-orange-500">don't Have an acccount?</Link>
                    <button disabled={loading} onClick={handleLogin} className="bg-orange-500 text-white py-2 px-5 rounded-full ">Next</button>
                </div>

                {error && <div className="bg-red-500 text-white text-center p-2 mx-auto w-[70%] rounded-[10px] mt-10">{error}</div>}
            
            </form>

            
            
        </div>
     );
}
 
export default TeacherLogin;