const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDb = require('./database/db')
const { clerkWebhooks,stripeWebhook } = require('./Contollers/webhooks')
const educatorRouter = require('./Router/educatorRouter')
const authRouter = require('./Router/authRouter')
const courseRouter = require('./Router/courseRouter')
const { clerkMiddleware  } = require('@clerk/express')
const connectCloudinary = require('./Config/cloudinary')
const { logger } = require('./middleware/logger')
const cookieParser = require('cookie-parser')
 
dotenv.config()

const app = express()
const PORT = process.env.PORT
// database
connectDb()

// cloudinary
connectCloudinary()

app.use(cors({origin: "http://localhost:5173", credentials: true}))
app.use(clerkMiddleware())
app.use(cookieParser())
app.use(logger)


app.post('/clerk', express.json(), clerkWebhooks)
app.use('/api/educator',express.json(), educatorRouter)
app.use('/api/user', express.json(), authRouter)
app.use('/api/course', express.json(), courseRouter)
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhook)

app.get('/', (req,res)=>{
    res.send('Api Working')
})

app.listen(PORT, ()=>{
    console.log(`Server listening to port ${PORT}`)
})