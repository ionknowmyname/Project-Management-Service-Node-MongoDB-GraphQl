const { GraphQLList, GraphQLID } = require("graphql")
const { UserType } = require("./types")
const { User } = require("../models")

const getAllUsers = {
    type: new GraphQLList(UserType),
    description: 'Get List of all Users',
    resolve(parent, args) {
        return User.find()   // would return all users
    }
}

const getUserById = {
    type: UserType,
    description: 'Get User by userId',
    args: {
        id: { type: GraphQLID },
    },
    resolve(parent, args) {

        return User.findById(args.id)
    }
}

module.exports = { getAllUsers, getUserById }