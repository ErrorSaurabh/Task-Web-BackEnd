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
    }
}, { timestamps: true });

module.exports = mongoose.model("Project", ProjectSchema);


// const mongoose = require("mongoose");
// const { v4: uuidv4 } = require('uuid');
// const ProjectSchema = new mongoose.Schema({
//     _id: {
//         type: String,
//         default: uuidv4
//     },
//     name: {
//         type: String,
//         required: true
//     },
//     key: {
//         type: String,
//         required: true,
//     },
//     description: {
//         type: String
//     },
//     lead: {
//         type: String,
//         ref: "User",
//     },
//     members: [{
//         type: String,
//         ref: "User"
//     }],
//     category: { 
//         type: String,
//         enum: ["To Do", "In Progress", "Code Review", "Done"],
//         default: "To Do"
//     },
//     status: {
//         type: String,
//         enum: ['active', 'pending', 'completed'], 
//         default: 'active'
//     }
// },{ timestamps: true });

// module.exports = mongoose.model("Project", ProjectSchema);