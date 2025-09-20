import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { MdGroup } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";
import { BsLinkedin } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";
import { FaRegStarHalfStroke } from "react-icons/fa6";

const TeacherProfile = () => {
    const teacherId = useLocation().search.split("=")[1]
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [info, setInfo] = useState([])
    const [courses, setCourses] = useState([])
    const navigate = useNavigate()

    const fetchTeacherProfile = async ()=> {
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:3000/api/user/teacherInfo?q="+teacherId)
        const json = await response.json()

        if(!response.ok) {
            setLoading(false)
            setError(json.message)
        }

        if(response.ok) {
            setLoading(false)
            setError(null)
            setInfo(json)
        }
    }

    const fetchTeacherCourses = async ()=> {
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:3000/api/course/teacherCourses?q="+teacherId)
        const json = await response.json()

        if(!response.ok) {
            setLoading(false)
            setError(json.message)
        }

        if(response.ok) {
            setLoading(false)
            setError(null)
            setCourses(json)
        }
    }

    useEffect(()=> {
        fetchTeacherProfile()
        fetchTeacherCourses()
    }, [])

    return ( 
        <div className="lg:flex">

            <div className="lg:w-[30%] xl:ml-15">
                {info.map(item=> (
                <div>
                    <div className="flex items-center gap-10 mx-5">
                        <img src={"http://localhost:3000/uploads/profiles/"+item.userId.profile} className="rounded-full object-cover aspect-square w-40" />
                        <div>
                            <p className="font-[700] text-[23px]">{item.userId.username}</p>
                            <p className="text-black/50">Web developer</p>
                            <div className="flex *:text-xl w-max">
                                {(item.rating.toString().split(".")[1] !== undefined && 0 < item.rating && item.rating < 1) ? <FaRegStarHalfStroke className="text-yellow-500 " /> : <div data-rate="1">{1 <= item.rating ? <FaStar className="text-yellow-500" /> : <CiStar  />}</div>}
                                {(item.rating.toString().split(".")[1] !== undefined && 1 < item.rating && item.rating < 2) ? <FaRegStarHalfStroke className="text-yellow-500 " /> : <div data-rate="2">{2 <= item.rating ? <FaStar className="text-yellow-500" /> : <CiStar  />}</div>}
                                {(item.rating.toString().split(".")[1] !== undefined && 2 < item.rating && item.rating < 3) ? <FaRegStarHalfStroke className="text-yellow-500 " /> : <div data-rate="3">{3 <= item.rating ? <FaStar className="text-yellow-500" /> : <CiStar  />}</div>}
                                {(item.rating.toString().split(".")[1] !== undefined && 3 < item.rating && item.rating < 4) ? <FaRegStarHalfStroke className="text-yellow-500 " /> : <div data-rate="4">{4 <= item.rating ? <FaStar className="text-yellow-500" /> : <CiStar  />}</div>}
                                {(item.rating.toString().split(".")[1] !== undefined && 4 < item.rating && item.rating < 5) ? <FaRegStarHalfStroke className="text-yellow-500 " /> : <div data-rate="5">{5 <= item.rating ? <FaStar className="text-yellow-500" /> : <CiStar  />}</div>}
                            </div>
                        </div>
                    </div>

                    <div className="mx-5 mt-5 flex gap-2">
                        {item.instagram && <Link target="_blank" to={"https://www.instagram.com/"+item.instagram} className="bg-white p-2 rounded-[10px] border-[2px] border-black/10"><FaInstagram className="text-3xl text-purple-700"/></Link>}
                        {item.linkedin && <Link target="_blank" to={"https://www.linkedin.com/"+item.linkedin} className="p-2 bg-white rounded-[10px] border-[2px] border-black/10"><BsLinkedin className="text-3xl text-blue-600"/></Link>}
                        {item.youtube && <Link target="_blank" to={"https://www.youtube.com/"+item.youtube} className="p-2 bg-white rounded-[10px] border-[2px] border-black/10"><FaYoutube className="text-red-600 text-3xl" /></Link>}
                    </div>

                    <p className="mx-5 mt-5 font-[600]">{item.bio}</p>
                </div>
            ))}
            </div>
            
            
            <div className="flex justify-center flex-wrap lg:absolute lg:whitespace-nowrap lg:right-0 lg:overflow-y-auto mx-5 space-x-2 space-y-2 mt-10 lg:w-[70%] lg:h-200">
                {courses.map(item=> (
                    <img onClick={()=> navigate("/courseDetails?q="+item._id)} src={'http://localhost:3000/uploads/thumbnails/'+item.thumbnail} className="rounded-2xl object-cover aspect-square w-[45%] lg:w-[25%] max-w-70" />
                ))}
            </div>
            
        </div>
     );
}
 
export default TeacherProfile;