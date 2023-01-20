const express = require("express")
const dotenv = require("dotenv")
const { connectDB } = require("./db")


const app = express()

dotenv.config()

connectDB()


app.use(express.json());
app.use(express.urlencoded({ extended: true }))



const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})