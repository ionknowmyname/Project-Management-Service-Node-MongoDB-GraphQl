const express = require("express")
const dotenv = require("dotenv")
const { graphqlHTTP } = require("express-graphql")
const { connectDB } = require("./db")
const schema = require("./graphql/schema")

const { createJwtToken } = require("./config/generateToken")
const { authenticate } = require("./config/authentication")



const app = express()

dotenv.config()

connectDB()

app.use(authenticate)


app.get("/", (req, res) => {
    console.log(req.verifiedUser);
    res.json({ msg: "Tested & Trusted "})
})

app.get("/authtest", (req, res) => {
    res.json({ 
        jwt: createJwtToken({
            username: "Faithful",
            email: "test@testing.com"
        }) 
    })
})

app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true,
}))



const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})