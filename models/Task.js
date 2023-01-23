const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
    {
        taskOwnerId: { 
            type: String,
            required: true,
        }, 
        projectId: { 
            type: String,
            required: false,
        },
        title: { 
            type: String, 
            required: true,
            unique: true,
        },
        description: { 
            type: String, 
            required: true,
        },
        isDone: { 
            type: Boolean, 
            default: false,
        },
    },
    { timestamps: true }
);

const Task = mongoose.model("task", taskSchema);
module.exports = Task;