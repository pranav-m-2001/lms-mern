import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../context/AppContext"
import { Line } from 'rc-progress'
import { toast } from "react-toastify"
import axios from "axios"

function MyEnrollments(){


    const { enrolledCourse,fecthEnrolledCourse,calculateCourseDuration,navigate,userData,calculateNoOfLectures,backenUrl } = useContext(AppContext)
    const [progressArray, setProgressArray] = useState([
        // {lectureCompleted: 2, totalLecture: 4},
        // {lectureCompleted: 1, totalLecture: 5},
        // {lectureCompleted: 3, totalLecture: 6},
        // {lectureCompleted: 4, totalLecture: 4},
        // {lectureCompleted: 0, totalLecture: 3},
        // {lectureCompleted: 5, totalLecture: 7},
        // {lectureCompleted: 6, totalLecture: 8},
        // {lectureCompleted: 4, totalLecture: 10},
        // {lectureCompleted: 7, totalLecture: 7},
        // {lectureCompleted: 1, totalLecture: 4},
        // {lectureCompleted: 0, totalLecture: 2},
        // {lectureCompleted: 5, totalLecture: 5},
    ])

    async function getCourseProgress(){
        try{

            const tempProgressArray = await Promise.all(
                enrolledCourse.map( async (course)=>{
                    const { data } = await axios.post(`${backenUrl}/api/user/get-course-progress`, {courseId: course._id}, {withCredentials: true})
                    let totalLectures = calculateNoOfLectures(course)
                    const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0
                    return {totalLectures, lectureCompleted}
                })  
            )
            setProgressArray(tempProgressArray)

        }catch(error){
            if(error?.response?.data?.message){
                toast.error(error?.response?.data?.message)
            }else{
                toast.error(error.message)
            }
        }
    }

    useEffect(()=>{
        if(userData){
            fecthEnrolledCourse()
        }
    },[userData])

    useEffect(()=>{
        if(enrolledCourse.length > 0){
            getCourseProgress()
        }
    },[enrolledCourse])


    return(
      <>
        <div className="md:px-36 px-8 pt-10">
            <h1 className="text-2xl font-semibold">My Enrollments</h1>
            <table className="md:table-auto table-fixed w-full overflow-hidden border mt-10">
                <thead className="text-gray-900 border-b border-gray-500/20 text-sm  text-left max-sm:hidden">
                    <tr>
                        <th className="px-4 py-3 font-medium truncate">Course</th>
                        <th className="px-4 py-3 font-medium truncate">Duration</th>
                        <th className="px-4 py-3 font-medium truncate">Completed</th>
                        <th className="px-4 py-3 font-medium truncate">Status</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700">
                    {
                        enrolledCourse.map((course,index)=>(
                            <tr key={index} className="border-b border-gray-500/20">
                                <td className="md:px-4 pl-2 md:pl-4 flex items-center space-x-3">
                                    <img src={course.courseThumbnail} alt="" className="w-14 sm:w-24 md:w-28" />
                                    <div className="flex-1 ">
                                        < p className="mb-1 max-sm:text-sm">{course.courseTitle}</p>
                                        <Line strokeWidth={2} percent={progressArray[index] ? (progressArray[index].lectureCompleted *100) / progressArray[index].totalLecture : 0} className="bg-gray-300 rounded-full" />
                                        <p className="md:text-sm text-xs text-blue-600 mt-1">{progressArray[index] ? ((progressArray[index].lectureCompleted *100) / progressArray[index].totalLecture).toFixed() : 0}% Completed</p>
                                    </div>
                                </td>
                                <td className="px-4 py-3 max-sm:hidden">
                                    {calculateCourseDuration(course)}
                                </td>
                                <td className="px-4 py-3 max-sm:hidden">
                                  { progressArray[index] && `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLecture}` } <span>Lectures</span>
                                </td>
                                <td className="px-4 py-3 max-sm:text-right">
                                    <button onClick={()=>navigate(`/player/${course._id}`)} className="px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 max-sm:text-xs text-white cursor-pointer">{progressArray[index] && progressArray[index].lectureCompleted / progressArray[index].totalLecture === 1 ? 'Completed' : 'Ongoing'}</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
      </>
    )
}
export default MyEnrollments