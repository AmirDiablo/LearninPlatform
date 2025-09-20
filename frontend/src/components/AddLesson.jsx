import { useState } from "react";
import { useUser } from "../context/userContext";

const AddLesson = ({change, isOpen, course, curriculmId}) => {
    const [file, setFile] = useState()
    const [lesson, setLesson] = useState('')
    const {user} = useUser()

    const submit = async(e)=> {
        e.preventDefault()
        const formData = new FormData()
        formData.append("lessonFile", file)
        formData.append("lessonName", lesson)
        formData.append("userId", JSON.parse(localStorage.getItem("user")).id)
        formData.append("courseId", course._id)
        formData.append("curriculmId", curriculmId)
        const response = await fetch("http://localhost:3000/api/course/addLesson", {
            method: "PATCH",
            body: formData,
            headers: {
                "Authorization" : `Bearer ${user?.token}`
            }
        })

        const json = await response.json()

        if(response.ok) {
            change(!isOpen)
        }

        if(!response.ok) {
            console.log(json)
        }

    }

    return ( 
        <div className="w-[80%] h-60 rounded-2xl mx-auto fixed left-[50%] -translate-x-[50%] top-40 p-5 bg-[#e0d7cb]">
            <form className="flex gap-5 flex-col mx-5 mt-10">
                <div className="courseForm flex flex-col gap-5">
                    <div className="container flex flex-col gap-5">
                        <div className="flex">
                            <input type="text" onChange={(e)=> setLesson(e.target.value)} value={lesson} className="bg-white rounded-[7px] w-[100%] p-5" name="lessonsName" placeholder="lesson"/>
                            <div className="relative flex justify-center items-center text-2xl bg-orange-500 text-white px-5 py-2 rounded-[7px] w-max "><input onChange={(e)=> setFile(e.target.files[0])} type="file" name="lessonFile" className="w-[100%] absolute h-[100%] top-0 left-0 opacity-0 lessons" />📂</div>
                        </div>
                    </div>
                </div>
                <button onClick={submit} className="bg-orange-500 text-white px-5 py-2 rounded-[7px] absolute bottom-5  w-[80%] left-[50%] -translate-x-[50%] ">Submit</button>
            </form>
        </div>
     );
}
 
export default AddLesson;