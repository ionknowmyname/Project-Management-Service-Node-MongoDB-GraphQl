const express = require("express")
const dotenv = require("dotenv")
const { graphqlHTTP } = require("express-graphql")
const { connectDB } = require("./db")
const schema = require("./graphql/schema")


const app = express()

dotenv.config()

connectDB()


app.get("/", (req, res) => {
    res.json({ msg: "Tested & Trusted "})
})

app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true,
}))



const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})