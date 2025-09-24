import { useUser } from "../context/userContext";
import { FaJs } from "react-icons/fa";
import TeachersDashTop from "../components/TeachersDashTop";
import { PiBookBookmarkBold } from "react-icons/pi";
import { FaStar } from "react-icons/fa";
import { MdGroup } from "react-icons/md";
import { FaDollarSign } from "react-icons/fa";
import { useState } from "react";
import { useEffect } from "react";
import Donut from "../components/Donut";
import Progress from "../components/Progress";

const TeacherDashboard = () => {
    const {user} = useUser()
    const [error, setError] = useState()
    const [loading, setLoading] = useState()
    const [statics, setStatcis] = useState([])

    const teacherStatics = async ()=> {
        const response = await fetch("http://localhost:3000/api/user/teacherStatics", {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if(response.ok) {
            setLoading(false)
            setError(null)
            setStatcis(json)
        }

        if(!response.ok) {
            setLoading(false)
            setError(json.message)
        }
    }

    useEffect(()=> {
        if(user?.token) {
            teacherStatics()
        }
    }, [user])

    return ( 
        <div>

            <div className="lg:w-[30%]">
                <TeachersDashTop active={'teacherdashboard'} /> 
            </div>
            
            {statics.map(item=> (
                <div className="lg:w-[70%] lg:absolute lg:right-0">

                    <div className="flex justify-between items-center mx-5">
                        <p className="text-2xl">Welcome back, {item.username}</p>
                        <img src={"http://localhost:3000/uploads/profiles/"+item.profile} className="rounded-full object-cover w-30" />
                    </div>

                    <div className="flex w-[100%] *:w-[100%] gap-2 px-5 mt-10 *:p-5">
                        <div className="flex flex-col items-center bg-white rounded-2xl border-[2px] border-black/10">
                            <div className="text-[40px] text-green-700"><PiBookBookmarkBold /></div>
                            <p className="text-[30px]">{item.courseCount}</p>
                            <p>Courses</p>
                        </div>

                        <div className="flex flex-col items-center bg-white border-[2px] border-black/10 rounded-2xl">
                            <div className="text-[40px] text-yellow-500"><FaStar /></div>
                            <p className="text-[30px]">{Number(item.rating.toFixed(1))}</p>
                            <p>rating</p>
                        </div>

                        <div className="flex flex-col items-center border-[2px] border-black/10 bg-white rounded-2xl">
                            <div className="text-[40px] text-blue-500"><MdGroup /></div>
                            <p className="text-[30px]">{item.studentCount}</p>
                            <p>students</p>
                        </div>
                    </div>

                    <div className="bg-white mb-10 rounded-2xl border-[2px] border-black/10 p-5 flex flex-col items-center mx-5 mt-2">
                        <div className="text-[30px] text-green-600"><FaDollarSign /></div>
                        <div>
                            <p className="text-[30px] text-center">{item.income}</p>
                            <p>Income</p>
                        </div>
                    </div>

                    <Donut statics={item.enrollmentCounts} enrollmentCount={item.totalEnrollment} />
                    <div className="flex items-center">
                        <Progress total={item.totalEnrollment} count={item.finishedCount} />
                        <p className="font-[600] -translate-y-[20px] text-2xl text-orange-500">{item.finishedCount * 100 / item.totalEnrollment}% of your students finish courses</p>
                    </div>

            </div>
            ))}

        </div>
     );
}
 
export default TeacherDashboard;