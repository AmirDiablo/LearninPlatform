import { FaStar } from "react-icons/fa6";
import { PiCoins } from "react-icons/pi";
import { BiCategory } from "react-icons/bi";
import { FaChartLine } from 'react-icons/fa'
import { ImFilter } from "react-icons/im";
import { useState } from "react";
import RatingFilter from "./RatingFilter";
import PriceFilter from "./PriceFilter";
import CategoryFilter from "./CategoryFilter";
import LevelFilter from "./LevelFilter";

const Filter = ({setCourses, setPageCount, setTeachers}) => {
    const [rating, setRating] = useState(0) //at least
    const [price, setPrice] = useState() //at most
    const [level, setLevel] = useState('all')
    const [category, setCategory] = useState("all")
    const [ratingIsOpen, setRatingIsOpen] = useState(false)
    const [priceIsOpen, setPriceIsOpen] = useState(false)
    const [categoryIsOpen, setCategoryIsOpen] = useState(false)
    const [levelIsOpen, setLevelIsOpen] = useState(false)
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')


    const filter = async(e)=> {
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:3000/api/course/filter", {
            method: "POST",
            body: JSON.stringify({search, rating, price, category, level}),
            headers: {
                "Content-Type" : "application/json"
            }
        })
        const json = await response.json()

        if(response.ok) {
            setLoading(false)
            setError(null)
            setCourses(json.courses)
            setPageCount(json.pageCount)
            setTeachers(json.teachers)
        }

        if(!response.ok) {
            setLoading(false)
            setError(json.messgae)
        }
    }
    
    return ( 
        <div>

            <input type="search" onChange={(e)=> setSearch(e.target.value)} placeholder="Find a course" className="bg-white border-1  rounded-[7px] p-2 w-[100%] mb-5" />

            <div className="flex items-center justify-between">

                <div className="*:border-2 gap-2 *:text-[30px] *:border-orange-500 *:p-2 *:rounded-[5px] *:text-orange-500 flex ">
                    <div onClick={()=> setRatingIsOpen(true)}><FaStar /></div>
                    <div onClick={()=> setPriceIsOpen(true)}><PiCoins /></div>
                    <div onClick={()=> setCategoryIsOpen(true)}><BiCategory /></div>
                    <div onClick={()=> setLevelIsOpen(true)}><FaChartLine /></div>
                </div>
                <div onClick={filter} className="bg-orange-500 p-2 text-[30px] rounded-[5px] "><ImFilter className="text-white" /></div>

            </div>

            {ratingIsOpen && <RatingFilter change={setRatingIsOpen} changeRating={setRating} />}
            {priceIsOpen && <PriceFilter change={setPriceIsOpen} changePrice={setPrice} />}
            {categoryIsOpen && <CategoryFilter change={setCategoryIsOpen} changeCategory={setCategory} />}
            {levelIsOpen && <LevelFilter change={setLevelIsOpen} changeLevel={setLevel} />}
        </div>
     );
}
 
export default Filter;