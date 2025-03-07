const { clerkClient } = require('@clerk/express')

const updateRoleToEducator = async (req,res)=>{
    try{

        const userId = req.auth.userId
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata:{
                role: 'educator'
            }
        })
        res.status(200).json({success: true, message: 'You can publish a course now'})

    }catch(error){
        res.status(400).json({success: false, message: error.message})
    }
}

module.exports = {
    updateRoleToEducator
}