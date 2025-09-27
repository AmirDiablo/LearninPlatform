import { useLocation } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import AddLesson from "../components/AddLesson";
import {useUser} from "../context/userContext"
import EditLesson from "../components/EditLesson";
import AddCurriculum from "../components/AddCurriculum";
import { FaPlus } from "react-icons/fa6";
import { GiCheckMark } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";


const EditCourse = () => {
    const [discount, setDiscount] = useState(0)
    const {state} = useLocation()
    const {course} = state
    const [isOpen, setIsOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isAddingCurriculum, setIsAddingCurriculum] = useState(false)
    const [openSections, setOpenSections] = useState({});
    const [curriculmId, setCurriculmId] = useState()
    const [lessonId, setLessonId] = useState()
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const {user} = useUser()
    const [serverResponse, setServerResponse] = useState()

    const handleToggle = (index) => {
        setOpenSections((prev) => ({
        ...prev,
        [index]: !prev[index],
        }));
    };

    const open = (id)=> {
        setIsOpen(true)
        setCurriculmId(id)
    }

    const deleteLesson = async (lessonId, curriculmId) => {
        setLoading(true)
        const response = await fetch("http://localhost:3000/api/course/deleteLesson", {
            method: "PATCH",
            body: JSON.stringify({lessonId, curriculmId, userId: user?.userInfo[0]?._id, courseId: course._id}),
            headers: {
                "Authorization" : `Bearer ${user?.token}`,
                "Content-Type" : "application/json"
            }
        })

        const json = await response.json()

        if(!response.ok) {
            setLoading(false)
            setError(json.error)
            console.log(json)
        }

        if(response.ok) {
            setLoading(false)
            setError(null)
        }

    }

    const changeDiscount = async()=> {
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:3000/api/course/changeDiscount", {
            method: "PATCH",
            body: JSON.stringify({courseId: course._id, discount}),
            headers: {
                "Authorization" : `Bearer ${user.token}`,
                "Content-Type" : "application/json"
            }
        })

        const json = await response.json()

        if(response.ok) {
            setLoading(false)
            setError(null)
            setServerResponse(json.message)
        }

        if(!response.ok) {
            setError(json.message)
            setLoading(false)
        }
    }

    
    return ( 
        <div className="flex flex-col px-5 mb-10">

            
            <div className="flex flex-col  w-[100%] md:px-10 md:gap-10 md:flex-row">
                <div className="md:w-[50%] space-y-5">
                    <img src={'http://localhost:3000/uploads/thumbnails/'+course.thumbnail} className="object-cover rounded-2xl" />
                    <div className="">
                        <div className="flex items-center gap-2">
                            <img src={"http://localhost:3000/uploads/profiles/"+course.userId.profile} className="w-10 rounded-full object-cover"/>
                            <p className="text-[15px]">{course.userId.username}</p>
                        </div>                
                        <strong>{course.title}</strong>
                        <p>{course.description}</p>
                    </div>

                    <label className="block mt-10 text-black/50 translate-y-[10px]">if you want you can set discount in percent to this course</label>
                    <div className="flex">
                        <input onChange={(e)=> setDiscount(e.target.value)} value={discount} placeholder="Discount" className="bg-white border-2 border-black/20 rounded-[7px] p-5" type="number" />
                        <button onClick={changeDiscount} className="bg-orange-500 text-white px-5 py-2 rounded-[7px] text-center"><GiCheckMark /></button>
                    </div>
                </div>

                <div className="mt-10 md:w-[50%]">
                    {course.curriculm.map((item, index)=> (
                        <details key={index}
                            open={openSections[index] || false}
                            onToggle={() => handleToggle(index)}>
                            <summary className={`flex items-center justify-between p-2 detail${index}`}><div>{item.sectionTitle}  <button onClick={()=> open(item._id)} className="bg-orange-500 text-white text-[12px] rounded-[7px] px-5 py-2 w-max hover:cursor-pointer">Add Lesson</button></div> <IoIosArrowDown className={`transition-transform duration-300 ${openSections[index] ? "rotate-180" : "rotate-0"}`} /></summary>
                            <div className="space-y-2 mx-5">
                                {item.lessons.map(lesson=> (
                                    <div className="flex items-center justify-between">
                                        <p className="text-[13px]">{lesson.title}</p>
                                        <div className="flex gap-2">
                                            <div onClick={()=> {setIsEditing(true), setCurriculmId(item._id), setLessonId(lesson._id)}} className="bg-orange-500 text-white p-2 rounded-full w-max flex justify-center items-center"><MdOutlineEdit /></div>
                                            <div onClick={()=> deleteLesson(lesson._id, item._id)} className="bg-orange-500 text-white p-2 rounded-full w-max flex justify-center items-center"><MdOutlineDelete /></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                           
                        </details>
                    ))}

                    <button onClick={()=> {setIsAddingCurriculum(true)}} className="text-orange-500 font-[700] flex items-center place-self-center justify-center gap-2">Add Curriculum <FaPlus /></button>
                </div>
            </div>

            {serverResponse && <div className="bg-green-200 message w-[70%]  px-5 py-1 text-center rounded-[7px] md:w-[30%] absolute left-[50%] -translate-x-[50%] bottom-10"><RxCross2 className="float-end mt-2" onClick={()=> setServerResponse(null)} /><p className="py-5">{serverResponse}</p></div>}
            {error && <div className="bg-red-200 message w-[70%]  px-5 py-1 text-center rounded-[7px] md:w-[30%] absolute left-[50%] -translate-x-[50%] bottom-10"><RxCross2 className="float-end mt-2" onClick={()=> setServerResponse(null)} /><p className="py-5">{error}</p></div>}

            {isEditing && <div className="bg-black/20 fixed top-0 bottom-0 w-[100%]"></div>}
            {isAddingCurriculum && <div className="bg-black/20 fixed top-0 bottom-0 w-[100%]"></div>}
            {isOpen && <div className="bg-black/20 fixed top-0 bottom-0 w-[100%]"></div>}
            {isOpen && <AddLesson change={setIsOpen} isOpen={isOpen} course={course} curriculmId={curriculmId} />}
            {isEditing && <EditLesson courseId={course._id} curriculmId={curriculmId} lessonId={lessonId} change={setIsEditing} isEditing={isEditing} />}
            {isAddingCurriculum && <AddCurriculum courseId={course._id} change={setIsAddingCurriculum} isAddingCurriculum={isAddingCurriculum}/>}

            
        </div>
     );
}
 
export default EditCourse;
