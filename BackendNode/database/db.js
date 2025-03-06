const mongoose = require('mongoose')

async function connectDb(){
    try{

        await mongoose.connect(process.env.MONGODB_URL)
        console.log('Mongo DB connected succesfully')

    }catch(error){
        console.error(`Databse connection failed ${error}`)
        process.exit(1)
    }
}

module.exports = connectDb