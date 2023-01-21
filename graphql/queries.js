const { GraphQLList } = require("graphql")
const { UserType } = require("./types")
const { User } = require("../models")

const getAllUsers = {
    type: new GraphQLList(UserType),
    resolve(parent, args) {
        return User.find()   // would return all users
    }
}

module.exports = { getAllUsers }