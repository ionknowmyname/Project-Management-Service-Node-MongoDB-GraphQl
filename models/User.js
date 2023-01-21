const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: { 
            type: String,
            required: true,
        }, 
        password: { 
            type: String, 
            required: true,
            select: false ,
        },
        email: { 
            type: String, 
            required: true,
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please Enter a valid email",
            ], 
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;