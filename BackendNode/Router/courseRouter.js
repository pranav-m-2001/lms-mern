const express = require('express')
const { getAllCourses,getCourseId } = require('../Contollers/courseController')

const courseRouter = express.Router()

courseRouter.get('/all', getAllCourses)
courseRouter.get('/:id', getCourseId)


module.exports = courseRouter

