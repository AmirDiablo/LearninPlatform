import { useState } from "react";
import { RxCross2 } from "react-icons/rx";

const PriceFilter = ({change, changePrice}) => {
    const [price, setPrice] = useState(0)

    return ( 
        <div className="bg-orange-300 rounded-2xl p-2 mt-5 relative">
            <RxCross2 onClick={()=> change(false)} className="absolute right-5" />
            <p className="inline">Price filter</p>
            <input type="number" onChange={(e)=> setPrice(e.target.value)} value={price} className="w-10 bg-white aspect-square rounded-[10px] my-2 ml-5 text-center" />
            <button onClick={()=> {changePrice(price), change(false)}} className="bg-orange-500 text-white w-[100%] rounded-[10px] h-10">submit</button>
        </div>
     );
}
 
export default PriceFilter;