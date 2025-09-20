import { useState } from "react"

const AddCurriculum = ({change, isAddingCurriculum, courseId}) => {
    const [files, setFiles] = useState([])
    const [curriculm, setCurriculm] = useState([])
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)

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
        e.preventDefault()
        const lessons = document.querySelectorAll("input[name='lessonsName']")
        const lessonFiles = document.querySelectorAll("input[name='lesson']")
        const formData = new FormData()
        formData.append("curriculm", curriculm)
        formData.append("courseId", courseId)
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
            setError(json.error)
            setLoading(false)
        }

        if(response.ok) {
            console.log("ok")
            change(!isAddingCurriculum)
        }

    }

    return ( 
        <form className="flex gap-5 flex-col bg-[#e0d7cb] w-[90%] p-5 rounded-2xl fixed top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%]">
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
     );
}
 
export default AddCurriculum;