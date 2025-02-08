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
        //type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: "User",
    },
    members: [{
        //type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: "User"
    }]
});

module.exports = mongoose.model("Project", ProjectSchema);