import {Link} from "react-router-dom"
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { FaVideo } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdOutlinePayment } from "react-icons/md";
import { LuSquareMenu } from "react-icons/lu";
import { SiTestcafe } from "react-icons/si";
import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useUser } from "../context/userContext";

const TeachersDashTop = ({active}) => {
    const [size, setSize] = useState(window.innerWidth)
    const {user} = useUser()
    const role = user?.userInfo[0]?.roles

    window.addEventListener('resize', () => {
        setSize(window.innerWidth)
    });

    const open = ()=> {
        const nav = document.querySelector(".dashboardNav")
        nav.style.left = "0%"
    }

    const close = ()=> {
        document.querySelector(".dashboardNav").style.left = "-50%"
    }

    return ( 
        <div>
            <div onClick={open} className="bg-orange-500 navButton p-2 aspect-square w-12 rounded-2xl text-white text-2xl flex justify-center items-center mx-5"><LuSquareMenu /></div>
        
            <div>
                <ul className="bg-white fixed bottom-0 top-20 w-[50%] -left-[50%] dashboardNav transition-all duration-300 lg:left-[0%] lg:w-[30%] z-10">
                    {size < 1024 && <div onClick={close} className="text-2xl p-5"><RxCross1 className="ml-auto"/></div>}
                    <Link to={role == "teacher" ? "/teacherdashboard" : "/studentdashboard"}><li className={active == "teacherdashboard" || active == "studentdashboard" ? "flex items-center gap-2 p-5 active" : "flex items-center gap-2 p-5"}><TbLayoutDashboardFilled />Dashboard</li></Link>
                    <Link to={role == "teacher" ? "/teacherdashboard/teacherCoursesPage" : "/studentdashboard/studentCoursesPage"}><li className={active == "teacherCoursesPage" || active == "studentCoursesPage" ? "flex items-center gap-2 p-5 active" : "flex items-center gap-2 p-5"}><FaVideo />Courses</li></Link>
                    <Link to={role == "teacher" ? '/teacherdashboard/teacherQuizPage' : '/studentdashboard/studentQuizPage'}><li className={active == "teacherQuizPage" || active ==  "studentQuizPage" || active == "quizStatics"  ? "flex items-center gap-2 p-5 active" : "flex items-center gap-2 p-5"}><SiTestcafe />ًQuizes</li></Link>
                    <Link to={role == "teacher" ? "/teacherdashboard/profileSetting" : "/studentdashboard/studentprofileSetting"}><li className={active == "profileSetting" ? "flex items-center gap-2 p-5 active" : "flex items-center gap-2 p-5"}><IoMdSettings />Settings</li></Link>
                    <Link to={role == "teacher" ? "/teacherdashboard/teacherPayment" : "/studentdashboard/studentPayments"}><li className={active == "teacherPayment" ? "flex items-center gap-2 p-5 active" : "flex items-center gap-2 p-5"}><MdOutlinePayment />Payments</li></Link>
                </ul>
            </div>
        </div>
     );
}
 
export default TeachersDashTop;