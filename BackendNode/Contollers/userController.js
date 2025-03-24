const bcrypt = require('bcrypt')
const User = require('../Models/User')
const { generteTokenAndSetCookies } = require('../utils/genTokenandSetCookies')
const Purchase = require('../Models/Purchase')
const { Stripe } = require('stripe')
const Course = require('../Models/Course')

const registerUser = async (req,res)=>{
    try{

        const { name,email,password } = req.body
        if(!name || !email || !password){
            return res.status(400).json({success: false, message: 'All fields required'})
        }

        const isUser = await User.findOne({email})
        if(isUser){
            return res.status(400).json({success: false, message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
        })
        await user.save()
        generteTokenAndSetCookies(res, user._id)
        return res.status(201).json({success: false, message: 'User created'})


    }catch(error){
        res.status(400).json({success: false, message: error.message})
    }
}

const loginUser = async (req,res)=>{
    try{

        const { email, password } = req.body
        if(!email || !password){
            return res.status(400).json({success: false, message: 'All fields required'})
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({success: false, message: 'User not found'})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({success: false, message: 'Password not matching'})
        }
        user.lastLogin = Date.now()
        await user.save()
        generteTokenAndSetCookies(res, user._id)
        return res.status(200).json({success: true, message: 'Login Success'})

    }catch(error){
        res.status(400).json({success: false, message: error.message})
    }
}

const logout = async (req,res)=>{
    try{
        res.clearCookie('token')
        return res.status(200).json({success: true, message: 'Logout Successfully'})
    }catch(error){
        return res.status(400).json({success: false, message: error.message})
    }
}

const getUserData = async (req,res)=>{
    try{

        const userId = req.userId
        const user = await User.findById(userId).select(['-password'])
        if(!user){
            return res.status(404).json({success: false, message :'User not found'})
        }
        return res.status(200).json({success: true, user})
    }catch(error){
        return res.status(500).json({success: false, message: error.message})
    }
}

const enrolledCourses = async (req,res)=>{
    try{

        const userId = req.userId
        const user = await User.findById(userId).populate('enrolledCourses')
        return res.status(200).json({success: true, enrolledCourses: user.enrolledCourses})
    }catch(error){
        return res.status(500).json({success: false, message: error.message})
    }
}

const purchaseCourse = async (req,res)=>{
    try{

        const { courseId } = req.body
        const { origin } = req.headers
        const userId = req.userId
        
        const userData = await User.findById(userId)
        const courseData = await Course.findById(courseId)

        if(!userData || !courseData){
            return res.status(404).json({success: false, message: 'Data not found'})
        }

        const purchaseData = {
            courseId: courseData._id,
            userId: userData._id,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)
        }

        const purchase = await Purchase.create(purchaseData)
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
        const currency = process.env.CURRENCY.toLowerCase()

        const line_items = [{
            price_data : {
                currency,
                product_data:{
                    name: courseData.courseTitle
                },
                unit_amount: Math.floor(purchase.amount) * 100,
            },
            quantity: 1,
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata:{
                purchaseId: purchase._id.toString()
            }
        })

        return res.status(200).json({success: true, session_url: session.url})

        
    }catch(error){
        return res.status(500).json({success: false, message: error.message})
    }
}
  

module.exports = {
    registerUser, loginUser,logout,
    getUserData,enrolledCourses,purchaseCourse,
}