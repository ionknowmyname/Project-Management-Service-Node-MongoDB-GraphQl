const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLID } = require("graphql")
const { User, Task, Project } = require("../models")

const UserType = new GraphQLObjectType({
    name: "User",
    description: "User type",
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        // no password coz not being returned in User model // select is false
    })
})

const ProjectType = new GraphQLObjectType({
    name: "Project",
    description: "Project type",
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        isDone: { type: GraphQLBoolean },
        projectOwner: { 
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.projectOwnerId)
            } 
        },
        tasks: {
            type: GraphQLList(TaskType),
            resolve(parent, args) {
                return Task.find({ projectId: parent.id })
                // find all tasks where projectId = this project id
            }
        }
    })
})

const TaskType = new GraphQLObjectType({
    name: "Task",
    description: "Task type",
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        isDone: { type: GraphQLBoolean },
        taskOwner: { 
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.taskOwnerId)
            } 
        },
        project: { 
            type: ProjectType,
            resolve(parent, args) {
                return Project.findById(parent.projectId)
            }
        },
    })
})

module.exports = { UserType, ProjectType, TaskType }