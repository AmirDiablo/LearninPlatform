import TeachersDashTop from "../components/TeachersDashTop";
import { useEffect, useState } from "react";
import {useUser} from "../context/userContext"
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import BookLoader from "../components/BookLoader";

const StudentProfileSetting = () => {
    const navigate = useNavigate()
    const {user} = useUser()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [username, setUsername] = useState('')
    const [saving, setSaving] = useState(false)
    const [file, setFile] = useState()
    const [preview, setPreview] = useState(null)

    const fetchUserInfo = async()=> {
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:3000/api/user/infos", {
            method: "GET",
            headers: {
                "Content-Type" : "application/json",
                "authorization" : `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if(response.ok) {
            setLoading(false)
            setError(null)
            setUsername(json.username)
            setFile(json.profile)
        }

        if(!response.ok) {
            setLoading(false)
            setError(json.message)
        }
    }

    useEffect(()=> {

        let width = window.innerWidth
        if(width >= 1024) {
            document.querySelector(".navButton").style.display = "none"
        }

        window.addEventListener("resize", ()=> {
            const width = window.innerWidth
            if(width >= 1024) {
                document.querySelector(".navButton").style.display = "none"
            }else{
                document.querySelector(".navButton").style.display = "flex"
            }
        })
    }, [])

    const save = async () => {
        setSaving(true);
        if (username) {
            const formData = new FormData();
            formData.append("name", username);

            // فقط اگر فایل جدید انتخاب شده باشه، اضافه کن
            if (file instanceof File) {
                formData.append("profile", file);
            }

            const response = await fetch("http://localhost:3000/api/user/editStudentProfile", {
                method: "PATCH",
                body: formData,
                headers: {
                    "authorization": `Bearer ${user?.token}`
                }
            });

            const json = await response.json();

            if (response.ok) {
                setSaving(false);
                setError(null);
                navigate("/studentdashboard");
            } else {
                setSaving(false);
                setError(json.message);
            }
        }
    };


    const chnagePreview = (e)=> {
        setFile(e.target.files[0])
        const files = e.target.files[0]
        if(files) {
            const reader = new FileReader()
            reader.onloadend = ()=> {
                setPreview(reader.result)
            }

            reader.readAsDataURL(files)
        }
    }

    useEffect(()=> {
        if(user?.token) {
            fetchUserInfo()
        }
    }, [user])

    return ( 
        <div>

            <div className="lg:w-[30%] z-10">
                <TeachersDashTop active={'profileSetting'} /> 
            </div>

            {!loading && 
            <div className="md:w-[50%] lg:w-[70%] lg:absolute lg:right-0 lg:px-20 mx-auto">

                <div className="flex items-center justify-between px-5 mt-5">
                    <button onClick={()=> navigate(-1)} className="text-2xl text-white bg-black p-3 rounded-2xl"><FaArrowLeft /></button>
                    <button onClick={save} className="bg-white flex items-center gap-2 text-black font-[600] p-3 rounded-2xl border-[2px] border-black/10">{saving && <div className="rounded-full animate-spin border-t-4 border-orange-500 w-5 aspect-square gap-2"></div>}Save</button>
                </div>

                <div className="relative mt-10">
                    {preview ? <img src={preview} alt="cover" className="w-45 object-cover rounded-full aspect-square mx-auto" /> : <img src={"http://localhost:3000/uploads/profiles/"+file} alt="cover" className="w-45 object-cover aspect-square mx-auto rounded-full" />}
                    <input onChange={chnagePreview} type="file" name="profile" id="profile" className="opacity-0 absolute top-0 left-[50%] -translate-x-[50%] w-45 aspect-square rounded-full" />
                </div>
                <div className="flex flex-col w-[90%] mx-auto mt-10">
                    <label >Username</label>
                    <input type="text" className="text-center bg-white text-xl focus:outline-none border-1 rounded-2xl p-2 " onChange={(e)=> setUsername(e.target.value)} value={username} />
                </div>

            </div>
            }

            {error && <div className="bg-red-200 fixed left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] text-center rounded-2xl py-2 w-max px-5 mx-auto">{error}</div>}
            {loading && <BookLoader />}
            
        </div>
     );
}
 
export default StudentProfileSetting;