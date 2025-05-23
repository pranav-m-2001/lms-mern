import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../context/AppContext"
import { assets, dummyDashboardData } from "../../assets/assets"
import Loading from "../../components/students/Loading"
import { toast } from "react-toastify"
import axios from "axios"

function Dashboard(){


    const { currency, backenUrl, isEducator } = useContext(AppContext)
    const [dashboardData, setDashboardData] = useState(null)

    async function fetchDashboardData(){
        try{

            const { data } = await axios.get(`${backenUrl}/api/educator/dashboard`, {withCredentials: true})
            if(data.success){
                setDashboardData(data.dashboardData)
            }else{
                toast.error(data.message)
            }

        }catch(error){
            if(error?.response?.data?.message){
                toast.error(error?.response?.data?.message)
            }else{
                toast.error(error.message)
            }
        }
    }

    useEffect(()=>{
        if(isEducator){
            fetchDashboardData()
        }
    },[isEducator])

    return dashboardData ? (
        <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0 mb-2">
            <div className="space-y-5">
                <div className="flex flex-wrap gap-5 items-center">
                    <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
                        <img src={assets.patients_icon} alt="" />
                        <div>
                            <p className="text-2xl font-medium text-gray-600">{dashboardData?.enrolledStudentsData?.length || 0}</p>
                            <p className="text-base text-gray-500">Total Enrolments</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
                        <img src={assets.appointments_icon} alt="" />
                        <div>
                            <p className="text-2xl font-medium text-gray-600">{dashboardData.totalCourses}</p>
                            <p className="text-base text-gray-500">Total Courses</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
                        <img src={assets.earning_icon} alt="" />
                        <div>
                            <p className="text-2xl font-medium text-gray-600">{currency} {dashboardData.totalEarnings}</p>
                            <p className="text-base text-gray-500">Total Earnings</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="pb-4 text-lg font-medium">Latest Enrollments</h2>
                    <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                        <table className="table-fixed md:table-auto w-full overflow-hidden">
                            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell border-r border-gray-500/20">#</th>
                                    <th className="px-4 py-3 font-semibold border-r border-gray-500/20">Student Name</th>
                                    <th className="px-4 py-3 font-semibold border-r border-gray-500/20">Course Title</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-500">
                                {
                                   dashboardData?.enrolledStudentsData && dashboardData.enrolledStudentsData.map((item,index)=>(
                                        <tr key={index} className="border-b border-gray-500/20">
                                            <td className="px-4 py-3 text-center hidden sm:table-cell border-r border-gray-500/20">{index + 1}</td>
                                            <td className="md:px-4 px-2 py-3 flex items-center space-x-3 border-r border-gray-500/20">
                                                <img src={item.student.imageUrl} alt="profile" className="w-9 h-9 rounded-full" />
                                                <span className="truncate">{item.student.name}</span>
                                            </td>
                                            <td className="px-4 py-3 truncate border-r border-gray-500/20">{item.courseTitle}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    ) : <Loading/>
}
export default Dashboard