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
        <div className="lg:flex lg:h-screen lg:overflow-hidden">

  {/* سمت چپ: اطلاعات کاربر */}
  <div className="lg:w-[30%] overflow-y-hidden p-5">
    {info.map(item => (
      <div key={item._id}>
        <div className="flex items-center gap-5">
          <img src={`http://localhost:3000/uploads/profiles/${item.userId.profile}`} className="rounded-full object-cover aspect-square w-32" />
          <div>
            <p className="font-bold text-xl">{item.userId.username}</p>
            <p className="text-black/50">Web developer</p>
            <div className="flex *:text-xl mt-2">
              {[1, 2, 3, 4, 5].map(rate => {
                const decimal = item.rating % 1;
                const full = Math.floor(item.rating);
                return (
                  <div key={rate}>
                    {rate <= full
                      ? <FaStar className="text-yellow-500" />
                      : (rate - 1 < item.rating && decimal > 0)
                        ? <FaRegStarHalfStroke className="text-yellow-500" />
                        : <CiStar />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {item.instagram && <Link to={`https://www.instagram.com/${item.instagram}`} target="_blank" className="p-2 bg-white rounded-lg border border-black/10"><FaInstagram className="text-2xl text-purple-700" /></Link>}
          {item.linkedin && <Link to={`https://www.linkedin.com/${item.linkedin}`} target="_blank" className="p-2 bg-white rounded-lg border border-black/10"><BsLinkedin className="text-2xl text-blue-600" /></Link>}
          {item.youtube && <Link to={`https://www.youtube.com/${item.youtube}`} target="_blank" className="p-2 bg-white rounded-lg border border-black/10"><FaYoutube className="text-2xl text-red-600" /></Link>}
        </div>

        <p className="mt-4 font-semibold break-words">{item.bio}</p>
      </div>
    ))}
  </div>

  {/* سمت راست: دوره‌ها */}
  <div className="lg:w-[70%] overflow-y-auto p-5">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {courses.map(item => (
        <img
          key={item._id}
          onClick={() => navigate(`/courseDetails?q=${item._id}`)}
          src={`http://localhost:3000/uploads/thumbnails/${item.thumbnail}`}
          className="rounded-2xl object-cover aspect-square w-full cursor-pointer"
        />
      ))}
    </div>
  </div>

</div>



     );
}
 
export default TeacherProfile;