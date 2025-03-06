import CallToAction from "../../components/students/CallToAction"
import Companies from "../../components/students/Companies"
import CoursesSection from "../../components/students/CoursesSection"
import Hero from "../../components/students/Hero"
import TestimonialSection from "../../components/students/TestimonialsSection"

function Home(){

    return(
        <div className="flex flex-col items-center space-y-7 text-center">
            <Hero/>
            <Companies/>
            <CoursesSection/>
            <TestimonialSection/>
            <CallToAction/>
        </div>
    )
}
export default Home