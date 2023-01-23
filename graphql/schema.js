const { GraphQLSchema, GraphQLObjectType } = require("graphql")


// Import queries
const { getAllUsers, getUserById, getAllProjects, getProjectById, getProjectByTitle } = require("./queries")

// Import mutations
const { registerUser, loginUser, createProject, createTask } = require("./mutations")

// Define QueryType
const QueryType = new GraphQLObjectType({
    name: "QueryType",
    description: "Queries",
    fields: { getAllUsers, getUserById, getAllProjects, getProjectById, getProjectByTitle },
})

// Define MutationType
const MutationType = new GraphQLObjectType({
    name: "MutationType",
    description: "Mutations",
    fields: { registerUser, loginUser, createProject, createTask },
})


module.exports = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
})