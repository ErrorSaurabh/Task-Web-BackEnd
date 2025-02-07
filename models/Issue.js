const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    summary: {
        type: String,
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
        type: mongoose.Schema.Types.ObjectId,
        enum:["Admin", "Developer", "Manager"],
        ref: "User"
    },
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        enum:["Admin", "Developer", "Manager"],
        ref: "User",
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    attachments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attachment"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("Issue", IssueSchema);