import { useNavigate } from "react-router-dom";
import TeachersDashTop from "../components/TeachersDashTop";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { useEffect } from "react";

const TeacherQuizPage = () => {
    const navigate = useNavigate()
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const [quizes, setQuizes] = useState([])

    const fetchQuizes = async()=> {
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:3000/api/quiz/teacherQuizes", {
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
        fetchQuizes()
    }, [])

    return ( 
        <div>
            <TeachersDashTop  active={'teacherQuizPage'} />

            <div className="lg:w-[70%] lg:absolute lg:right-0">

                <div className="mx-5 mt-10">
                    <p className="mb-2 font-[600]">Created Quizes</p>
    
                    <div className="md:flex space-y-2 md:space-x-5 md:flex-wrap">
                        {quizes.map(quiz=> (
                            <div onClick={()=> navigate("quizStatics?quizId="+quiz._id)} className="flex gap-2  bg-white border-[2px] border-black/10 p-2 rounded-2xl md:w-[40%]">
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

                <div onClick={()=> navigate("createQuiz")} className="bg-orange-500 fixed bottom-10 right-10 text-2xl p-5 w-15 h-15 flex justify-center items-center rounded-full text-white text-center aspect-square"><FaPlus /></div>

            </div>
        </div>
     );
}
 
export default TeacherQuizPage;