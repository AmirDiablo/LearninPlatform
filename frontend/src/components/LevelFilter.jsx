import { useState } from "react";
import { RxCross2 } from "react-icons/rx";

const LevelFilter = ({change, changeLevel}) => {
    const [level, setLevel] = useState("all")

    return ( 
        <div className="bg-orange-300 rounded-2xl p-2 mt-5 relative">
            <RxCross2 onClick={()=> change(false)} className="absolute right-5" />
            <p className="inline">Level filter</p>
            <select className="bg-white ml-5 my-5" onChange={(e)=> setLevel(e.target.value)} value={level}>
                <option value="all">all</option>
                <option value="beginner">beginner</option>
                <option value="intermediate">intermediate</option>
                <option value="advanced">advanced</option>
            </select>
            <button onClick={()=> {changeLevel(level), change(false)}} className="bg-orange-500 text-white w-[100%] rounded-[10px] h-10">submit</button>
        </div>
     );
}
 
export default LevelFilter;