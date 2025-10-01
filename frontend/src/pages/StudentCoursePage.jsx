import { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import TeachersDashTop from "../components/TeachersDashTop";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import BookLoader from "../components/BookLoader";

const StudentCoursesPage = () => {
    const {user} = useUser()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [courses, setCourses] = useState([])
    const navigate = useNavigate()

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

    const fetchCourses = async ()=> {
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:3000/api/course/bought", {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if(response.ok) {
            setError(null)
            setLoading(false)
            setCourses(json)
        }

        if(!response.ok) {
            setError(json.message)
            setLoading(false)
        }
    }

    useEffect(()=> {
        if(user?.token) {
            fetchCourses()
        }
    }, [user])

    return ( 
        <div className="lg:absolute lg:right-0 lg:w-[70%]">
            <TeachersDashTop active={'studentCoursesPage'} />

            {!loading && 
                <div className="w-[85%] mx-auto flex flex-wrap justify-center md:space-x-5 ">

                    {courses.map(course=> (
                        <div className="rounded-2xl my-10 flex flex-col  w-[100%] shadow-[8px_8px_16px_#bebebe,_-8px_-8px_16px_#ffffff] md:w-[40%]">
                            <img onClick={()=> navigate("/courseDetails?courseId="+course.courseId._id)} src={'http://localhost:3000/uploads/thumbnails/'+course.courseId.thumbnail} className="object-cover rounded-t-2xl aspect-video" />
                            <div className="rounded-b-2xl bg-gray-200 h-[100%] p-5">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 mb-2">
                                        <img src={"http://localhost:3000/uploads/profiles/"+course.courseId.userId.profile} className="w-10 rounded-full object-cover"/>
                                        <p className="text-[15px]">{course.courseId.userId.username}</p>
                                    </div>
                                </div>
                                <strong>{course.courseId.title}</strong>
                                <p className="break-words">{course.courseId.description}</p>
                            </div>
                        </div>
                    ))}

                </div>
            }

            {loading && <BookLoader />}
            {error && <div className="bg-red-200 fixed left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] text-center rounded-2xl py-2 w-max px-5 mx-auto">{error}</div>}

        </div>
     );
}
 
export default StudentCoursesPage;