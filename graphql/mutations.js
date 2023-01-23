const { GraphQLString } = require("graphql")
const { ProjectType, UserType, TaskType } = require("./types")
const { User, Task, Project } = require("../models")

const { createJwtToken } = require("../config/generateToken")

const registerUser = {
    type: UserType,  // returns back a string after creating user
    args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    },
    async resolve(parent, args) {
        const { username, email, password } = args
        const user = new User({ username, email, password })

        const savedUser = await user.save()

        return savedUser    
    }
}

const loginUser = {
    type: GraphQLString,  // returns back a string after creating user
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    },
    async resolve(parent, args) {
        const user = await User.findOne({ email: args.email }).select("+password")
        // add password back so we can use it to match
        console.log("User from loginUser --> ", user)

        if(!user || args.password !== user.password) {
            throw new Error("Invalid Credentials")
        }
        
        const token = createJwtToken(user)

        return token
        // return JSON.stringify(token)  // no need to json stringify coz createjwtToken is returning string
    }
}

const createProject = {
    type: ProjectType,  
    args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
    },
    resolve(parent, args, { verifiedUser }) {
        console.log("Verified user from createProject --> ", verifiedUser)

       if(!verifiedUser) {
            throw new Error("Unauthorized")
       }

       const project = new Project({
            projectOwnerId: verifiedUser._id,
            title: args.title,
            description: args.description
       })

       return project.save()
    }
}

const createTask = {
    type: TaskType,  
    args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        projectId: { type: GraphQLString },
    },
    resolve(_, args, { verifiedUser }) {
        console.log("Verified user from createTask --> ", verifiedUser)

       if(!verifiedUser) {
            throw new Error("Unauthorized")
       }

       const task = new Task({
            taskOwnerId: verifiedUser._id,
            title: args.title,
            description: args.description,
            projectId: args.projectId
       })

       return task.save()
    }
}

module.exports = { registerUser, loginUser, createProject, createTask }