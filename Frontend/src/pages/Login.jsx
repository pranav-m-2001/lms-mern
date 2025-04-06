import axios from 'axios'
import Cookies from 'js-cookie'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

function Login(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState('')

    const { backenUrl,navigate,isAuthenticated, setIsAuthenticated,checkAuth } = useContext(AppContext)

    async function handleSubmit(event){
        event.preventDefault()
        if(loading){
            return
        }
        setLoading(true)
        if(!email || !password){
            toast.error('All fields required')
            return
        }
        try{

            const response = await axios.post(`${backenUrl}/api/user/login`, {email, password}, {withCredentials: true})
            if(response.data.success){
                checkAuth()
                navigate('/')
            }else{
                toast.error('Something went wrong')
            }

        }catch(error){
            if(error?.response?.data?.message){
               toast.error(error?.response?.data?.message) 
            }else{
                toast.error('Error occured')
            }
        }finally{
            setLoading(false)
        }
    }
   
    useEffect(()=>{
        if(isAuthenticated){
            navigate('/')
        }
    },[isAuthenticated])

    return(
        <form onSubmit={handleSubmit} className="flex flex-col items-center w-[90%] sm:w-96 m-auto mt-14 gap-4 text-gray-800 mb-20">
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
            <p className="prata-regular text-3xl font-medium">Login</p>
            <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>
        <input className="w-full px-3 py-2 border border-gray-800 outline-blue-300" type="text" placeholder="Email" value={email} onChange={(event)=>setEmail(event.target.value)} required />
        <input className="w-full px-3 py-2 border border-gray-800 outline-blue-300" type="password" placeholder="Password" value={password} onChange={(event)=>setPassword(event.target.value)} required />
        <div className="w-full flex justify-between text-sm mt-[-8px]">
            <p className="cursor-pointer">Forgot your password ?</p>
            <p className="cursor-pointer text-blue-600">Create account</p>
        </div>
        <button className="bg-blue-600 w-full rounded-lg font-medium text-white  px-8 py-2 mt-2 cursor-pointer">
            {
                loading ? (
                    <svg aria-hidden="true" role="status" className="inline w-5 h-5  text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                    </svg> 
                ):
                'Login'
            }
        </button>
    </form>
    )
}

export default Login