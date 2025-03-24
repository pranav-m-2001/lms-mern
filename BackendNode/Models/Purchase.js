const mongoose = require('mongoose')

const purchaseSchema = new mongoose.Schema({
    courseId : {type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true},
    userId : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    amount: {type: Number, required: true},
    status: {type: String, enum: ['pending', 'completed', 'failed'], default: 'pending'},

}, {timestamps: true})

module.exports = mongoose.model('Purchase', purchaseSchema)