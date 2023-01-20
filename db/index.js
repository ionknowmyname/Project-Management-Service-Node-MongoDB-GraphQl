const mongoose = require("mongoose")

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.DATABASE)
    // mongoose.set('strictQuery', true)
    console.log("MongoDB connection success")
}

module.exports = { connectDB }
