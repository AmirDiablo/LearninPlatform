import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { Link } from "react-router-dom";

const TopNav = () => {

    const openNav = ()=> {
        document.querySelector(".nav").style.left = "0%"
        document.querySelector(".layer").style.display = "inline"
    }

    return ( 
        <div className="flex items-center justify-between px-5 py-5 fixed right-0 left-0 top-0 backdrop-blur-2xl z-10">
            <div className="flex gap-5">
                <div className="text-3xl" onClick={openNav}><HiOutlineMenuAlt2 /></div>
                <Link to="/" className="title font-[600] text-xl">CodeRush</Link>
            </div>
            <Link to="/roles"><div className="bg-amber-600 text-white rounded-full py-2 px-5 w-max">Get Started</div></Link>
        </div>
     );
}
 
export default TopNav;