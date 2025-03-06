const { Webhook } = require('svix')
const User = require('../Models/User')


const clerkWebhooks = async (req,res)=>{
    try{

        const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        await webhook.verify(JSON.stringify(req.body),{
            "svix-id": req.headers['svix-id'],
            "svix-timestamp": req.headers['svix-timestamp'],
            "svix-signature": req.headers['svix-signature'],
        })

        const { data,type } = req.body

        switch (type) {
            case 'user.created':{
                const userData = {
                    _id : data.id,
                    email: data.email_address[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url
                }
                await User.create(userData)
                res.status(201).json({})
                break
            }

            case 'user.updated':{
                const userData = {
                    email: data.email_address[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url
                }
                await User.findByIdAndUpdate(data.id, userData)
                res.status(200).json({})
                break;
            }    
                
            case 'user.deleted':{
                await User.findByIdAndDelete(data.id)
                res.status(200).json({})
                break;
            }
            default:
                break;
        }

    }catch(error){
        res.status(400).json({success:false, message: error.message})
    }
}

module.exports = {
    clerkWebhooks
}