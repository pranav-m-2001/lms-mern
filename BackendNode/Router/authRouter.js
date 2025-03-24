const express = require('express')
const { loginUser,registerUser,logout,getUserData,enrolledCourses,purchaseCourse } = require('../Contollers/userController')
const { verifyToken } = require('../middleware/authMiddleware')

const authRouter = express.Router()


authRouter.post('/login', loginUser)
authRouter.post('/signup', registerUser)
authRouter.post('/logout', verifyToken, logout)
authRouter.get('/data', verifyToken, getUserData)
authRouter.get('/enrolled-courses', verifyToken, enrolledCourses)
authRouter.post('/purchase', verifyToken, purchaseCourse)

module.exports = authRouter