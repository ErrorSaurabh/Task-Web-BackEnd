const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const ProjectSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    name: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    lead: {
        type: String,
        ref: "User",
    },
    members: [{
        type: String,
        ref: "User"
    }],
    category: {
        type: String,
        enum: ["To Do", "In Progress", "Code Review", "Done"],
        default: "To Do"
    },
   status: {
        type: String,
        enum: ['active', 'pending', 'completed'],
        default: 'active'
    },
    todoDate: {
        type: Date
    },
    inProgressDate: {
        type: Date
    },
    codeReviewDate: {
        type: Date
    },
    pendingDate:{
        type:Date
    },
    doneDate: {
        type: Date
    },
    tasks: [{ 
        name: { 
            type: String,
            enum: ["frontend", "backend", "database", "testing"],
            default: "frontend"
        },
        status: { 
            type: String,
            enum: ["To Do", "In Progress", "Code Review", "Done"], 
            default: "To Do"
        },
        assignedTo: { 
             type: String,
             ref: "User", 
        },
        startDate:{
            type:Date,
        },
         endDate:{
            type:Date,
        },
    }],
    comments: [{
        _id: {
            type: String,
            default: uuidv4
        },
        text: {
            type: String,
        },
        user: {
            type: String,  // Assuming you want to store the user's ID
            ref: "User"
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
}, { timestamps: true });

module.exports = mongoose.model("Project", ProjectSchema);
