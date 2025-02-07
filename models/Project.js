const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
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
        //type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: "User",
    },
    members: [{
        //type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: "User"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("Project", ProjectSchema);