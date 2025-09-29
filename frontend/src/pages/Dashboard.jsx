import {Link} from "react-router-dom"
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { FaVideo } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdOutlinePayment } from "react-icons/md";
import { TbCertificate } from "react-icons/tb";
import { RxCross1 } from "react-icons/rx";
import { useState } from "react";
import { LuSquareMenu } from "react-icons/lu";
import { useUser } from "../context/userContext";
import { FaJs } from "react-icons/fa";


const Dashboard = () => {
    const [size, setSize] = useState(window.innerWidth)
    const {user} = useUser()

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

            <div onClick={open} className="bg-orange-500 p-2 aspect-square w-12 rounded-2xl text-white text-2xl flex justify-center items-center mx-5"><LuSquareMenu /></div>

            <div>
                <ul className="bg-white fixed bottom-0 top-20 w-[50%] -left-[50%] dashboardNav transition-all duration-300 lg:left-[0%] lg:w-[30%]">
                    {size < 1024 && <div onClick={close} className="text-2xl p-5"><RxCross1 className="ml-auto"/></div>}
                    <Link><li className="flex items-center gap-2 p-5 active"><TbLayoutDashboardFilled />Dashboard</li></Link>
                    <Link><li className="flex items-center gap-2 p-5"><FaVideo />Courses</li></Link>
                    <Link><li className="flex items-center gap-2 p-5"><IoMdSettings />Settings</li></Link>
                    <Link><li className="flex items-center gap-2 p-5"><MdOutlinePayment />Payments</li></Link>
                    <Link><li className="flex items-center gap-2 p-5"><TbCertificate />Certificates</li></Link>
                </ul>
            </div>

            <div className="lg:w-[70%] lg:absolute lg:right-0">
                <div className="flex justify-between items-center mx-5">
                    <p className="text-2xl">Welcome back, {user?.userInfo[0]?.username}</p>
                    <img src={"http://localhost:3000/uploads/profiles/"+user?.userInfo[0]?.profile} className="rounded-full object-cover w-30" />
                </div>

                <div className="mx-5 mt-10">
                    <p className="text-[18px]">My Courses</p>
                    <div className="w-[100%] flex justify-between gap-5 bg-white p-5 mt-2">
                        <div className="w-[100%]">
                            <strong>python for beginners</strong>
                            <div className="w-[100%] h-[10px] bg-red-200 rounded-full"><div className="w-[40%] bg-orange-500 h-[100%] rounded-full"></div></div>
                        </div>
                        <button className="bg-orange-500 text-white text-center rounded-[7px] px-5 py-2">Continue</button>
                    </div>

                    <div className="w-[100%] flex justify-between gap-5 bg-white p-5 mt-2">
                        <div className="w-[100%]">
                            <strong>Java for beginners</strong>
                            <div className="w-[100%] h-[10px] bg-red-200 rounded-full"><div className="w-[70%] bg-orange-500 h-[100%] rounded-full"></div></div>
                        </div>
                        <button className="bg-orange-500 text-white text-center rounded-[7px] px-5 py-2">Continue</button>
                    </div>
                </div>

                <div className="mx-5 mt-10">
                    <p className="text-[18px]">Recommended</p>
                    <div className="flex items-center gap-5 p-2 bg-white rounded-2xl mt-2">
                        <div className="text-6xl text-orange-500"><FaJs className="rounded-2xl"/></div>
                        <p className="text-xl">JavaScript fundamentals</p>
                    </div>

                    <div className="flex items-center gap-5 p-2 bg-white rounded-2xl mt-2">
                        <div className="text-6xl text-orange-500"><FaJs className="rounded-2xl"/></div>
                        <p className="text-xl">JavaScript fundamentals</p>
                    </div>
                </div>


            </div>

        </div>
     );
}
 
export default Dashboard;