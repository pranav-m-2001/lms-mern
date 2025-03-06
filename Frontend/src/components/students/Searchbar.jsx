import { useState } from "react"
import { assets } from "../../assets/assets"
import { useNavigate } from 'react-router-dom'

function Searchbar({ data }){

    const navigate = useNavigate()
    const [input, setInput] = useState(data ? data : '')

    function onSearchHandler(event){
        event.preventDefault()
        navigate(`/course-list/${input}`)
    }

    return(
        <form onSubmit={onSearchHandler} className="max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded">
            <img src={assets.search_icon} alt="search-icon" className="md:w-auto w-10 px-3" />
            <input type="text" placeholder="Search for courses" onChange={(event)=>setInput(event.target.value)} value={input} className="w-full h-full outline-none text-gray-500/80" />
            <button type="submit" className="bg-blue-600 rounded text-white md:px-10 px-7 md:py-3 py-1 mx-1 cursor-pointer">Search</button>
        </form>
    )
}
export default Searchbar