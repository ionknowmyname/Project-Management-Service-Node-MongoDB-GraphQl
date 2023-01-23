const { GraphQLString, GraphQLBoolean, GraphQLID } = require("graphql")
const { ProjectType, UserType, TaskType } = require("./types")
const { User, Task, Project } = require("../models")

const { createJwtToken } = require("../config/generateToken")

const registerUser = {
    type: UserType,  // returns back a string after creating user
    description: 'Creates a new User',
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
    type: GraphQLString,  // returns back a string after logging user in
    description: 'Login an existing User',
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
    description: 'Create a new Project',
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
    description: 'Create a new Task',  
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

       // verify project exists
       let foundProject = Project.findOne({ _id: args.projectId})
       if(!foundProject) {
            throw new Error("Project with id not found")
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

const updateProjectStatusById = {
    type: ProjectType,  
    description: 'Update Status of Project', 
    args: {
        id: { type: GraphQLString },   // changed from GraphQLID to string so we can use findOneAndUpdate instead of findByIdAndUpdate
        isDone: { type: GraphQLBoolean },
    },
    async resolve(parent, args, { verifiedUser }) {
        console.log("Verified user from updateProjectStatusById --> ", verifiedUser)

       if(!verifiedUser) {
            throw new Error("Unauthorized")
       }

       // make sure project has no tasks that are undone before setting project to done
       let unfinishedTasks = Task.find({ projectId: args.id, isDone: false })

       if(unfinishedTasks && args.isDone == true){
            throw new Error("Project contains unfinished Tasks, cannot set Project status to Done")
       }

       let updatedProject = await Project.findOneAndUpdate({ _id: args.id, projectOwnerId: verifiedUser._id }, 
            { isDone: args.isDone }, { new: true, runValidators: true })  // run validators in project schema
       // this makes sure only owner of project can update project status

       if(!updatedProject) {
            throw new Error("Error while updating Project status. Current User is not Project Owner")
        }       

       return updatedProject
    }
}

const deleteProjectById = {
    type: GraphQLString, 
    description: 'Delete project by projectId',  
    args: {
        id: { type: GraphQLString },   
    },
    async resolve(parent, args, { verifiedUser }) {
        console.log("Verified user from deleteProjectById --> ", verifiedUser)

       if(!verifiedUser) {
            throw new Error("Unauthorized")
       }

       // make sure project has no tasks that are undone before setting project to done
       let unfinishedTasks = Task.find({ projectId: args.id, isDone: false })

       if(unfinishedTasks && args.isDone == true){
            throw new Error("Project contains unfinished Tasks, cannot delete Project")
       }

       let deletedProject = await Project.findOneAndDelete({ _id: args.id, projectOwnerId: verifiedUser._id }) 
       // this makes sure only owner of project can delete project

       if(!deletedProject) {
            throw new Error("Error while deleting Project. Current User is not Project Owner")
        }       

       return "Project Deleted Successfully"
    }
}

const updateTaskStatusById = {
    type: TaskType,  
    description: 'Update Status of Project', 
    args: {
        taskId: { type: GraphQLString },   // changed from GraphQLID to string so we can use findOneAndUpdate instead of findByIdAndUpdate
        isDone: { type: GraphQLBoolean },
    },
    async resolve(parent, args, { verifiedUser }) {
        console.log("Verified user from updateProjectStatusById --> ", verifiedUser)

       if(!verifiedUser) {
            throw new Error("Unauthorized")
       }

       // both project owner of which the task belongs to, and task owner can update task

       let foundTask = await Task.findOne({ _id: args.taskId })
       if(!foundTask) {
            throw new Error("Task with id not found")
       }
       let foundProject = await Project.findOne({ _id: foundTask.projectId })  // once task exist, there'd always be a valid project
       const projectOwnerId = foundProject.projectOwnerId;

       let updatedTask
       if(projectOwnerId == verifiedUser._id) {  // current user is the project owner
            updatedTask  = await Task.findOneAndUpdate({ _id: args.taskId }, 
                { isDone: args.isDone }, { new: true, runValidators: true })
       }

        updatedTask = await Task.findOneAndUpdate({ _id: args.taskId, taskOwnerId: verifiedUser._id }, 
            { isDone: args.isDone }, { new: true, runValidators: true })  // run validators in project schema
       // this makes sure only owner of Task can update task status

       if(!updatedTask) {
            throw new Error("Error while updating Task status. Current User is not Project/Task Owner")
        }       

       return updatedTask
    }
}

module.exports = { registerUser, loginUser, createProject, createTask, updateProjectStatusById, deleteProjectById, updateTaskStatusById }