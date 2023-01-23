const { GraphQLList, GraphQLID, GraphQLString } = require("graphql")
const { UserType, ProjectType, TaskType } = require("./types")
const { User, Project, Task } = require("../models")

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

const getAllProjects = {
    type: new GraphQLList(ProjectType),
    description: 'Get List of all Projects',
    resolve() {
        return Project.find()   
    }
}

const getProjectById = {
    type: ProjectType,
    description: 'Get Project by projectId',
    args: {
        id: { type: GraphQLID },
    },
    resolve(parent, args) {

        return Project.findById(args.id)
    }
}

const getProjectByTitle = {
    type: ProjectType,
    description: 'Get a Project by Project title',
    args: {
        title: { type: GraphQLString },
    },
    resolve(_, args) {
        return Project.findOne({ title: args.title })  
    }
}

const getAllTasksByProjectTitle = {
    type: new GraphQLList(TaskType),
    description: 'Get List of all Tasks using Project Title',
    args: {
        title: { type: GraphQLString },
    },
    resolve(_, args) {
        return Project.find({ title: args.title })  
    }
}

const getAllTasksByProjectId = {
    type: new GraphQLList(TaskType),
    description: 'Get List of all Tasks using projectId',
    args: {
        id: { type: GraphQLString },
    },
    resolve(_, args) {
        return Task.find({ projectId: args.id })  
    }
}

const getTaskById = {
    type: ProjectType,
    description: 'Get Task by taskId',
    args: {
        id: { type: GraphQLID },
    },
    resolve(parent, args) {

        return Task.findById(args.id)
    }
}

const getTaskByTitle = {
    type: ProjectType,
    description: 'Get a Task by Task title',
    args: {
        title: { type: GraphQLString },
    },
    resolve(_, args) {
        return Task.findOne({ title: args.title })  
    }
}

module.exports = { 
    getAllUsers, getUserById, getAllProjects, getProjectById, getProjectByTitle, 
    getAllTasksByProjectTitle, getAllTasksByProjectId, getTaskById, getTaskByTitle 
}