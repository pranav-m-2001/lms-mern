const express = require('express')
const { updateRoleToEducator,addCourse,roleToEducator,getEducatorCourse,educatorDashboardData,getEnrolledStudentsData } = require('../Contollers/EducatorContoller')
const { protectEducator } = require('../middleware/protectEducator')
const  upload = require('../Config/multer')
const { verifyToken } = require('../middleware/authMiddleware')

const educatorRouter = express.Router()

educatorRouter.get('/update-role',verifyToken, roleToEducator)
educatorRouter.post('/add-course',verifyToken, upload.single('image'),protectEducator, addCourse)
educatorRouter.get('/courses', verifyToken, protectEducator, getEducatorCourse)
educatorRouter.get('/dashboard', verifyToken, protectEducator, educatorDashboardData)
educatorRouter.get('/enrolled-students', verifyToken, protectEducator, educatorDashboardData)


module.exports = educatorRouter