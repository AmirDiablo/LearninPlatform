import { useEffect, useState } from "react";
import TeachersDashTop from "../components/TeachersDashTop";
import { useUser } from "../context/userContext";

const TeacherPayment = () => {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [payments, setPayments] = useState([])
    const {user} = useUser()

    const fetchPayments = async ()=> {
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:3000/api/payment/teacherPayments", {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if(!response.ok) {
            setLoading(false)
            setError(json.message)
        }

        if(response.ok) {
            setPayments(json)
            setLoading(false)
            setError(null)
        }
    }

    useEffect(()=> {
        if(user?.token) {
            fetchPayments()
        }
    }, [user])

    return ( 
        <div>

            <div className="lg:w-[30%]">
                <TeachersDashTop active={"teacherPayment"}/>
            </div>

            <div className="lg:w-[70%] lg:absolute lg:right-0">
                <div className="w-[90%] overflow-auto mt-10 rounded-2xl mx-auto">
                            <table className="text-left bg-orange-500 rounded-t-2xl">
                                <thead className="text-white">
                                    <tr className="h-10">
                                        <th className="px-5">Avatar</th> 
                                        <th className="px-5">Email</th>
                                        <th className="px-5">Course</th>
                                        <th className="text-center">amount</th>
                                        <th className="text-center">Date</th>
                                        <th className="px-5">TransactionId</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {payments.map(item=> (
                
                                            <tr className="h-15 odd:bg-white even:bg-gray-200">
                                                <td className="px-5"><img className="rounded-full object-cover w-15" src={"http://localhost:3000/uploads/profiles/"+item.userId.profile} /></td>
                                                <td className="px-5">{item.userId.email}</td>
                                                <td className="min-w-50 px-5">{item.courseId.title}</td>
                                                <td className="min-w-20 text-center">{item.amount} $</td>
                                                <td className="min-w-30 text-center">{`${new Date(item.paymentDate).getFullYear()} / ${new Date(item.paymentDate).getMonth()} / ${new Date(item.paymentDate).getDate()}`}</td>
                                                <td className="px-5">{item.transactionId}</td>
                                            </tr>
                                    ))}
                                </tbody>

                            </table>
                    </div>
            </div>

           

        </div>
     );
}
 
export default TeacherPayment;