const { GraphQLSchema, GraphQLObjectType } = require("graphql")


// Import queries
const { 
    getAllUsers, getUserById, getAllProjects, getProjectById, getProjectByTitle, 
    getAllTasksByProjectTitle, getAllTasksByProjectId, getTaskById, getTaskByTitle 
} = require("./queries")

// Import mutations
const { registerUser, loginUser, createProject, createTask } = require("./mutations")

// Define QueryType
const QueryType = new GraphQLObjectType({
    name: "QueryType",
    description: "Queries",
    fields: { getAllUsers, getUserById, getAllProjects, getProjectById, getProjectByTitle, 
        getAllTasksByProjectTitle, getAllTasksByProjectId, getTaskById, getTaskByTitle },
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