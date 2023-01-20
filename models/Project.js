const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema(
    {
        projectOwnerId: { 
            type: String,
            required: true,
        },
        title: { 
            type: String, 
            required: true,
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

const Project = mongoose.model("project", projectSchema);
module.exports = Project;