import { useNavigate } from "react-router-dom";
import TeachersDashTop from "../components/TeachersDashTop";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { useEffect } from "react";
import { useUser } from "../context/userContext";

const StudentQuizPage = () => {
    const {user} = useUser()
    const navigate = useNavigate()
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const [quizes, setQuizes] = useState([])

    const fetchQuizez = async ()=> {
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:3000/api/quiz/AllQuizes", {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
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
            setQuizes(json)
        }
    }

    useEffect(()=> {
        if(user?.token) {
            fetchQuizez()
        }
    }, [user])

    return ( 
        <div>
            <TeachersDashTop  active={'teacherQuizPage'} />

            <div className="lg:w-[70%] lg:absolute lg:right-0">

                <div className="mx-5 mt-10">
                    <p className="mb-2 font-[600]">Quizes</p>
    
                    <div className="md:flex space-y-2 md:space-x-5 md:flex-wrap">
                        {quizes.map(quiz=> (
                            <div className="flex gap-2  bg-white border-[2px] border-black/10 p-2 rounded-2xl md:w-[40%]">
                                <img src={'http://localhost:3000/uploads/thumbnails/'+quiz.courseId.thumbnail} className="rounded-2xl object-cover w-20" />
                                <div>
                                    <p className="font-[700]">{quiz.courseId.title}</p>
                                    <p className="inline mr-5">{quiz.time / 60} minutes</p>
                                    <p className="inline">{quiz.questions.length} questions</p>
                                </div>
                            </div>
                    )   )}
                    </div>

                </div>

            </div>
        </div>
     );
}
 
export default StudentQuizPage;