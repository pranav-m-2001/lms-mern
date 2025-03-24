const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name : {type: String, required: true},
    email : {type: String, required: true},
    password: {type: String, required: true},
    imageUrl : {type: String, required: false},
    role: {type: String, reuired: true, default: 'student'},
    enrolledCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ],
    lastLogin: {type: Date, default: Date.now},
}, {timestamps: true})

module.exports = mongoose.model('User', UserSchema)