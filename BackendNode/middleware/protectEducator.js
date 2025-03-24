const User = require('../Models/User')

const protectEducator = async (req,res,next)=>{
    try{

        const userId = req.userId
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({success: false, message: 'User not found'})
        }else if(user.role !== 'educator'){
            return res.status(401).json({success: false, message: 'Unauthorized'})
        }else{
            next()
        }

    }catch(error){
        return res.status(401).json({success: false, message: erroe.message})
    }
}

module.exports ={
    protectEducator,
}