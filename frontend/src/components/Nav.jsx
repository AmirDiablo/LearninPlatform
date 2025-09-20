import { Link } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { useUser } from "../context/userContext";

const Nav = () => {
    const {user} = useUser()
    const role = user?.userInfo[0]?.roles

    const closeNav = ()=> {
        document.querySelector(".nav").style.left = "-60%"
        document.querySelector(".layer").style.display = "none"
    }

    console.log(user?.userInfo[0]?.roles)

    return ( 
        <div className="nav fixed z-11 w-[60%] bg-[#F8F7F3] px-5 py-5 bottom-0 top-0 -left-[60%] transition-all duration-300 md:w-[30%]">
            <RxCross1 onClick={closeNav} className="float-right" />
            <div className="flex items-center gap-5">
                <img src={"http://localhost:3000/uploads/profiles/"+user?.userInfo[0]?.profile} className="aspect-square w-20 rounded-full object-cover bg-purple-700" />
                <div>
                    <p>{user?.userInfo[0]?.username}</p>
                </div>
            </div>
            <div className="w-[90%] h-[1px] bg-black/30 mt-5 mx-auto"></div>
            <ul className="pt-5">
                <Link to={role == "teacher" ? "/teacherdashboard" : "/studentdashboard"}><li className="p-2">Profile</li></Link>
                <Link to="/courses"><li className="p-2">Courses</li></Link>
                <Link to="/aboutus"><li className="p-2">About Us</li></Link>
                <Link to="/support"><li className="p-2">Support</li></Link>
            </ul>
        </div>
     );
}
 
export default Nav;