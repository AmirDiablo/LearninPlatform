import { useEffect, useState } from "react"

const Donut = ({statics, enrollmentCount}) => {
    let colors = ['red', 'blue', "yellow", "green"]
    const colorClasses = [
        'bg-red-500',
        'bg-blue-500',
        'bg-yellow-500',
        'bg-green-500'
    ];
    

    useEffect(()=> {
        const chart = document.querySelector(".pieChart")
        let arr = [];
        statics.map(item=> arr.push({courseName: item.courseTitle, percent: item.count * 100 / enrollmentCount}))
        const courses = arr
        const degrees = []
        courses.map(item=> degrees.push({courseName: item.courseName, deg: item.percent * 3.6}))
        let styles = ""
        let lastPoint = 0;
        for(let i=0; i<courses.length; i++) {
            const color = colors[i]
            const end = degrees[i].deg + lastPoint
            const preDeg = i == 0 ? 0 : lastPoint
            lastPoint = end
            styles = i == courses.length-1 ? styles + `${color} ${preDeg}deg,${color} ${end}deg` : styles + `${color} ${preDeg}deg,${color} ${end}deg,`
        }
        const completed = `conic-gradient(
            ${styles}
        )`

        console.log(completed)
        chart.style.backgroundImage = completed
    }, [])

    return ( 
        <div className="flex gap-5 mt-10 mx-5 mb-10">

            <div className={`relative pieChart aspect-square w-40 rounded-full`}>
                <div className="bg-white aspect-square w-25 rounded-full absolute left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%]"></div>
            </div>

            <div className="flex flex-col gap-2">

                {statics.map((item, index) => (
                    <div className="flex items-center">
                        <div className={`w-5 ${colorClasses[index]} aspect-square`}></div>
                        <p className="text-[13px]">{item.courseTitle}</p>
                    </div>
                ))}

            </div>

        </div>
     );
}
 
export default Donut;