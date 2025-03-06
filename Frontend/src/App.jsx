import { Route, Routes, useMatch } from "react-router-dom"
import Home from "./pages/students/Home"
import CourseList from "./pages/students/CourseList"
import CourseDetails from "./pages/students/CourseDetails"
import MyEnrollments from "./pages/students/MyEnrollments"
import Player from "./pages/students/Player"
import Loading from "./components/students/Loading"
import Educator from "./pages/educator/Educator"
import Dashboard from "./pages/educator/Dashboard"
import AddCourse from "./pages/educator/AddCourse"
import MyCourses from "./pages/educator/MyCourses"
import StudentsEnrolled from "./pages/educator/StudentsEnrolled"
import Navbar from "./components/students/Navbar"
import Footer from "./components/students/Footer"
import "quill/dist/quill.snow.css"

function App() {

  const isEducatorRoute = useMatch('/educator/*')

  return (
    <div className="text-default min-h-screen bg-white">
      {
        !isEducatorRoute && <Navbar/>
      }
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/course-list" element={<CourseList/>} />
        <Route path="/course-list/:input" element={<CourseList/>} />
        <Route path="/course/:id" element={<CourseDetails/>} />
        <Route path="/my-enrollments" element={<MyEnrollments/>} />
        <Route path="/player/:courseId" element={<Player/>} />
        <Route path="/loading/:path" element={<Loading/>} />

        <Route path="/educator" element={<Educator/>}>
          <Route path="/educator" element={<Dashboard/>} />
          <Route path="add-course" element={<AddCourse/>}/>
          <Route path="my-course" element={<MyCourses/>} />
          <Route path="student-enrolled" element={<StudentsEnrolled/>} />
        </Route>

      </Routes>
      {!isEducatorRoute && <Footer/>}
    </div>
  )
}

export default App
