const { clerkClient } = require('@clerk/express')
const Course = require('../Models/Course')
const cloudinary = require('cloudinary').v2
const User = require('../Models/User')
const Purchase = require('../Models/Purchase')

const updateRoleToEducator = async (req,res)=>{
    try{

        const userId = req.auth.userId
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata:{
                role: 'educator'
            }
        })
        res.status(200).json({success: true, message: 'You can publish a course now'})

    }catch(error){
        res.status(400).json({success: false, message: error.message})
    }
}

const roleToEducator = async (req,res)=>{
    try{

        const userId = req.userId
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({success: false, message: 'User not found'})
        }
        user.role = 'educator'
        await user.save()
        return res.status(200).json({success: true, message: 'Role updated'})

    }catch(error){
        res.status(500).json({success: false, message: error.message})
    }
}

const addCourse = async (req,res)=>{
    try{

        const { courseData } = req.body
        const imageFile = req.file
        const educatorId = req.userId
        if(!imageFile){
            return res.status(400).json({success: false, message: 'Thumbnail not attached'})
        }

        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId
        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()

        return res.status(201).json({success: true, message: 'Course Added'})

    }catch(error){
        res.status(400).json({success: false, message: error.message})
    }
}

const getEducatorCourse = async (req,res)=>{
    try{
        const educator = req.userId
        const courses = await Course.find({educator: educator})
        return res.status(200).json({success: true, courses})
    }catch(error){
        return res.status(500).json({success: false, message: error.message})
    }
}

// Get Educator Dashboard data

const educatorDashboardData = async (req,res)=>{
    try{ 

        const educator = req.userId
        const courses = await Course.find({educator: educator})
        const totalCourses = courses.length
        const courseIds = courses.map((course)=> course._id)
        const purchases = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        })

        const totalEarnings = purchases.reduce((sum,purchase)=> sum + purchase.amount, 0)
 
        const enrolledStudentData = []
        for(const course of courses){
            const students = await User.find({
                _id: {$in: course.enrolledStudents}
            }, 'name imageUrl')

            students.forEach((student)=>{
                enrolledStudentData.push({
                    courseTitle: course.courseTitle,
                    student
                })
            })
        }

        return res.status(200).json({success: true, dashboardData:{totalEarnings, enrolledStudentData, totalCourses}})

    }catch(error){
        return res.status(500).json({success: false, message: error.message})
    }
}


const getEnrolledStudentsData = async (req,res)=>{
    try{    

        const educator = req.userId
        const courses = await Course.find({educator:educator})
        const courseIds = courses.map((course)=> course._id)
        const purchases = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')

        const enrolledStudents = purchases.map((purchase)=>({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }))
        return res.status(200).json({success: true, enrolledStudents})

    }catch(error){
        return res.status(500).json({success: true, message: error.message})
    }
}

module.exports = {
    updateRoleToEducator,addCourse,
    roleToEducator,getEducatorCourse,
    educatorDashboardData,getEnrolledStudentsData
}