import TeachersDashTop from "../components/TeachersDashTop";
import demo from "../assets/design.png"
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import BookLoader from "../components/BookLoader";
import Loader from "../components/Loader"
import { useUser } from "../context/userContext";

const TeacherCoursesPage = () => {
    const {user} = useUser()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [courses, setCourses]  = useState([])
    const userId = JSON.parse(localStorage.getItem("user")).id

    const fetchCourses = async()=> {
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:3000/api/course/teacherCourses", {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if(response.ok) {
            setLoading(false)
            setError(null)
            setCourses(json)
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
        if(user?.token) {
            fetchCourses()
        }
    }, [user])

    return ( 
        <div className="lg:absolute lg:right-0 lg:w-[70%]">
            <TeachersDashTop active={'teacherCoursesPage'} />

            <div className="w-[85%] mx-auto flex flex-wrap justify-center md:space-x-5 ">

                {courses.map(course=> (
                    <div className="rounded-2xl my-10 flex flex-col  w-[100%] shadow-[8px_8px_16px_#bebebe,_-8px_-8px_16px_#ffffff] md:w-[40%]">
                        <img onClick={()=> navigate("/courseDetails?courseId="+course._id)} src={'http://localhost:3000/uploads/thumbnails/'+course.thumbnail} className="object-cover rounded-t-2xl aspect-video" />
                        <div className="rounded-b-2xl bg-gray-200 h-[100%] p-5">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 mb-2">
                                    <img src={"http://localhost:3000/uploads/profiles/"+course.userId.profile} className="w-10 rounded-full object-cover"/>
                                    <p className="text-[15px]">{course.userId.username}</p>
                                </div>
                                <button onClick={()=> navigate("editCourse?q="+course._id, {state: {course: course}})} className="bg-orange-500 hover:cursor-pointer text-white rounded-[7px] px-5 py-2">Edit</button>
                            </div>
                            <strong>{course.title}</strong>
                            <p className="break-words">{course.description}</p>
                        </div>
                    </div>
                ))}

            </div>

            {!error && <div className="bg-orange-500 p-5 rounded-full w-max text-white text-2xl shadow-[8px_8px_16px_#bebebe,_-8px_-8px_16px_#ffffff] fixed right-5 bottom-10" onClick={()=> navigate("createCourse")}><FaPlus /></div> }

                {error && <div className="bg-red-200 fixed left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] text-center rounded-2xl py-2 w-max px-5 mx-auto">{error}</div>}
                {loading && <BookLoader />}
        </div>
     );
}
 
export default TeacherCoursesPage;