import { useState } from "react"
import {useUser} from "../context/userContext"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { FaCheckCircle } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { LuAlarmClockCheck } from "react-icons/lu";
import check from "../assets/check.jfif"

const QuizPage = () => {
    const quizId = useLocation().search.split("=")[1]
    const [loadPageError, setLoadPageError] = useState(null)
    const {user} = useUser()
    const [quiz, setQuiz] = useState([])
    const [questionIndex, setQuestionIndex] = useState(0)
    const [sec, setSec] = useState()
    const [answers, setAnswers] = useState(() => {
    const storedValue = localStorage.getItem(`${user.userInfo[0]._id}/${quizId}`);
        return storedValue ? JSON.parse(storedValue) : {};
    })
    const [selectedOption, setSelectedOption] = useState()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const fetchQuiz = async ()=> {
        setLoading(true)
        setLoadPageError(null)
        const response = await fetch("http://localhost:3000/api/quiz/participate?quizId="+quizId, {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if(response.ok) {
            setLoading(false)
            setLoadPageError(null)
            setQuiz(json.quiz)
            setSec(json?.remained)
        }

        if(!response.ok) {
            setLoading(false)
            setLoadPageError(json.message)
        }
    }

    const saveLocally = ()=> {
        localStorage.setItem(`${user?.userInfo[0]?._id}/${quizId}`, JSON.stringify(answers))
    }

    useEffect(()=> {
        if(user?.token) {
            fetchQuiz()
            const answer = JSON.parse(localStorage.getItem(`${user.userInfo[0]._id}/${quizId}`))
            console.log(answer)
            if(answer && typeof answer === 'object' && Object.keys(answer).length > 0) {
                console.log("answer: ", answer)
                setAnswers(answer)
                const keys = Object.keys(answers);
                const lastKey = keys[keys.length - 1];
                const selected = answers[lastKey]
                setSelectedOption(selected)
                setQuestionIndex(Number(lastKey))
            }
        }
    }, [user])

    const timeFormater = ()=> {
        setSec(sec-1)
    }

    useEffect(()=> {
        const myInterval = setInterval(() => {
            timeFormater()
        }, 1000);

        return ()=> {
            clearInterval(myInterval)
        }
    }, [sec])

    const select = (optionIndex)=> {
        setSelectedOption(optionIndex)
        setAnswers(pre=> ({...answers, [questionIndex]: optionIndex}))
    }

    useEffect(()=> {
        saveLocally()
    }, [answers])

    /* useEffect(()=> {
        setSelectedOption(null)
    }, [questionIndex]) */

    const prev = ()=> {
        if(questionIndex == 0){
            setQuestionIndex(0)
        }else{
            setQuestionIndex(questionIndex-1)
            setSelectedOption(null)
        }
    }

    const next = ()=> {
        if(questionIndex == quiz.questions.length) {
            setQuestionIndex(quiz.questions.length)
        }else{
            setQuestionIndex(questionIndex+1)
            setSelectedOption(null)
        }
    }

    const submit = async(e)=> {
        if (e) e.preventDefault(); // فقط اگر e وجود داشت
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:3000/api/quiz/submitQuiz", {
            method: "PATCH",
            body: JSON.stringify({answers, quizId}),
            headers: {
                "Authorization" : `Bearer ${user.token}`,
                "Content-Type" : "application/json"
            }
        })

        const json = await response.json()

        if(response.ok) {
            setLoading(false)
            setError(null)
            localStorage.removeItem(`${user.userInfo[0]._id}/${quizId}`)
            navigate("/")
        }

        if(!response.ok) {
            setLoading(false)
            setError(json.message)
        }
    }

    useEffect(()=> {
        if(sec == 0) {
            console.log("its done")
            submit()
        }
    }, [sec])


    return ( 
    <div className="lg:flex lg:items-center">

        {loadPageError ? <div>{error}</div> : 
            <>
                <div className="flex items-center justify-between mx-5 lg:w-[40%] self-start lg:mt-5">
                
                    <div className="flex gap-2 w-[60%] overflow-x-auto lg:flex-wrap lg:w-[75%]">
                        {quiz?.questions?.map((q, index)=> (
                            <div onClick={()=> {setQuestionIndex(index), setSelectedOption(null)}} className={`bg-white border-2 ${index == questionIndex ? "border-orange-500" : "border-black/20"} rounded-[7px] p-2 aspect-square w-10 text-center`}>{index+1}</div>
                        ))}
                    </div>
                    

                    <div className="bg-orange-500 flex items-center gap-2 w-max min-w-max text-white text-center px-5 py-2 rounded-xl lg:self-start">
                        <div className="text-3xl"><LuAlarmClockCheck /></div>{Math.floor(sec/60)} : {sec % 60 < 10 ? ("0" + sec%60) : sec % 60}
                    </div>

                </div>

                <div className="lg:w-[50%] lg:mx-auto sm:w-[80%] mx-auto md:w-[70%]">

                    
                    <div>
                        {questionIndex == quiz?.questions?.length ? 
                            <div className="w-[90%] mx-auto text-center mt-10 rounded-2xl bg-white p-2 md:flex ">
                                <img src={check} className="mx-auto md:w-[50%]" />
                                <div className="md:w-[50%] self-center">
                                    <p className="font-[600] text-2xl">The quiz is over</p>
                                    <p>if you are sure about your answers submit it</p>
                                    <button onClick={submit} className="bg-orange-500 mt-2 text-white text-center px-5 py-2 rounded-[7px]">Submit</button>
                                </div>
                            </div> :

                            <div>
                                {quiz?.questions?.length > questionIndex && (
                                    <div className="bg-white mt-5 p-5 border-[2px] w-[90%] mx-auto border-black/20 rounded-2xl">
                                        <div className="flex items-center"><p className="font-[600]">Question {questionIndex+1}</p>: {quiz?.questions[questionIndex]?.question}</div>
                                        <div className="h-[1px] bg-black/20 my-5"></div>
                                        <div className="space-y-5">
                                            {quiz?.questions[questionIndex]?.options?.map((option, index)=> (
                                                <div onClick={()=> select(index)} className="flex items-center gap-2">{answers[questionIndex] == index ? <FaCheckCircle className="text-green-800 text-xl" /> : <p className="w-5 aspect-square border-2 rounded-full"></p>}<p>{option}</p></div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            
                        }
                        
                    </div>
                    
                

                    <div className="flex items-center justify-center mt-10 *:text-3xl gap-5 *:rounded-[7px] *:bg-orange-500 *:text-white *:p-2">
                        <div onClick={prev}><IoIosArrowBack /></div>
                        <div onClick={next}><IoIosArrowForward /></div>
                    </div>

                </div>
        </>
        }

    
    </div> 
);
}
 
export default QuizPage;