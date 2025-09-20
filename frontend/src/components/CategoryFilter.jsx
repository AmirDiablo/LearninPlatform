import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";

const CategoryFilter = ({change, changeCategory}) => {
    const [category, setCategory] = useState("all")
    const [validCategory, setValidCategory] = useState([])

    const fetchCategories = async ()=> {
        const response = await fetch("http://localhost:3000/api/course/categories")
        const json = await response.json()
        if(response.ok) {
            setValidCategory(json)
        }
        if(!response.ok) {
            fetchCategories()
        }
    }

    useEffect(()=> {
        fetchCategories()
    }, [])

    return ( 
        <div className="bg-orange-300 rounded-2xl p-2 mt-5 relative">
            <RxCross2 onClick={()=> change(false)} className="absolute right-5" />
            <p className="inline">Category filter</p>
            <select className="bg-white ml-5 my-5" onChange={(e)=> setCategory(e.target.value)}>
                {validCategory?.map((cat)=> (
                    <option value={cat} key={cat}>{cat}</option>
                ))}
            </select>
            <button onClick={()=> {changeCategory(category), change(false)}} className="bg-orange-500 text-white w-[100%] rounded-[10px] h-10">submit</button>
        </div>
     );
}
 
export default CategoryFilter;