import { useUser } from "../context/userContext";
import { FaJs } from "react-icons/fa";
import TeachersDashTop from "../components/TeachersDashTop";
import { PiBookBookmarkBold } from "react-icons/pi";
import { FaStar } from "react-icons/fa";
import { MdGroup } from "react-icons/md";
import { FaDollarSign } from "react-icons/fa";

const TeacherDashboard = () => {
    const {user} = useUser()

    console.log(user.userInfo[0])

    return ( 
        <div>

            <div className="lg:w-[30%]">
                <TeachersDashTop active={'teacherdashboard'} /> 
            </div>
            
            <div className="lg:w-[70%] lg:absolute lg:right-0">
                <div className="flex justify-between items-center mx-5">
                    <p className="text-2xl">Welcome back, {user?.userInfo[0]?.username}</p>
                    <img src={"http://localhost:3000/uploads/profiles/"+user?.userInfo[0]?.profile} className="rounded-full object-cover w-30" />
                </div>

                <div className="flex w-[100%] *:w-[100%] gap-2 px-5 mt-10 *:p-5">
                    <div className="flex flex-col items-center bg-white rounded-2xl border-[2px] border-black/10">
                        <div className="text-[40px] text-green-700"><PiBookBookmarkBold /></div>
                        <p className="text-[30px]">2</p>
                        <p>Courses</p>
                    </div>

                    <div className="flex flex-col items-center bg-white border-[2px] border-black/10 rounded-2xl">
                        <div className="text-[40px] text-yellow-500"><FaStar /></div>
                        <p className="text-[30px]">2.5</p>
                        <p>rating</p>
                    </div>

                    <div className="flex flex-col items-center border-[2px] border-black/10 bg-white rounded-2xl">
                        <div className="text-[40px] text-blue-500"><MdGroup /></div>
                        <p className="text-[30px]">10</p>
                        <p>students</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border-[2px] border-black/10 p-5 flex flex-col items-center mx-5 mt-2">
                    <div className="text-[30px] text-green-600"><FaDollarSign /></div>
                    <div>
                        <p className="text-[30px]">374</p>
                        <p>Income</p>
                    </div>
                </div>


            </div>

        </div>
     );
}
 
export default TeacherDashboard;