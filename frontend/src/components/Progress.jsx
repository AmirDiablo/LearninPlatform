import { useEffect } from "react";

const Progress = ({total, count}) => {

    useEffect(()=> {
        const percent = count * 100 / total
        const degree = percent * 3.6
        const progress = document.querySelector(".progress")
        progress.style.backgroundImage = `conic-gradient(
            orange 0deg,orange ${degree}deg, white ${degree}deg, white 360deg
        )`
    }, [])

    return ( 
        <div className={`mx-5 mb-10 relative progress aspect-square w-40 rounded-full`}>
            <div className="bg-white aspect-square w-25 rounded-full absolute left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] text-center pt-10 innerProgress">{count * 100 / total}%</div>
        </div>
     );
}
 
export default Progress;