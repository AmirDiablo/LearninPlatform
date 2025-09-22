import { useState } from "react"
import {useUser} from "../context/userContext"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

const QuizPage = () => {
    const quizId = useLocation().search.split("=")[1]
    const {user} = useUser()
    const [quiz, setQuiz] = useState([])
    const [index, setIndex] = useState(0)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    console.log(quizId)

    const fetchQuiz = async ()=> {
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:3000/api/quiz/participate?quizId="+quizId, {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if(response.ok) {
            setLoading(false)
            setError(null)
            setQuiz(json)
        }

        if(!response.ok) {
            setLoading(false)
            setError(json.message)
        }
    }

    useEffect(()=> {
        if(user?.token) {
            fetchQuiz()
        }
    }, [user])

    return ( 
    <div>

        {quiz.map(item=> (
            <div>
                <p>{item.questions[index].question}</p>
                <div>
                    {item.questions[index].options.map(option=> (
                        <p>{option}</p>
                    ))}
                </div>
            </div>
        ))}
        
    </div> 
);
}
 
export default QuizPage;