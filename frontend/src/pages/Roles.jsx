import { Link } from "react-router-dom";

const Roles = () => {
    return ( 
        <div className="flex justify-center items-center flex-wrap gap-5 flex-row">
            <Link to="/login">
                <img src="/student.png" className="rounded-[10px] aspect-square w-[40vw] max-w-[500px]" />
                <p className="text-center text-[4vw]">Students</p>
            </Link>
            <Link to="/teacherLogin">
                <img src="/teacher.png" className="rounded-[10px] aspect-square w-[40vw] max-w-[500px]" />
                <p className="text-center text-[4vw]">Teachers</p>
            </Link>
        </div>
     );
}
 
export default Roles;