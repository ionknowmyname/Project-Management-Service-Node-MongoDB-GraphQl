const { GraphQLSchema, GraphQLObjectType } = require("graphql")


// Import queries
const { getAllUsers } = require("./queries")

// Import mutations
const { registerUser, loginUser } = require("./mutations")

// Define QueryType
const QueryType = new GraphQLObjectType({
    name: "QueryType",
    description: "Queries",
    fields: { getAllUsers },
})

// Define MutationType
const MutationType = new GraphQLObjectType({
    name: "MutationType",
    description: "Mutations",
    fields: { registerUser, loginUser },
})


module.exports = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
})