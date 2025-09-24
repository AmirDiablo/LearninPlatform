import { useLocation, useNavigate } from "react-router-dom";
import TeachersDashTop from "../components/TeachersDashTop";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { useEffect } from "react";
import { useUser } from "../context/userContext";
import Progress from "../components/Progress";
import { TfiWrite } from "react-icons/tfi";
import { MdGroup } from "react-icons/md";
import QuizDonut from "../components/QuizDonut";

const QuizStatcis = () => {
    const {user} = useUser()
    const navigate = useNavigate()
    const quizId = useLocation().search.split("=")[1]
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const [statics, setStatics] = useState([])

    let colors = ['red', 'blue', "yellow", "green"]
    const colorClasses = [
        'bg-red-500',
        'bg-blue-500',
        'bg-yellow-500',
        'bg-green-500'
    ];

    const fetchStatics = async()=> {
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:3000/api/quiz/quizStatics?quizId="+quizId, {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if(!response.ok) {
            setError(json.message)
            setLoading(false)
        }

        if(response.ok) {
            setError(null)
            setLoading(false)
            setStatics(json)
        }
    }

    useEffect(()=> {
        if(user?.token) {
            fetchStatics()
        }
    }, [user])

    console.log(statics)

    return ( 
        <div>
            <TeachersDashTop  active={'quizStatics'} />

            <div className="lg:w-[70%] lg:absolute lg:right-0">
                {statics.map(item=> (
                    <div>

                        <div className="columns-2 w-[100%] px-5 mb-2 mt-10">
                            <div className="bg-white border-2 border-black/20 rounded-[7px] p-5">
                                <div className="flex items-center gap-2 w-max mx-auto mb-2">
                                    <TfiWrite className="text-2xl text-pink-500" />
                                    <p className="font-[600]">{item.particiapteCount}</p>
                                </div>
                                <p className="text-center">Participation</p>
                            </div>

                            <div className=" bg-white border-2 border-black/20 rounded-[7px] p-5">
                                <div className="flex items-center gap-2 w-max mx-auto mb-2">
                                    <MdGroup className="text-2xl text-blue-500" />
                                    <p className="font-[600]">{item.enrollment}</p>
                                </div>
                                <p className="text-center">Course Student</p>
                            </div>
                        </div>
 
                        <div className="md:flex md:gap-5 mx-5 ">
                            <div className="flex-1 flex flex-col items-center bg-white border-2 border-black/20 rounded-2xl p-2">
                                <div><Progress total={item?.enrollment} count={item?.particiapteCount} /></div>
                                <p className="font-[600] text-[15px] w-[80%] text-center -translate-y-[20px]">
                                {item.particiapteCount * 100 / item.enrollment}% of your Students participated in this quiz
                                </p>
                            </div>

                            <div className="flex-1 md:mt-0 mt-2 flex flex-col items-center bg-white border-2 border-black/20 rounded-2xl p-2">
                                <div><QuizDonut statics={item.levels} enrollmentCount={item.particiapteCount} /></div>
                                <p className="font-[600] text-[15px] w-[80%] text-center -translate-y-[20px]">
                                See level of your student here
                                </p>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

        </div>
     );
}
 
export default QuizStatcis;