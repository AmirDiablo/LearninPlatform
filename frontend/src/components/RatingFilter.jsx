import { useState } from "react";
import { RxCross2 } from "react-icons/rx";

const RatingFilter = ({change, changeRating}) => {
    const [rating, setRating] = useState(0)

    return ( 
        <div className="bg-orange-300 rounded-2xl p-2 mt-5 relative">
            <RxCross2 onClick={()=> change(false)} className="absolute right-5" />
            <p className="inline">Rating filter</p>
            <input type="number" onChange={(e)=> setRating(e.target.value)} value={rating} className="w-10 bg-white aspect-square rounded-[10px] my-2 ml-5 text-center" />
            <button onClick={()=> {changeRating(rating), change(false)}} className="bg-orange-500 text-white w-[100%] rounded-[10px] h-10">submit</button>
        </div>
     );
}
 
export default RatingFilter;