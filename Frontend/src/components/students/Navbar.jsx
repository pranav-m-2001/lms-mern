import { Link } from "react-router-dom"
import { assets } from "../../assets/assets"
import { useClerk,UserButton,useUser } from '@clerk/clerk-react'
import { useContext, useEffect } from "react"
import { AppContext } from "../../context/AppContext"
import axios, { isAxiosError } from "axios"
import { toast } from "react-toastify"

function Navbar(){

    const courseListPage = location.pathname.includes('/course-list')
    const { openSignIn } = useClerk()
    const { user } = useUser()
    const { navigate,isEducator,backenUrl,setIsEducator,userData,setUserData, } = useContext(AppContext)

    async function becomeEducator(){
        try{

            if(isEducator){
                navigate('/educator')
                return
            }

            const response = await axios.get(`${backenUrl}/api/educator/update-role`, {withCredentials: true})
            const data = response.data
            if(data.success){
                setIsEducator(true)
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }

        }catch(error){  
            if(error?.respnse?.data?.message){
                toast.error(error?.respnse?.data?.message)
            }else{
                toast.error(error.message)
            }
        }
    }

 

    useEffect(()=>{
     if(userData){
        if(userData.role === 'educator'){
            setIsEducator(true)
        }
     }
    },[userData])
    return(
        <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${courseListPage ? 'bg-white' : 'bg-cyan-100/70'}`}>
            <img onClick={()=>navigate('/')} src={assets.logo} alt="Logo" className="w-28 lg:w-32 cursor-pointer" />
            <div className="hidden md:flex items-center gap-5 text-gray-500">
                <div className="flex items-center gap-5">
                    {
                        userData && (
                            <>
                            <button onClick={becomeEducator}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
                            | <Link to="/my-enrollments">My Enrollments</Link>
                            </>
                        )
                    }
                </div>
                {
                    userData ? (
                        <button onClick={()=>openSignIn()}><img src={assets.user_icon} alt="" /></button>
                    ) 
                    : (
                        <button onClick={()=>navigate('/login')} className="bg-blue-600 text-white px-5 py-2 rounded-full">Create Account</button>
                    )
                }
            </div>
            {/* For Phone Screens */}
            <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
                <div>
                    {
                        userData && (
                            <>
                                <button onClick={becomeEducator}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
                                | <Link to="/my-enrollments">My Enrollments</Link>
                            </>
                        )
                    }
                </div>
                {
                    userData ? (
                        <button onClick={()=>openSignIn()}><img src={assets.user_icon} alt="" /></button>
                    )
                    : (
                        <button onClick={()=>openSignIn()}><img src={assets.user_icon} alt="" /></button>
                    )
                }
                
            </div>
        </div>
    )
}
export default Navbar