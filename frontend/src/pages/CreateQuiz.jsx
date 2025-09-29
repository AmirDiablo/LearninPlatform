import { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";
import {useUser} from "../context/userContext"
import { useNavigate } from "react-router-dom";
import quiz from "../assets/quiz.png"

const CreateQuiz = () => {
    const [time, setTime] = useState()
    const [step, setStep] = useState(1)
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const [courses, setCourses] = useState([])
    const [selcetedCourse, setSelectedCourse] = useState()
    const [questions, setQuestions] = useState([])
    const [options, setOptions] = useState(["", "", "", ""])
    const [answer, setAnswer] = useState("")
    const [question, setQuestion] = useState()
    const [isEditing, setIsEditing] = useState(false)
    const [ItemIndex, setItemIndex] = useState()
    const {user} = useUser()
    const navigate = useNavigate()

    const teacherCourses = async ()=> {
        setLoading(true)
        setError(null)
        const response = await fetch('http://localhost:3000/api/course/teacherCourses?q='+JSON.parse(localStorage.getItem("user")).id)
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
        teacherCourses()
    }, [])

    const addQuestion = (e)=> {
        e.preventDefault()
        setQuestions([...questions, {question, options, answer}])
        setQuestion("")
        setOptions(["", "", "", ""])
        setAnswer(null)
    }

    const editQuestion = (index)=> {
        setQuestion("")
        setOptions(["", "", "", ""])
        setAnswer(null)
        setIsEditing(true)
        setItemIndex(index)

        setQuestion(questions[index].question)
        setOptions(questions[index].options)
        setAnswer(questions[index].answer)
    }

    const submitChanges = ()=> {
        const edited = {question, options, answer}
        setQuestions(prevQuestions => {
            const updated = [...prevQuestions]; // کپی از آرایه قبلی
            updated[ItemIndex] = edited;            // تغییر آیتم مورد نظر
            return updated;                     // بازگرداندن آرایه جدید
        });

        setQuestion("")
        setAnswer(null)
        setOptions(["", "", "", ""])
        setIsEditing(false)
    }

    const cancelEditing = ()=> {
        setQuestion("")
        setAnswer(null)
        setOptions(["", "", "", ""])

        setIsEditing(false)
    }

    const submitQiuz = async(e)=> {
        e.preventDefault()

        const response = await fetch("http://localhost:3000/api/quiz", {
            method: "POST",
            body: JSON.stringify({questions, courseId: selcetedCourse, time}),
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if(!response.ok) {
            setError(json.message)
            setLoading(false)
        }

        if(response.ok) {
            navigate("/teacherQuizPage")
        }
    }


    return ( 
        <div className="flex flex-col justify-center md:flex-row md:items-center">

            
            <img src={quiz} className="md:w-[50%]" />
            

            <div className="md:w-[50%]">

                {step == 1 && 
                    <div>
                        <form className="flex flex-col p-5 gap-2">
                            <select className="p-5" onChange={(e)=> setSelectedCourse(e.target.value)} value={selcetedCourse}>
                                {courses.map(course=> (
                                    <option value={course._id}>{course.title}</option>
                                ))}
                            </select>
                            <input onChange={(e)=> setTime(e.target.value)} value={time} type="number" placeholder="Time" className="bg-white border-[2px] border-black/10 rounded-[10px] p-5" />
                        </form>
                        <div onClick={()=> setStep(2)} className="bg-orange-500 text-white text-3xl rounded-[7px] py-2 px-5 mx-5 ml-auto p-5 w-max"><FaArrowRightLong /></div>
                    </div>
                }

                {step == 2 && 
                    <div>
                        <form className="mx-5 mb-10">
                            <input onChange={(e)=> setQuestion(e.target.value)} value={question} type="text" placeholder="Question" className="w-[100%] mb-5 bg-white pr-18 rounded-[10px] border-[2px] p-5 border-black/10 " />
                            {[...Array(4)].map((_, index)=> (
                                <div className="flex items-center gap-2 options mb-2">{index + 1 == answer ? <div className="bg-green-500 rounded-full w-7 text-2xl"><FaRegCheckCircle /></div> : <div onClick={()=> setAnswer(index + 1)} className="aspect-square w-7 border-[1px] border-black/50 rounded-full"></div> } <input
                                onChange={(e) => {
                                    const newOptions = [...options];
                                    newOptions[index] = e.target.value;
                                    setOptions(newOptions);
                                }}
                                value={options[index]}
                                type="text"
                                placeholder="Answer"
                                className="w-full bg-white rounded-[10px] border-[2px] p-5 border-black/10"
                                /></div>
                            ))}
                        </form>

                        {!isEditing ? 
                            <div className="flex items-center justify-center gap-2">
                                <button onClick={addQuestion} className="bg-orange-500 text-white text-center px-5 py-2 rounded-[7px] block">Add Question</button>
                                <button onClick={submitQiuz} className="bg-orange-500 text-white text-center px-5 py-2 rounded-[7px] block">Submit Quiz</button>
                            </div> :

                            <div className="flex items-center justify-center gap-2">
                                <button onClick={()=> submitChanges()} className="bg-orange-500 text-white text-center px-5 py-2 rounded-[7px] block">Submit Changes</button>
                                <button onClick={cancelEditing} className="bg-orange-500 text-white text-center px-5 py-2 rounded-[7px] block">Cancel</button>
                            </div>
                        }

                        <div className="flex mx-5 mt-10 flex-wrap gap-2">
                            {questions.map((q, index)=> (
                                <div onClick={()=> editQuestion(index)} className="bg-white border-[2px] p-2 rounded-[7px]  border-black/10">Question {index+1}</div>
                            ))}
                        </div>
                    </div>
                }

            </div>


            {error && <div>{error}</div>}

        </div>
     );
}
 
export default CreateQuiz;