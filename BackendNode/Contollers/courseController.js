const Course = require('../Models/Course')


const getAllCourses = async (req,res)=>{
    try{

        const courses = await Course.find({isPublished: true}).select(['-courseContent', '-enrolledStudents']).populate({path: 'educator'})
        return res.status(200).json({success: true, courses})

    }catch(error){
        return res.status(500).json({sucess: false, messsage: error.message})
    }
}

const getCourseId = async (req,res)=>{
    try{

        const { id } = req.params
        const courseData = await Course.findById(id).populate({path: 'educator'})
        if(!courseData){
            return res.status(404).json({success: false, message: 'Course not found'})
        }

        courseData.courseContent.forEach((chapter)=>{
            chapter.chapterContent.forEach((lecture)=>{
                if(!lecture.isPreviewFree){
                    lecture.lectureUrl = ""
                }
            })
        })

        return res.status(200).json({success: true, courseData})

    }catch(error){
        return res.status(500).json({success: false, message: error.message})
    }
}   


module.exports = {
    getAllCourses, getCourseId,
}