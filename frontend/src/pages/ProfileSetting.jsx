import { useEffect, useState } from "react";
import {useUser} from "../context/userContext"
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import TeachersDashTop from "../components/TeachersDashTop";
import BookLoader from "../components/BookLoader";

const ProfileSetting = () => {
    const [info, setInfo] = useState([])
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const [saveLoading, setSaveLoading] = useState(false)
    const [username, setUsername] = useState()
    const [bio, setBio] = useState()
    const [file, setFile] = useState()
    const [preview, setPreview] = useState(null)
    const [LinkedIn, setLinkedIn] = useState("")
    const [instagram, setInstagram] = useState("")
    const [youtube, setYoutube] = useState("")
    const user = JSON.parse(localStorage.getItem("user"))
    const navigate = useNavigate()

    const fetchUserInfo = async()=> {
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:3000/api/user/teacherInfo?q="+user.id, {
            method: "GET",
            headers: {
                "Content-Type" : "application/json",
                "authorization" : `Bearer ${user.token}`
            }
        })
            const json = await response.json()

            if(response.ok) {
                setError(null)
                setLoading(false)
                setInfo(json)
                setUsername(json[0].userId.username)
                setBio(json[0].bio)
                setInstagram(json[0].instagram)
                setLinkedIn(json[0].linkedin)
                setYoutube(json[0].youtube)
                setFile(json[0].userId.profile)
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

    useEffect(()=> {
        fetchUserInfo()
    }, [])

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

    const save = async()=> {
        setSaveLoading(true)
        if(username && file) {
            const formData = new FormData()
            formData.append("name", username)
            formData.append("bio", bio)
            formData.append("instagram", instagram)
            formData.append("linkedIn", LinkedIn)
            formData.append("youtube", youtube)
            formData.append("profile", file)
            const response = await fetch("http://localhost:3000/api/user/editProfile", {
                method: "PATCH",
                body: formData,
                headers: {
                    "authorization" : `Bearer ${user?.token}`
                }
            })

            const json = await response.json()

            if(response.ok) {
                setError(null)
                setSaveLoading(false)
                navigate("/teacherdashboard")
            }else{
                setSaveLoading(false)
                setError(json.message)
            }
        }
    }

    return ( 
        <div>

            <div className="lg:w-[30%] z-10">
                <TeachersDashTop active={'profileSetting'} /> 
            </div>

            {!loading && 
                <div className="md:w-[50%] lg:w-[70%] lg:absolute lg:right-0 lg:px-20 mx-auto">

                    <div className="flex items-center justify-between px-5 mt-5">
                        <button onClick={()=> navigate(-1)} className="text-2xl text-white bg-black p-3 rounded-2xl"><FaArrowLeft /></button>
                        <button disabled={saveLoading} onClick={save} className="bg-white text-black font-[600] p-3 rounded-2xl border-[2px] border-black/10 flex items-center">{saveLoading && <div className="rounded-full animate-spin border-t-4 border-orange-500 w-5 aspect-square gap-2"></div>} Save</button>
                    </div>

                    <div className="relative mt-10">
                        {preview ? <img src={preview} alt="cover" className="w-[50%] object-cover rounded-full aspect-square mx-auto" /> : <img src={"http://localhost:3000/uploads/profiles/"+file} alt="cover" className="w-45 object-cover aspect-square mx-auto rounded-full" />}
                        <input onChange={chnagePreview} type="file" name="profile" id="profile" className="opacity-0 absolute top-0 left-[50%] -translate-x-[50%] w-45 aspect-square rounded-full" />
                    </div>
                    <div className="flex flex-col w-[90%] mx-auto mt-10">
                        <label >Username</label>
                        <input type="text" className="text-center bg-white text-xl focus:outline-none border-1 rounded-2xl p-2 " onChange={(e)=> setUsername(e.target.value)} value={username} />
                        <label className="mt-2">Bio</label>
                        <textarea className="border-[1px] bg-white rounded-2xl resize-none h-20 text-[15px] p-5" onChange={(e)=> setBio(e.target.value)} value={bio} />
                        <label  className="mt-2">Instagram</label>
                        <input onChange={(e)=> setInstagram(e.target.value)} value={instagram} type="text" className="border-[1px] text-purple-700 bg-white rounded-2xl resize-none text-[15px] p-3" />
                        <label  className="mt-2">LinkedIn</label>
                        <input onChange={(e)=> setLinkedIn(e.target.value)} value={LinkedIn} type="text" className="border-[1px] bg-white text-blue-700 rounded-2xl resize-none text-[15px] p-3" />
                        <label  className="mt-2">Youtube</label>
                        <input onChange={(e)=> setYoutube(e.target.value)} value={youtube} type="text" className="border-[1px] bg-white text-red-500 rounded-2xl resize-none text-[15px] p-3" />
                    </div>

                </div>
            }
            

            {error && <div className="bg-red-200 fixed left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] text-center rounded-2xl py-2 w-max px-5 mx-auto">{error}</div>}
            {loading && <BookLoader />}
            
        </div>
     );
}
 
export default ProfileSetting;