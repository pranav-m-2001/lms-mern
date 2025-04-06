const express = require('express')
const { loginUser,registerUser,logout,getUserData,enrolledCourses,purchaseCourse,updateUserCourseProgress,getUserProgressData,addUserRatings,checkAuth } = require('../Contollers/userController')
const { verifyToken } = require('../middleware/authMiddleware')

const authRouter = express.Router()


authRouter.post('/login', loginUser)
authRouter.post('/signup', registerUser)
authRouter.post('/logout', verifyToken, logout)
authRouter.get('/data', verifyToken, getUserData)
authRouter.get('/enrolled-courses', verifyToken, enrolledCourses)
authRouter.post('/purchase', verifyToken, purchaseCourse)
authRouter.post('/update-course-progress', verifyToken, updateUserCourseProgress)
authRouter.post('/get-course-progress', verifyToken, getUserProgressData)
authRouter.post('/add-rating', verifyToken, addUserRatings)
authRouter.get('/check-auth', verifyToken, checkAuth)

module.exports = authRouter