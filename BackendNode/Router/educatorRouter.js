const express = require('express')
const { updateRoleToEducator } = require('../Contollers/EducatorContoller')

const educatorRouter = express.Router()

educatorRouter.get('/update-role', updateRoleToEducator)

module.exports = educatorRouter