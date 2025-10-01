import { useNavigate } from "react-router-dom";
import TeachersDashTop from "../components/TeachersDashTop";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { useEffect } from "react";
import BookLoader from "../components/BookLoader";
import { useUser } from "../context/userContext";

const TeacherQuizPage = () => {
    const navigate = useNavigate()
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const [quizes, setQuizes] = useState([])
    const {user} = useUser()

    const fetchQuizes = async()=> {
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:3000/api/quiz/teacherQuizes", {
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
            setQuizes(json)
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
            fetchQuizes()
        }
    }, [user])

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

                {!error && <div onClick={()=> navigate("createQuiz")} className="bg-orange-500 fixed bottom-10 right-10 text-2xl p-5 w-15 h-15 flex justify-center items-center rounded-full text-white text-center aspect-square"><FaPlus /></div>}

            </div>

            {error && <div className="bg-red-200 fixed left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] text-center rounded-2xl py-2 w-max px-5 mx-auto">{error}</div>}
            {loading && <BookLoader />}
        </div>
     );
}
 
export default TeacherQuizPage;