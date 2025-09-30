import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useUser } from "../context/userContext";
import BookLoader from "../components/BookLoader";

const SignUp = () => {
    const [email, setEmail] = useState('')
    const [formNumber, setFormNumber] = useState(1)
    const [code, setCode] = useState(null)
    const [password, setPassword] = useState(null)
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [countdown, setCountdown] = useState()
    const [resendDisabled, setResendDisabled] = useState(false);
    const navigate = useNavigate()
    const {login} = useUser()


    const startCountdown = () => {
    setResendDisabled(true);
    let seconds = 60;
    setCountdown(seconds);
    
    const timer = setInterval(() => {
      seconds -= 1;
      setCountdown(seconds);
      
      if (seconds <= 0) {
        clearInterval(timer);
        setResendDisabled(false);
      }
    }, 1000);
    };

    const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:3000/api/verification/send-code', { email });
      setFormNumber(2);
      startCountdown();
    } catch (err) {
      setError(err.response?.data?.error || 'Error sending verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:3000/api/verification/verify-code', {
        email,
        code
      });
      setFormNumber(3);
    } catch (err) {
      setError(err.response?.data?.error || 'خطا در تأیید کد');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:3000/api/verification/send-code', { email });
      startCountdown();
    } catch (err) {
      setError(err.response?.data?.error || 'خطا در ارسال مجدد کد');
    } finally {
      setLoading(false);
    }
  };

  const handlePassSubmit = async()=> {
    setLoading(true);
    setError('');
    setFormNumber(4)
  }

  const createAccount = async(e)=> {
    e.preventDefault()
    
    const response = await fetch("http://localhost:3000/api/user/signup", {
        method: "POST",
        body: JSON.stringify({username, email, password}),
        headers: {
            "Content-Type" : "application/json"
        }
    })

    const json = await response.json()

    if(response.ok) {
        setError(null)
        setLoading(false)
        localStorage.setItem("user", JSON.stringify(json))
        console.log(JSON.stringify(json))
        login(json._id)
        navigate('/')
    }
    if(!response.ok) {
        console.log(json.error)
        setError(json.error)
        setLoading(false)
    }
  }



    return ( 
        <div className="flex flex-col md:flex-row md:justify-center md:-space-x-100  md:items-center">

            <picture className="">
                <source media="(max-width: 465px)" srcSet="/mobileLogin.png" />
                <source media="(min-width: 1024px)" srcSet="/loginOrange.jpeg" />
                <img src="/loginImage.png" className="w-[90%] mx-auto md:w-[50%] md:mx-10" />
            </picture>

            {formNumber == 1 && 
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
                    

                    <div className="flex justify-between mt-5">
                        <Link className="text-orange-500">Have an acccount?</Link>
                        <button onClick={handleEmailSubmit} className="bg-orange-500 text-white py-2 px-5 rounded-full ">Next</button>
                    </div>

                    {error && <div className="bg-red-500 text-white text-center p-2 mx-auto w-[70%] rounded-[10px] mt-10">{error}</div>}
                
                </form>
            }

            {formNumber == 2 && 
                <form className="mt-10 mx-5 md:mx-10 md:w-[30%]">
                    <div className="flex justify-between">
                        <p className="font-[500]">Create account</p>
                        <p className="text-black/30">login with</p>
                    </div>
                    <div className="flex gap-2 justify-end *:text-white mt-5">
                        <div className="p-3 bg-black/20 rounded-full w-max "><FaGoogle /></div>
                        <div className="p-3 bg-black/20 rounded-full w-max "><FaFacebookF /></div>
                        <div className="p-3 bg-black/20 rounded-full w-max "><FaLinkedinIn /></div>
                    </div>

                    <input onChange={(e)=> setCode(e.target.value)} value={code} type="text" placeholder="Verification code" className="p-5 bg-white rounded-[7px] mt-5 w-[100%]" /> 
                    
                    <div className="flex justify-between mt-5">
                        <button type="button" 
                            onClick={handleResendCode} 
                            disabled={resendDisabled || loading}
                            className="text-orange-500">{resendDisabled ? `Resend (${countdown})` : 'Resend Code'}
                        </button>
                        <button onClick={handleCodeSubmit} className="bg-orange-500 text-white py-2 px-5 rounded-full ">Next</button>
                    </div>

                    {error && <div className="bg-red-500 text-white text-center p-2 mx-auto w-[70%] rounded-[10px] mt-10">{error}</div>}
                </form>
            }

            {formNumber == 3 && 
                <form className="mt-10 mx-5 md:mx-10 md:w-[30%]">
                    <div className="flex justify-between">
                        <p className="font-[500]">Create account</p>
                        <p className="text-black/30">login with</p>
                    </div>
                    <div className="flex gap-2 justify-end *:text-white mt-5">
                        <div className="p-3 bg-black/20 rounded-full w-max "><FaGoogle /></div>
                        <div className="p-3 bg-black/20 rounded-full w-max "><FaFacebookF /></div>
                        <div className="p-3 bg-black/20 rounded-full w-max "><FaLinkedinIn /></div>
                    </div>

                    <input onChange={(e)=> setPassword(e.target.value)} value={password} type="text" placeholder="Password" className="p-5 bg-white rounded-[7px] mt-5 w-[100%]" /> 
                    
                    <div className="flex justify-end mt-5">
                        <button onClick={handlePassSubmit} className="bg-orange-500 text-white py-2 px-5 rounded-full ">Next</button>
                    </div>

                    {error && <div className="bg-red-500 text-white text-center p-2 mx-auto w-[70%] rounded-[10px] mt-10">{error}</div>}
                </form>
            }

            {formNumber == 4 && 
                <form className="mt-10 mx-5 md:mx-10 md:w-[30%]">
                    <div className="flex justify-between">
                        <p className="font-[500]">Create account</p>
                        <p className="text-black/30">login with</p>
                    </div>
                    <div className="flex gap-2 justify-end *:text-white mt-5">
                        <div className="p-3 bg-black/20 rounded-full w-max "><FaGoogle /></div>
                        <div className="p-3 bg-black/20 rounded-full w-max "><FaFacebookF /></div>
                        <div className="p-3 bg-black/20 rounded-full w-max "><FaLinkedinIn /></div>
                    </div>

                    <input onChange={(e)=> setUsername(e.target.value)} value={username} type="text" placeholder="First name" className="p-5 bg-white rounded-[7px] mt-5 w-[100%]" />                  

                    <div className="flex justify-end mt-5">
                        <button onClick={createAccount} className="bg-orange-500 text-white py-2 px-5 rounded-full ">{loading && <div className="rounded-full animate-spin border-t-4 border-white w-5 aspect-square"></div>}Sign up</button>
                    </div>

                    {error && <div className="bg-red-500 text-white text-center p-2 mx-auto w-[70%] rounded-[10px] mt-10">{error}</div>}
                </form>
            }
            
        </div>
     );
}
 
export default SignUp;