const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');
const UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    name: {
        type: String,
        required: true,
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
        enum: ["Admin", "Developer", "Manager", "Lead", "User"],
        default: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("User", UserSchema);