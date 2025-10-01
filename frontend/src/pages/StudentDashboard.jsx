import { useUser } from "../context/userContext";
import { FaJs } from "react-icons/fa";
import TeachersDashTop from "../components/TeachersDashTop";
import { useEffect, useState } from "react";
import { FaCode } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import BookLoader from "../components/BookLoader";


const StudentDashboard = () => {
    const {user} = useUser()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [info, setInfo] = useState([])
    const navigate = useNavigate()

    const fetchUser = async ()=> {
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:3000/api/user/infos", {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if(response.ok) {
            setError(null)
            setLoading(false)
            setInfo(json)
        }

        if(!response.ok) {
            setError(json.message)
            setLoading(false)
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
        if(user?.token) {
            fetchUser()
        }
    }, [user])

    return ( 
        <div>

            <div className="lg:w-[30%]">
                <TeachersDashTop active={'studentdashboard'} /> 
            </div>
            
            {!loading && 
                <div className="lg:w-[70%] lg:absolute lg:right-0">
                    <div className="flex justify-between items-center mx-5">
                        <p className="text-2xl">Welcome back, {info.username}</p>
                        <img src={"http://localhost:3000/uploads/profiles/"+info.profile} className="rounded-full object-cover w-30" />
                    </div>

                    <div className="mx-5 mt-10">
                        <p className="text-[18px]">My Courses</p>
                        {info?.courses?.map(item=> (
                            <div className="w-[100%] flex justify-between gap-5 bg-white p-5 mt-2">
                                <div className="w-[100%]">
                                    <strong>{item.course.title}</strong>
                                    <div className="w-[100%] h-[10px] bg-red-200 rounded-full"><div style={{width: `${item?.progress}%`}} className={`bg-orange-500 h-[100%] rounded-full `}></div></div>
                                </div>
                                <button onClick={()=> navigate("/courseDetails?courseId="+item.course._id)} className="bg-orange-500 text-white text-center rounded-[7px] px-5 py-2">Continue</button>
                        </div>
                        ))}
                    </div>

                    <div className="mx-5 mt-10">
                        <p className="text-[18px]">Recommended</p>
                        {info?.recommended?.map(item=> (
                            <div onClick={()=> navigate("/courseDetails?courseId="+item._id)} className="flex items-center gap-5 p-2 bg-white rounded-2xl mt-2">
                                <div className="text-4xl text-white bg-orange-500 p-2 rounded-xl"><FaCode className="rounded-2xl"/></div>
                                <p className="text-xl">{item.title}</p>
                            </div>
                        ))}
                    </div>


                </div>
            }

            {loading && <BookLoader />}
            {error && <div className="bg-red-200 fixed left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] text-center rounded-2xl py-2 w-max px-5 mx-auto">{error}</div>}

        </div>
     );
}
 
export default StudentDashboard;