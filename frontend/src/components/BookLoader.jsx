const BookLoader = () => {
    return ( 
    <div className="absolute left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%]">

        <div class="loader h-3 relative w-24 left-[50%] -translate-x-[50%] overflow-visible mt-40">
            <div className="lefttSide w-13 h-[2px] absolute -left-5 rounded-2xl bg-orange-500"></div>
            <div className="leftPage w-11 h-[2px] absolute -top-1 -translate-x-[10px] rounded-2xl bg-orange-500"></div>
            <div className="movingleftPage w-11 h-[2px]  absolute -top-1 -translate-x-[10px] rounded-2xl bg-orange-500"></div>
            <div className="bookBase w-8 h-3 border-x-[2px] border-b-[2px] rounded-[3px] mx-auto border-orange-500"></div>
            <div className="rightPage w-11 h-[2px] absolute -top-1 -right-3 rounded-2xl bg-orange-500"></div>
            <div className="rightSide w-13 h-[2px] absolute -right-5 top-0 rounded-2xl bg-orange-500"></div>
        </div>

    </div>
     );
}
 
export default BookLoader;