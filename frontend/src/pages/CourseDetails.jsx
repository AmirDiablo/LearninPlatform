import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { IoIosArrowDown } from "react-icons/io";
import { PiStudentBold } from "react-icons/pi";
import { GrMoney } from "react-icons/gr";
import { FaStar } from "react-icons/fa";
import { IoTimerOutline } from "react-icons/io5";
import VideoPlayer from "../components/VideoPlayer";
import { FaPlay } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import {useUser} from "../context/userContext"
import Loader from "../components/Loader";
import BookLoader from "../components/BookLoader";
import { format } from "date-fns";

const CourseDetails = () => {
    const id = useLocation().search.split("=")[1]
    const [lessonId, setLessonId] = useState()
    const [curriculumId, setCuriculumId] = useState()
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const [isRating, setIsRating] = useState(false)
    const [reviews, setReviews] = useState([])
    const [rateValue, setRate] = useState()
    const [comment, setComment] = useState('')
    const [course, setCourse] = useState([])
    const [openSections, setOpenSections] = useState({});
    const [isPlaying, setIsPlaying] = useState(false)
    const [page, setPage] = useState(1)
    const [videoURL, setVideoURL] = useState()
    const [videoTitle, setVideoTitle] = useState()
    const {user} = useUser()
    const navigate = useNavigate()

    const fetchCourse = async()=> {
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:3000/api/course/courseDetails?id="+id)
        const json = await response.json()

        if(!response.ok) {
            setError(json.error)
            setLoading(false)
        }

        if(response.ok) {
            setError(null)
            setLoading(false)
            setCourse(json)
        }
    }

    const fetchReviews = async (pageNumber)=> {
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:3000/api/course/reviews?courseId="+id+"&page="+pageNumber)
        const json = await response.json()

        if(!response.ok) {
            setLoading(false)
            setError(json.message)
        }

        if(response.ok) {
            setLoading(false)
            setError(null)
            if(pageNumber !== 1) {
                const separatedItems = json.map(item => item)
                setReviews([...reviews, ...separatedItems])
            }else{
                setReviews(json)
            }
            
        }
    }

    useEffect(()=> {
        fetchCourse()
        fetchReviews(page)
    }, [])

    const handleToggle = (index) => {
        setOpenSections((prev) => ({
        ...prev,
        [index]: !prev[index],
        }));
    };

    const playLesson = async (lessonId, sectionId)=> {
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:3000/api/course/playLesson", {
            method: "POST",
            body: JSON.stringify({courseId: course[0]._id, sectionId, lessonId}),
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${user.token}`
            }
        })
        const json  = await response.json()

        if(response.ok) {
            setLoading(false)
            setError(null)
            setIsPlaying(true)
            setVideoTitle(json.lessonTitle)
            setVideoURL(json.videoURL)
            setLessonId(lessonId)
            setCuriculumId(sectionId)
        }

        if(!response.ok) {
            setLoading(false)
            setError(json.message)
        }
        
    }

    const pay = async ()=> {
        
    }

    const openRate = (e)=> {
        const value = e.currentTarget.dataset.rate;
        setRate(value)
        setIsRating(true)
    }

    const rate = async(e, teacherId)=> {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:3000/api/course/rating", {
            method: "PATCH",
            body: JSON.stringify({rate: rateValue, courseId: course[0]._id, comment: comment, teacherId}),
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if(response.ok) {
            setIsRating(false)
            setLoading(false)
            setError(null)
        }

        if(!response.ok) {
            setError(json.message)
            setLoading(false)
        }
    }

    const moreReviews = ()=> {
        setPage(page+1)
        const pageNumber = page +1
        fetchReviews(pageNumber)
    }

    return ( 
        <div className="flex flex-col px-5">
        
           {course.map(c=> (
                <div className="flex flex-col  w-[100%] md:px-10 md:gap-10 md:flex-row">
                <div className="md:w-[50%] space-y-5">
                    {isPlaying ? <VideoPlayer videoURL={videoURL} videoTitle={videoTitle} courseId={id} lessonId={lessonId} curriculumId={curriculumId}  /> : <img src={'http://localhost:3000/uploads/thumbnails/'+c.thumbnail} className="object-cover rounded-2xl w-[100%]" />}
                    <div className="flex justify-between *:text-xl">
                        <div className="flex items-center"><PiStudentBold /> {c.enrollmentCount}</div>
                        <div className="flex items-center gap-1"><GrMoney /> <div className=""><p className="line-through decoration-red-500">{c.price}$</p> <p>{c.price - c.discount * c.price / 100}$</p></div></div>
                        <div className="flex items-center"><FaStar /> {c.rating}</div>
                        <div className="flex items-center"><IoTimerOutline />210min</div>
                    </div>
                    <div className="">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2" onClick={()=> navigate("/teacherProfile?q="+c.userId._id)}>
                                <img src={"http://localhost:3000/uploads/profiles/"+c?.userId?.profile} className="w-10 rounded-full object-cover"/>
                                <p className="text-[15px]">{c?.userId?.username}</p>
                            </div>
                            <button onClick={pay} className="bg-orange-500 text-white px-5 py-2  rounded-[7px]">Pay</button>
                        </div>                
                        <strong>{c.title}</strong>
                        <p>{c.description}</p>
                    </div>

                    <div className="flex *:text-3xl mx-auto w-max stars">
                        <div data-rate="1" onClick={openRate}>{1 <= rateValue ? <FaStar className="text-yellow-500" /> : <CiStar  />}</div>
                        <div data-rate="2" onClick={openRate}>{2 <= rateValue ? <FaStar className="text-yellow-500" /> : <CiStar  />}</div>
                        <div data-rate="3" onClick={openRate}>{3 <= rateValue ? <FaStar className="text-yellow-500" /> : <CiStar  />}</div>
                        <div data-rate="4" onClick={openRate}>{4 <= rateValue ? <FaStar className="text-yellow-500" /> : <CiStar  />}</div>
                        <div data-rate="5" onClick={openRate}>{5 <= rateValue ? <FaStar className="text-yellow-500" /> : <CiStar  />}</div>
                    </div>

                    {isRating && 
                        <form className="mb-10">
                            <input placeholder="Comment" className="bg-white border-1 rounded-[10px] p-2 w-[100%]" type="text" onChange={(e)=> setComment(e.target.value)} value={comment} />
                            <button onClick={(e)=> rate(e, c.userId)} className="bg-orange-500 text-white px-5 py-2 rounded-[10px] w-[100%] mt-5">submit</button>
                        </form>
                    }
                </div>

                <div className="md:w-[50%]">
                <div className="mt-10 md:w-[100%]">
                    {c.curriculm.map((item, index)=> (
                        <details key={index}
                            open={openSections[index] || false}
                            onToggle={() => handleToggle(index)}>
                            <summary className={`flex items-center justify-between p-2 detail${index}`}><div>{item.sectionTitle}  </div> <IoIosArrowDown className={`transition-transform duration-300 ${openSections[index] ? "rotate-180" : "rotate-0"}`} /></summary>
                            <div className="space-y-2 mx-5">
                                {item.lessons.map(lesson=> (
                                    <div className="flex items-center justify-between">
                                        <p className="text-[13px]">{lesson.title}</p>
                                        <div onClick={()=> playLesson(lesson._id, item._id)} className="p-2 bg-orange-500 rounded-full text-white text-center">
                                            <FaPlay />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                        </details>
                    ))}
                </div>

                <div className="flex gap-2 w-[100%] *:flex-none overflow-x-auto -ml-5 px-5">
                    {reviews.map(review=> (
                        <div className="bg-white rounded-xl p-5 ">
                            <div className="flex items-center gap-5 justify-between w-[100%]">
                                <div className="flex items-center gap-2">
                                    <img src={"http://localhost:3000/uploads/profiles/"+review?.userId?.profile} className="w-10 aspect-square rounded-full object-cover" />
                                    <p>{review?.userId?.username}</p>
                                </div>
                                <div className="flex *:text-2xl w-max stars">
                                    <div data-rate="1" >{1 <= review.rating ? <FaStar className="text-yellow-500" /> : <CiStar  />}</div>
                                    <div data-rate="2" >{2 <= review.rating ? <FaStar className="text-yellow-500" /> : <CiStar  />}</div>
                                    <div data-rate="3" >{3 <= review.rating ? <FaStar className="text-yellow-500" /> : <CiStar  />}</div>
                                    <div data-rate="4" >{4 <= review.rating ? <FaStar className="text-yellow-500" /> : <CiStar  />}</div>
                                    <div data-rate="5" >{5 <= review.rating ? <FaStar className="text-yellow-500" /> : <CiStar  />}</div>
                                </div>
                            </div>

                            <p className="pl-12">{review.comment}</p>
                            <p className="text-gray-500 text-end mt-2">{format(new Date(review.createdAt), "MM/dd/yyyy")}</p>
                        </div>
                    ))}
                    {reviews.length != 0 && <button onClick={moreReviews} className="bg-orange-500 text-white text-center p-2 self-center rounded-[7px] px-5 py-2">More</button>}
                </div>
                </div>

            </div>
           ))}

           {loading && <BookLoader />}

           {error && <div className="bg-red-500 mb-10 mx-auto w-max px-10 py-2 max-w-[70%] rounded-[10px] mt-10 text-white text-center">{error}</div>}
            
        </div>
     );
}
 
export default CourseDetails;