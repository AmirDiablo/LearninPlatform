import { useNavigate } from "react-router-dom";
import TeachersDashTop from "../components/TeachersDashTop";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { useEffect } from "react";
import { useUser } from "../context/userContext";
import { RxCross2 } from "react-icons/rx";
import { TfiWrite } from "react-icons/tfi";
import BookLoader from "../components/BookLoader";

const StudentQuizPage = () => {
    const {user} = useUser()
    const navigate = useNavigate()
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const [SubmittedQuizes, setSubmittedQuizes] = useState([])
    const [notSubmittedQuizes, setNotSubmittedQuizes] = useState([])
    const [selectedQuiz, setSelectedQuiz] = useState({})
    const [isOpen, setIsOpen] = useState(false)

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
            setSubmittedQuizes(json.participated)
            setNotSubmittedQuizes(json.notParticipated)
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

                    {!loading && 
                    <div className="space-y-2 md:space-x-5">
                        
                        {notSubmittedQuizes.length != 0 && 
                        <div>

                            <p className="mb-2 font-[600]">Quizes</p>
                            {notSubmittedQuizes?.map(quiz=> (
                                <div className="flex gap-2 bg-white border-[2px] border-black/10 p-2 rounded-2xl md:w-[40%]">
                                    <img src={'http://localhost:3000/uploads/thumbnails/'+quiz?.courseId?.thumbnail} className="rounded-2xl object-cover w-20" />
                                    <div onClick={()=> {setIsOpen(true), setSelectedQuiz({course: quiz.courseId.title, id: quiz._id})}}>
                                        <p className="font-[700]">{quiz.courseId.title}</p>
                                        <p className="inline mr-5">{quiz.time / 60} minutes</p>
                                        <p className="inline">{quiz?.questions?.length} questions</p>
                                    </div>
                                </div>
                            )   )}

                            {isOpen && <div className="w-[50%] p-2 flex flex-col justify-between absolute  left-[50%] -translate-x-[50%] bg-white border-[2px] border-black/10 h-40 rounded-2xl">
                                    <div onClick={()=> setIsOpen(false)}><RxCross2 /></div>
                                    <p className="text-center">Are you sure you wanna participate in <strong>{selectedQuiz.course}</strong></p>
                                    <button onClick={()=> navigate("/studentdashboard/quizPage?q="+selectedQuiz.id)} className="bg-orange-500 text-white text-center px-5 py-2 rounded-[7px] mx-auto w-max ">Start Quiz</button>
                                </div>}

                        </div>
                        }

                        

                        {SubmittedQuizes.length != 0 && 
                        <div className="space-y-2">
                            <p className="mb-2 font-[600] mt-20">Submitted Quizes</p>
                            {SubmittedQuizes?.map(quiz=> (
                                <div className="flex gap-2 bg-white border-[2px] border-black/10 p-2 rounded-2xl md:w-[40%]" onClick={()=> navigate("studentQuizResult?q="+quiz?._id)}>
                                    <img src={'http://localhost:3000/uploads/thumbnails/'+quiz?.courseId?.thumbnail} className="rounded-2xl object-cover w-20" />
                                    <div>
                                        <p className="font-[700]">{quiz.courseId.title}</p>
                                        <p className="inline mr-5">{quiz.time / 60} minutes</p>
                                        <p className="inline">{quiz?.questions?.length} questions</p>
                                    </div>
                                </div>
                            )   )}
                        </div>
                        }
                    
                    
                    </div>}

                    {loading && <BookLoader />}

                </div>

            </div>
        </div>
     );
}
 
export default StudentQuizPage;