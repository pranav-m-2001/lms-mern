const jwt = require('jsonwebtoken')

const verifyToken = async (req,res,next)=>{
    try{

        const token = req.cookies.token
        if(!token){
            return res.status(401).json({success: false, message: 'Unauthorized'})
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.userId = decode.userId
        next()

    }catch(error){
        return res.status(401).json({success: false, message: error.message})
    }
}

module.exports = {
    verifyToken
}