import { Link } from 'react-router-dom'
import { assets, dummyEducatorData } from '../../assets/assets'
import { UserButton, useUser } from '@clerk/clerk-react'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'

function Navbar(){

    const {  userData } = useContext(AppContext)
    const educatorData = dummyEducatorData
    const { user } = useUser()

    return(
        <div className='flex items-center justify-between px-4 md:px-8 border-b border-b-gray-500 py-3'>
            <Link to="/">
                <img src={assets.logo} alt="" className='w-28 lg:w-32' />
            </Link>
            <div className='flex items-center gap-5 text-gray-500 relative'>
                <p>Hi! {userData ? userData.name : "Developers"}</p>
                {
                    userData ? (
                        <img src={assets.profile_img} alt="" className='max-w-8' />
                    ):(
                        <img src={assets.profile_img} alt="" className='max-w-8' />
                    )
                }
            </div>
        </div>
    )
}
export default Navbar