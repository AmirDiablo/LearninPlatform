import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Filter from "../components/Filter"
import Pagination from "../components/Pagination"
import { FaStar } from "react-icons/fa";
import Loader from "../components/Loader";
import BookLoader from "../components/BookLoader";

const Courses = () => {
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const [courses, setCourses] = useState([])
    const [teachers, setTeachers] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [page, setPage] = useState(useLocation().search.split("=")[1] ? useLocation().search.split("=")[1] : 1)
    const navigate = useNavigate()

    const fetchCourses = async()=> {
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:3000/api/course/allCourses?page="+page)
        const json = await response.json()

        if(response.ok) {
            setLoading(false)
            setError(null)
            setCourses(json.courses)
            setPageCount(json.pageCount)
        }

        if(!response.ok) {
            setLoading(false)
            setError(json.error)
        }
    }

    useEffect(()=> {
        fetchCourses()
    }, [])

    return ( 
        <div className="px-5 mb-10">

            <Filter setCourses={setCourses} changePage={setPage} setPageCount={setPageCount} setTeachers={setTeachers} />

            {teachers && 
                <div className="mt-10">
                {teachers?.map(teacher=> (
                    <div onClick={()=> navigate("/teacherProfile?q="+teacher._id)} className="flex items-center gap-2 bg-white border-[2px] border-black/10 p-2 rounded-2xl">
                        <img src={"http://localhost:3000/uploads/profiles/"+teacher.profile} className="w-20  rounded-full  object-cover" />
                        <div>
                            <p>{teacher.username}</p>
                            <p className="flex items-center gap-2"><FaStar className="text-yellow-400"/> 4.7</p>
                        </div>
                    </div>
                ))}
            </div>
            }

            <div className="flex flex-wrap md:gap-5 justify-center">
                {courses.map(course=> (
                    <div onClick={()=> navigate("/courseDetails?id="+course._id)} className="rounded-2xl my-10 flex flex-col  w-[100%] shadow-[8px_8px_16px_#bebebe,_-8px_-8px_16px_#ffffff] md:w-[48%] md:max-w-[400px]">
                        <img src={'http://localhost:3000/uploads/thumbnails/'+course.thumbnail} className="object-cover rounded-t-2xl aspect-video" />
                        {course.discount != 0 && <div className="flower bg-yellow-400 absolute flex items-center justify-center font-[600] -rotate-45">{course.discount}%</div>}
                        <div className="rounded-b-2xl bg-gray-200 h-[100%] p-5">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center justify-between w-[100%]">
                                    <div className="flex items-center gap-2">
                                        <img src={"http://localhost:3000/uploads/profiles/"+course.userId.profile} className="w-10 rounded-full object-cover"/>
                                        <p className="text-[15px]">{course.userId.username}</p>
                                    </div>
                                    <p className="bg-orange-200 text-orange-600 p-2 rounded-[7px]">{course.level}</p>
                                </div>
                            </div>
                            <strong>{course.title}</strong>
                            <p className="break-words">{course.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            {loading && <BookLoader />}

            {error && <div className="bg-red-500 text-white text-center p-2 mx-auto">{error}</div>}

            {page && <Pagination pageCount={pageCount} current={page} />}
            
        </div>
     );
}
 
export default Courses;