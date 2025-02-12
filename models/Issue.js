// IssueSchema.js
const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');
const IssueSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    project: {
        //type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: "Project",
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ["To Do", "In Progress", "Done"],
        default: "To Do"
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Critical"],
        default: "Medium"
    },
    issueType: {
        type: String,
        enum: ["Story", "Bug", "Task", "Subtask"],
        required: true
    },
    assignee: {
        //type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: "User"
    },
    comments: [{
        //type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: "Comment"
    }],
    attachments: [{
        //type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: "Attachment"
    }]
},{ timestamps: true });

module.exports = mongoose.model("Issue", IssueSchema);