import { useState } from "react"
import { useUser } from "../context/userContext"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

const StudentQuizResult = () => {
    const {user} = useUser()
    const quizId = useLocation().search.split("=")[1]
    const [result, setResult] = useState([])
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)

    const fetchQuizResult = async ()=> {
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:3000/api/quiz/quizResult?quizId="+quizId, {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if(response.ok) {
            setResult(json)
            setError(null)
            setLoading(false)
        }

        if(!response.ok) {
            setError(json.message)
            setLoading(false)
        }
    }

    useEffect(()=> {
        if(user?.token) {
            fetchQuizResult()
        }
    }, [user])

    return ( 
        <div>
            

            <div className="flex items-center gap-2 mx-5">
                <div className="columns-2">
                    <p className="text-green-700 font-[600]">Result: {result?.answer?.score}%</p>
                    <p>{result?.quiz?.questions?.length} Questions</p>
                    <p className="text-green-800">{result?.answer?.score * result?.quiz?.questions?.length / 100} Corrects</p>
                    <p>{result && result.quiz && result.quiz.questions && result.answer && result.answer.answers
                        ? result.quiz.questions.length - Object.keys(result.answer.answers).length
                        : "Loading..."} not answered</p>
                    <p className="text-red-600">{result && result.quiz && result.quiz.questions && result.answer && result.answer.answers
                        ? Object.keys(result?.answer?.answers).length - result?.answer?.score * result?.quiz?.questions?.length / 100
                        : "Loading..."} Wrongs</p>
                    <p>Date: {`${new Date(result?.answer?.createdAt).getDate()} / ${new Date(result?.answer?.createdAt).getMonth()} / ${new Date(result?.answer?.createdAt).getFullYear()}`}</p>
                </div>
            </div>

            <div className="space-y-5 mt-10">
                {result?.quiz?.questions?.map((item, index) => (
                    <div key={index} className="mx-5 p-5 border-2 bg-white border-black/20 rounded-2xl">
                        <p className="mb-5 font-[600]">{item?.question}</p>

                        <div className="h-[1px] bg-black/20 my-5"></div>

                        {item.options.map((option, optionIndex) => {
                            const selectedOptionIndex = result.answer.answers?.[index];
                            console.log("selected: ", selectedOptionIndex)
                            const isSelected = item.answer == selectedOptionIndex;

                            let className = "bg-white p-2"; // پیش‌فرض: گزینه انتخاب نشده

                            if (selectedOptionIndex == optionIndex) {
                                className = optionIndex == Number(item.answer) ? "bg-green-200 p-2 rounded-[7px]" : "bg-red-200 p-2 rounded-[7px]";  // انتخاب اشتباه
                            }

                            return (
                            <div key={optionIndex} className={className}>
                                {option}
                            </div>
                            );
                        })}
                    </div>
                ))}
        </div>
    

        </div>
     );
}
 
export default StudentQuizResult;