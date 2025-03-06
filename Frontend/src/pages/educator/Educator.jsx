import { Outlet } from "react-router-dom"
import { assets } from "../../assets/assets"
import Navbar from "../../components/educator/Navbar"
import Sidebar from "../../components/educator/Sidebar"
import Footer from "../../components/educator/Footer"

function Educator(){

    return(
        <div className="text-[16px] min-h-screen bg-white">
            <Navbar/>
            <div className="flex">
                <Sidebar/>
                <div className="flex-1">
                    <Outlet/>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
export default Educator