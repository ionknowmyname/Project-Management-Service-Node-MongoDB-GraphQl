const { GraphQLString } = require("graphql")
const {  } = require("./types")
const { User, Task, Project } = require("../models")

const { createJwtToken } = require("../config/generateToken")

const registerUser = {
    type: GraphQLString,  // returns back a string after creating user
    args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    },
    async resolve(parent, args) {
        const { username, email, password } = args
        const user = new User({ username, email, password })

        await user.save()
        const token = createJwtToken(user)

        return token
        // return JSON.stringify(token)  // no need to json stringify coz createjwtToken is returning string
        // later this should be for logging in, creating user should return user created
    }
}

module.exports = { registerUser }