import { useState } from "react";
import { useUser } from "../context/userContext";

const EditLesson = ({courseId, curriculmId, lessonId, change, isEditing}) => {
    const [title, setTitle] = useState('')
    const {user} = useUser()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()

    const editLesson = async(e) => {
        e.preventDefault()
        setLoading(true)
        const response = await fetch("http://localhost:3000/api/course/editLesson", {
            method: "PATCH",
            body: JSON.stringify({lessonId, curriculmId, courseId, title}),
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
            change(!isEditing)
        }
    }

    return ( 
        <div className="w-[80%] h-60 rounded-2xl mx-auto fixed left-[50%] -translate-x-[50%] top-40 p-5 bg-[#e0d7cb] sm:w-[60%] md:w-[50%] lg:w-[40%]">
            <form className="flex gap-5 flex-col mx-5 mt-10">
                <div className="courseForm flex flex-col gap-5">
                    <div className="container flex flex-col gap-5">
                        <div className="flex">
                            <input type="text" onChange={(e)=> setTitle(e.target.value)} value={title} className="bg-white rounded-[7px] w-[100%] p-5" name="lessonsName" placeholder="lesson"/>
                        </div>
                    </div>
                </div>
                <button onClick={editLesson} className="bg-orange-500 text-white px-5 py-2 rounded-[7px] absolute bottom-5  w-[80%] left-[50%] -translate-x-[50%] ">Submit</button>
            </form>
        </div>
    );
}
 
export default EditLesson;