import { useContext, useEffect, useState } from "react"
import { data, useParams } from "react-router-dom"
import { AppContext } from "../../context/AppContext"
import { assets } from "../../assets/assets"
import humanizeDuration from 'humanize-duration'
import YouTube from 'react-youtube'
import Rating from "../../components/students/Rating"
import axios from "axios"
import { toast } from "react-toastify"
import Loading from "../../components/students/Loading"

function Player(){

    const { enrolledCourse,calculateChapterTime,backenUrl,userData,fecthEnrolledCourse } = useContext(AppContext)
    const { courseId } = useParams()
    const [courseData, setCourseData] = useState(null)
    const [openSection, setOpenSection] = useState({})
    const [playerData, setPlayerData] = useState(null)
    const [progressData, setProgressData] = useState(null)
    const [initialRating, setIntialRating] = useState(0)

    function getCourseData(){
        enrolledCourse.map((course)=>{
            if(course._id === courseId){
                setCourseData(course)
                course.courseRatings.map((item)=>{
                    if(item.userId === userData._id){
                        setIntialRating(item.rating)
                    }
                })
            }
        })

    }

    function toggleSection(index){
        setOpenSection((prev)=>({...prev, [index]: !prev[index]}))
    }

    async function markLectureAsCompleted(lectureId){
        try{

            const { data } = await axios.post(`${backenUrl}/api/user/update-course-progress`,{courseId: courseData._id, lectureId}, {withCredentials: true} )
            if(data.success){
                toast.success(data.message)
                getCourseProgress()
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

    async function getCourseProgress(){
        try{

            const { data } = await axios.post(`${backenUrl}/api/user/get-course-progress`, {courseId}, {withCredentials: true})
            if(data.success){
                setProgressData(data.progressData)
            }else{
                toast.error(data.message)
            }

        }catch(error){
            if(error?.response?.data?.message){
                toast.error(error?.response?.data?.message)
            }
        }
    }

    async function handleRating(rating){
        try{

            const { data } = await axios.post(`${backenUrl}/api/user/add-rating`, {courseId, rating},{withCredentials:true})
            if(data.success){
                toast.success(data.message)
                fecthEnrolledCourse()
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
        if(enrolledCourse.length > 0){
            getCourseData()
        }
    },[courseId,enrolledCourse])

    useEffect(()=>{
        getCourseProgress()
    },[])

    return courseData ? (
      <>
        <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
            {/* Left Column */}
            <div className="text-gray-800">
                <h2 className="text-xl font-semibold">Course Structure</h2>
                  <div className="pt-5">
                    {
                       courseData && courseData.courseContent.map((chapter,index)=>(
                            <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
                                <div className="flex items-center justify-between px-4 py-3 cursor-pointer select-none" onClick={()=>toggleSection(index)}>
                                    <div className="flex items-center gap-2">
                                        <img className={`transform transition-transform ${openSection[index] ? 'rotate-180' : ''}`} src={assets.down_arrow_icon} alt="arrow-icon" />
                                        <p className="font-medium md:text-base text-sm">{chapter.chapterTitle}</p>
                                    </div>
                                    <p>{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</p>
                                </div>
                                <div className={`overflow-hidden transition-all duration-300 ${openSection[index] ? 'max-h-96' : 'max-h-0'}`}>
                                    <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                                        {
                                            chapter.chapterContent.map((lecture,i)=>(
                                                <li key={i} className="flex items-start gap-2 py-1">
                                                    <img src={ playerData && progressData.lectureCompleted.includes(lecture.lectureId) ? assets.blue_tick_icon : assets.play_icon} alt="play icon" className="w-4 h-4 ml-1" />
                                                    <div className="flex items-center justify-between w-full text-gary-800 text-xs md:text-[16px]">
                                                        <p>{lecture.lectureTitle}</p>
                                                        <div className="flex gap-2">
                                                            {
                                                                lecture.lectureUrl && (
                                                                    <p onClick={()=>setPlayerData({
                                                                        ...lecture, chapter: index + 1, lecture: i + 1
                                                                    })} className="text-blue-500 cursor-pointer">Preview</p>
                                                                )
                                                            }
                                                            <p>
                                                                {
                                                                    humanizeDuration(lecture.lectureDuration * 60 * 1000, {units: ['h', 'm']})
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="flex items-center gap-2 py-3 mt-10">
                    <h1 className="text-xl font-bold">Rate this Course: </h1>
                    <Rating initialRating={initialRating} onRate={handleRating} />
                </div>
            </div>

            {/* Right Column */}
            <div className="md:mt-10">
                {
                    playerData ? (
                        <div>
                            <YouTube videoId={playerData.lectureUrl.split('/').pop()} opts={{playerVars:{autoplay: 1}}} iframeClassName="w-full aspect-video" />
                            <div className="flex items-center justify-between mt-1">
                                <p>{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>
                                <button onClick={()=> markLectureAsCompleted(playerData.lectureId)} className="text-blue-600">{progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? 'Completed' : 'Mark as completed'}</button>
                            </div>
                        </div>
                    ):(
                        <img src={courseData ? courseData.courseThumbnail : ''} alt="" />
                    )
                }
                
            </div>
        </div>
      </>
    ) : <Loading/>
}
export default Player