import { useState } from "react";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { FaGoogle } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import axios from "axios";
import { CgProfile } from "react-icons/cg";
import { GrCertificate } from "react-icons/gr";

const TeacherSignup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [step, setStep] = useState(1)
    const [code, setCode] = useState('')
    const [countdown, setCountdown] = useState()
    const [resendDisabled, setResendDisabled] = useState(false);
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState('')
    const [error, setError] = useState(null)
    const [role, setRole] = useState("teacher")
    const [linkedIn, setLinkedIn] = useState('')
    const [website, setWebsite] = useState('')
    const [bio, setBio] = useState('')
    const [resume, setResume] = useState('')
    const {login} = useUser()
    const navigate = useNavigate()


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
      setStep(2);
      startCountdown();
    } catch (err) {
      setError(err.response?.data?.error || 'خطا در ارسال کد تأیید');
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
      setStep(3);
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

    const handleRegister = async (e) => {
      e.preventDefault()
      const formData = new FormData()
      formData.append("profile", profile)
      formData.append("username", username)
      formData.append("email", email)
      formData.append("password", password)
      formData.append("role", role)
    
    const response = await fetch("http://localhost:3000/api/user/signup", {
        method: "POST",
        body: formData
    })

    const json = await response.json()

    if(response.ok) {
        setError(null)
        setLoading(false)
        localStorage.setItem("user", JSON.stringify(json))
        console.log(JSON.stringify(json))
        login(json)
        setStep(4)
    }
    if(!response.ok) {
        setError(json.error)
        setLoading(false)
    }
    }


    const upload = async (e) => {
      e.preventDefault()
      const userId = JSON.parse(localStorage.getItem("user")).id
      const formData = new FormData()
      formData.append("linkedIn", linkedIn)
      formData.append("website", website)
      formData.append("bio", bio)
      formData.append("resume", resume)
      formData.append("userId", userId)

      const response = await fetch("http://localhost:3000/api/user/teacherProfile", {
        method: "POST",
        body: formData
      })

      const json = await response.json()

      if(!response.ok) {
        setError(json.message)
        setLoading(false)
      }

      if(response.ok) {
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

            {step == 1 && 
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
                        <Link to="/teacherLogin" className="text-orange-500">Have an acccount?</Link>
                        <button onClick={handleEmailSubmit} className="bg-orange-500 text-white py-2 px-5 rounded-full ">Next</button>
                    </div>
                
                </form>
            }

            {step == 2 && 
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

                    <input onChange={(e)=> setCode(e.target.value)} value={code} type="text" placeholder="verification code" className="p-5 bg-white rounded-[7px] mt-5 w-[100%]" /> 
                    

                    <div className="flex justify-between mt-5">
                        <button type="button" 
                            onClick={handleResendCode} 
                            disabled={resendDisabled || loading}
                            className="text-orange-500">{resendDisabled ? `Resend (${countdown})` : 'Resend Code'}
                        </button>
                        <button onClick={handleCodeSubmit} className="bg-orange-500 text-white py-2 px-5 rounded-full ">Next</button>
                    </div>
                
                </form>
            }

            {step == 3 &&
              
                <form className="mt-10 mx-5 md:mx-10 md:w-[30%] space-y-5">
                  <input type="text" placeholder="Username" onChange={(e)=> setUsername(e.target.value)} value={username} className="p-5 bg-white rounded-[7px] mt-5 w-[100%]" />
                  <input type="text" placeholder="Password" onChange={(e)=> setPassword(e.target.value)} value={password} className="p-5 bg-white rounded-[7px] w-[100%]" />
                  <div className="flex justify-between w-[100%]">
                    <div className="relative text-white text-3xl aspect-square bg-orange-500 rounded-[7px] p-2" ><CgProfile className="mx-auto"/><input type="file" name="profile" onChange={(e)=> setProfile(e.target.files[0])} className="absolute top-0 left-0 w-[100%] h-[100%] rounded-[7px] opacity-0" /></div>
                    <button className="bg-orange-500 text-white py-2 px-5 rounded-full " onClick={handleRegister}>Register</button>
                  </div>
                </form>
              
            }

            {step == 4 &&
                <form className="mt-10 mx-5 md:mx-10 md:w-[30%] space-y-5">
                  <input type="text" onChange={(e)=> setLinkedIn(e.target.value)} value={linkedIn} placeholder="LinkedIn" className="bg-white p-5 rounded-[7px] w-[100%] " />
                  <input type="text" onChange={(e)=> setWebsite(e.target.value)} value={website} placeholder="Website" className="bg-white p-5 rounded-[7px] w-[100%] " />
                  <textarea placeholder="bio" onChange={(e)=> setBio(e.target.value)} value={bio} className="resize-none w-[100%] rounded-[7px] p-5 bg-white"/>
                  <div className="flex justify-between items-center">
                    <div className="relative w-15 flex justify-center items-center bg-orange-500 text-white text-3xl aspect-square rounded-[7px]"><GrCertificate className="mx-auto "/><input type="file" name="resume" onChange={(e)=> setResume(e.target.files[0])} className="w-[100%] h-[100%] absolute left-0 top-0 opacity-0" /></div>
                    <button onClick={upload} className="text-white bg-orange-500 py-2 px-5 rounded-full">upload</button>
                  </div>
                </form>
              
            }

            {error && <div className="bg-red-500 text-white p-2 w-[50%] mx-auto text-center">{error}</div>}

        </div>
     );
}
 
export default TeacherSignup;