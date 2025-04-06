import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration'
import Cookies from 'js-cookie'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContext = createContext()

function AppContextProvider({children}){

    const backenUrl = import.meta.env.VITE_BACKEND_URL
    const currency = import.meta.env.VITE_CURRENCY
    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(false)
    const [enrolledCourse, setEnrolledCourse] = useState([])
    const [userData, setUserData] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const navigate = useNavigate()
    const [token , setToken] = useState(Cookies.get('token') ? Cookies.get('token') : null )
    

    async function fetchAllCourse(){
        try{

            const response = await axios.get(`${backenUrl}/api/course/all`)
            const data = response.data
            if(data.success){
                setAllCourses(data.courses)
            }else{
                toast.error(data.message)
            }

        }catch(error){
            console.error(error.message)
            if(error?.response?.data?.message){
                toast.error(error?.response?.data?.message)
            }else{
                toast.error('Something went wrong')
            }
        }
    }

    function calculateRating(course){
        if(course.courseRatings?.length === 0){
            return 0
        }
        let totalRating = 0
        course.courseRatings?.forEach((rating)=>{
            totalRating += rating.rating
        })
        return Math.floor(totalRating / course.courseRatings?.length)
    }

    function calculateChapterTime(chapter){
        let time = 0
        chapter.chapterContent.map((lecture)=> time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, {units: ['h', 'm']})
    }

    function calculateCourseDuration(course){
        let time = 0
        course.courseContent.map((chapter)=> chapter.chapterContent.map((lecture)=> time += lecture.lectureDuration) )
        return humanizeDuration(time * 60 * 1000, {units: ['h', 'm']})
    }

    function calculateNoOfLectures(course){
        let totalLectures = 0
        course.courseContent.forEach((chapter)=>{
            if(Array.isArray(chapter.chapterContent)){
                totalLectures += chapter.chapterContent.length
            }
        })
        return totalLectures
    }

    async function fecthEnrolledCourse(){
        try{
            
            const response = await axios.get(`${backenUrl}/api/user/enrolled-courses`, {withCredentials: true})
            if(response.data.success){
                console.log(response.data.enrolledCourses.reverse())
                setEnrolledCourse(response.data.enrolledCourses.reverse())
            }else{
                toast.error(response.data.message)
            }

        }catch(error){
            console.error(error.message)
            if(error?.response?.data?.message){
                toast.error(error?.response?.data?.message)
            }else{
                toast.error('Something went wrong')
            }
        }
    }

    async function checkAuth(){
        try{

            const response = await axios.get(`${backenUrl}/api/user/check-auth`, {withCredentials: true})
            const data = response.data
            if(data.success){
                setIsAuthenticated(true)
                setUserData(data.user)
                return true
            }else{
                setIsAuthenticated(false)
                return false
            }

        }catch(error){
            if(error?.response?.data?.message){
                toast.error(error?.response?.data?.message)
            }else{
                toast.error(error.message)
            }
            return false
        }
    }

    async function fetchUserData(){
        try{

            const response = await axios.get(`${backenUrl}/api/user/data`)
            if(response.data.success){
                setUserData(response.data.user)
            }else{
                toast.error(response.data.message)
            }

        }catch(error){
            if(error?.response?.data?.message){
                toast.error(error?.response?.data?.message)
            }else{
                toast.error('Something went wrong')
            }
        }
    }



    useEffect(()=>{
        checkAuth()
        fetchAllCourse()
    },[])

    useEffect(()=>{
        if(token){
            fetchUserData()
            fecthEnrolledCourse()
        }
    },[token])

    const value = {
        currency,allCourses,setAllCourses,
        navigate,calculateRating,isEducator,
        calculateChapterTime,calculateCourseDuration,calculateNoOfLectures,
        enrolledCourse,fecthEnrolledCourse,userData,setUserData,token,setToken,backenUrl,
        setIsEducator,isAuthenticated, setIsAuthenticated,checkAuth,
    }

    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider