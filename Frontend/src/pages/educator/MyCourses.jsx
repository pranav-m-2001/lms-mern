import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../context/AppContext"
import Loading from "../../components/students/Loading"
import { toast } from "react-toastify"
import axios from "axios"

function MyCourses(){

    const {currency, allCourses,backenUrl, isEducator,} = useContext(AppContext)

    const [courses, setCourses] = useState(null)

    async function fetchCourses(){
        try{

            const { data } = await axios.get(`${backenUrl}/api/educator/courses`, {withCredentials: true})
            if(data.success){
                setCourses(data.courses)
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
            fetchCourses()
        }
    },[isEducator])

    return courses ? (
        <div className="h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
            <div className="w-full">
                <h2 className="pb-4 text-xl font-medium">My Courses</h2>
                <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md border border-gray-500/20">
                    <table className="table-fixed md:table-auto w-full overflow-hidden">
                        <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                            <tr> 
                                <th className="px-4 py-3 font-semibold truncate">All Courses</th>
                                <th className="px-4 py-3 font-semibold truncate">Earnings</th>
                                <th className="px-4 py-3 font-semibold truncate">Students</th>
                                <th className="px-4 py-3 font-semibold truncate">Published On</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-500">
                            {
                                courses.map((course,index)=>(
                                    <tr key={index} className="border-b border-gray-500/20">
                                        <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                                            <img src={course.courseThumbnail} alt="" className="w-16" />
                                            <span className="truncate hidden md:block">{course.courseTitle}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {currency} { Math.floor(course.enrolledStudents.length * (course.coursePrice - course.discount * course.coursePrice / 100)) }
                                        </td>
                                        <td className="px-4 py-3">
                                            {course.enrolledStudents.length}
                                        </td>
                                        <td className="px-4 py-3">
                                            { new Date(course.createdAt).toLocaleDateString() }
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    ) : <Loading/>
}
export default MyCourses