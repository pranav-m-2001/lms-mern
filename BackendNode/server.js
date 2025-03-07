const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDb = require('./database/db')
const { clerkWebhooks } = require('./Contollers/webhooks')
const educatorRouter = require('./Router/educatorRouter')
dotenv.config()

const app = express()
const PORT = process.env.PORT
connectDb()

app.use(cors())
app.get('/', (req,res)=>{
    return res.status(200).send('Api Working')
})

app.post('/clerk', express.json(), clerkWebhooks)
app.use('/educator', educatorRouter)

app.listen(PORT, ()=>{
    console.log(`Server listening to port ${PORT}`)
})