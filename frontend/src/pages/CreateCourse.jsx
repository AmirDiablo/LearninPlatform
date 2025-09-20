import { useEffect, useState } from "react";
import { AiOutlinePicture } from "react-icons/ai";
import { MdOutlineUploadFile } from "react-icons/md";
import {useUser} from "../context/userContext"
import { useNavigate } from "react-router-dom";
import CreateLessons from "../components/CreateLesson";

const CreateCourse = () => {
    const {user} = useUser()
    const [step, setStep] = useState(1)
    const [validCategory, setValidCategory] = useState([])
    const [thumbnail, setThumbnail] = useState()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState()
    const [discount, setDiscount] = useState()
    const [category, setCategory] = useState([])
    const [level, setLevel] = useState('beginner')
    const [files, setFiles] = useState([])
    const [course, setCourse] = useState([])
    const [curriculm, setCurriculm] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


    const fetchCategories = async ()=> {
        const response = await fetch("http://localhost:3000/api/course/categories")
        const json = await response.json()
        if(response.ok) {
            setValidCategory(json)
        }
        if(!response.ok) {
            fetchCategories()
        }
    }

    useEffect(()=> {
        fetchCategories()
    }, [])

    const next = async(e)=> {
        setLoading(false)
        setError(null)
        e.preventDefault()
        const formData = new FormData()
        formData.append("title", title)
        formData.append("description", description)
        formData.append("price", price)
        formData.append("discount", discount == undefined ? 0 : discount)
        formData.append("level", level)
        formData.append("category", category)
        formData.append("thumbnail", thumbnail)
        formData.append("userId", user?.userInfo[0]?._id)
        const response = await fetch("http://localhost:3000/api/course", {
            method: "POST",
            body: formData
        })

        const json = await response.json()

        if(response.ok) {
            setLoading(false)
            setError(null)
            setCourse(json)
            setStep(2)
        }

        if(!response.ok) {
            setLoading(false)
            setError(json.message)
        }
    }

    const addLesson = (e) => {
        e.preventDefault();

        const container = document.querySelector(".container");

        const wrapper = document.createElement("div");
        wrapper.className = "flex";

        const input = document.createElement("input");
        input.type = "text";
        input.className = "bg-white rounded-[7px] w-[100%] p-5 lessons";
        input.placeholder = "lesson";
        input.name = 'lessonsName'
        /* input.addEventListener("change", (e)=> {
            setLessons([...lessons, e.target.value])
        }) */

        const fileWrapper = document.createElement("div");
        fileWrapper.className = "relative flex justify-center items-center text-2xl bg-orange-500 text-white px-5 py-2 rounded-[7px] w-max";

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.name = "lesson";
        fileInput.className = "w-[100%] absolute h-[100%] top-0 left-0 opacity-0";
        fileInput.addEventListener("change", function (e) {
            console.log("skjdbvksjbd")
            setFiles([...files, e.target.files[0]])        
        });

        const icon = document.createElement("span");
        icon.innerHTML = "📁"; 

        fileWrapper.appendChild(fileInput);
        fileWrapper.appendChild(icon);

        wrapper.appendChild(input);
        wrapper.appendChild(fileWrapper);

        container.appendChild(wrapper);
    };

    const upload = async (e)=> {
        setLoading(true)
        setError(null)
        e.preventDefault()
        const lessons = document.querySelectorAll("input[name='lessonsName']")
        const lessonFiles = document.querySelectorAll("input[name='lesson']")
        const formData = new FormData()
        formData.append("curriculm", curriculm)
        formData.append("courseId", course._id)
        let lessonsNamesArray = []
        lessons.forEach((lesson)=> {
            lessonsNamesArray.push(lesson.value)
        })
        lessonsNamesArray.forEach(lesson=> {
            formData.append("lessonNames", lesson)
        })
        lessonFiles.forEach((file)=> {
            formData.append("lesson", file.files[0])
        })
        
        const response = await fetch("http://localhost:3000/api/course/addLessons", {
            method: "POST",
            body: formData,
            "Content-Type" : "multipart/form-data"
        })

        const json = await response.json()

        if(!response.ok) {
            setError(json.message)
            setLoading(false)
        }

        if(response.ok) {
            setLoading(false)
            setError(null)
            window.location.reload()
        }

    }


    return ( 
        <div className="md:w-[80%] md:mx-auto lg:w-[60%]">
            {step == 1 && 
                <form className="flex gap-5 flex-col mx-5">
                    <strong className="block">Create Course</strong>
                    <input onChange={(e)=> setTitle(e.target.value)} value={title} type="text" className="bg-white rounded-[7px] p-5 " placeholder="Title" />
                    <input onChange={(e)=> setDescription(e.target.value)} value={description} type="text" className="bg-white rounded-[7px] p-5 " placeholder="Description" />
                    <input onChange={(e)=> setPrice(e.target.value)} value={price} type="number" className="bg-white rounded-[7px] p-5" placeholder="Price"/>
                    <input onChange={(e)=> setDiscount(e.target.value)} value={discount} type="number" className="bg-white rounded-[7px] p-5" placeholder="Discount"/>
                    <select onChange={(e)=> setLevel(e.target.value)}>
                        <option value="beginner">beginner</option>
                        <option value="intermediate">intermediate</option>
                        <option value="advanced">advanced</option>
                    </select>
                    <select multiple onChange={(e)=> setCategory([...category, e.target.value])}>
                        {validCategory?.map((cat)=> (
                            <option value={cat} key={cat}>{cat}</option>
                        ))}
                    </select>
                    <div className="flex justify-between items-center">
                        <div className="bg-orange-500 px-5 py-2 text-white flex justify-center items-center rounded-[7px] w-max gap-2 relative">Thumbnail<AiOutlinePicture className="text-2xl"/> <input onChange={(e)=> setThumbnail(e.target.files[0])} type="file" name="thumbnail" className="w-[100%] absolute left-0 top-0 h-[100%] opacity-0" /></div>
                        <button onClick={next} className="bg-orange-500 px-5 py-2 text-white flex justify-center items-center rounded-full w-max">Next</button>
                    </div>
                </form>
            }

            {step == 2 && 
                <CreateLessons courseId={course?._id} />
            }

            {error && <div className="bg-red-500 text-white p-5 rounded-2xl text-center mx-5 mt-10">{error}</div>}
        </div>
     );
}
 
export default CreateCourse;

/*

<form className="flex gap-5 flex-col mx-5">
    <strong className="block">create Lessons</strong>
    <div className="courseForm flex flex-col gap-5">
        <input onChange={(e)=> setCurriculm(e.target.value)} type="text" className="bg-white rounded-[7px] p-5"  placeholder="Curriculm"/>
        <div className="container flex flex-col gap-5">
            <div className="flex">
                <input type="text" className="bg-white rounded-[7px] w-[100%] p-5" name="lessonsName" placeholder="lesson"/>
                <div className="relative flex justify-center items-center text-2xl bg-orange-500 text-white px-5 py-2 rounded-[7px] w-max "><input onChange={(e)=> setFiles([...files, e.target.value])} type="file" name="lesson" className="w-[100%] absolute h-[100%] top-0 left-0 opacity-0 lessons" />📂</div>
            </div>
        </div>
    </div>

    <div className="flex justify-between">
        <button onClick={addLesson} className="bg-orange-500 text-white rounded-[7px] px-5 py-2 w-max hover:cursor-pointer">Add Lesson</button>
        <button onClick={upload} className="bg-orange-500 text-white rounded-[7px] px-5 py-2">Upload</button>
    </div>
</form>

*/