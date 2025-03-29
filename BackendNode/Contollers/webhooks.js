const { Webhook } = require('svix')
const User = require('../Models/User')
const { Stripe } = require('stripe')
const Purchase = require('../Models/Purchase')
const Course = require('../Models/Course')


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



const stripeWebhook = async (request,response)=>{

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
    const sig = request.headers['stripe-signature'];

    let event;
          
    try {
        event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        }
    catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        }

        switch (event.type) {
            case 'payment_intent.succeeded':{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            })
            const { purchaseId } = session.data[0].metadata
            const purchaseData = await Purchase.findById(purchaseId)
            const userData = await User.findById(purchaseData.userId)
            const courseData = await Course.findById(purchaseData.courseId)

            courseData.enrolledStudents.push(userData)
            await courseData.save()

            userData.enrolledCourses.push(courseData._id)
            await userData.save()

            purchaseData.status = 'completed'
            await purchaseData.save()

              break };
            case 'payment_method.payment_failed':{
              const paymentIntent = event.data.object;
              const paymentIntentId = paymentIntent.id
  
              const session = await stripeInstance.checkout.sessions.list({
                  payment_intent: paymentIntentId
              })

              const { purchaseId } = session.data[0].metadata
              const purchaseData = await Purchase.findById(purchaseId)
              purchaseData.status = 'failed'
              await purchaseData.save() 
              
              break };
            // ... handle other event types
            default:
              console.log(`Unhandled event type ${event.type}`);
          }
        
          // Return a response to acknowledge receipt of the event
          response.json({received: true});
}

module.exports = {
    clerkWebhooks,
    stripeWebhook,
}