const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');
const UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Developer", "Manager"],
        default: "Developer"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
},{ timestamps: true });

module.exports = mongoose.model("User", UserSchema);