const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const CommentSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    content: {
        type: String,
        required: true
    },
    author: {
        //type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: 'User',
        required: true,
    },
    issue: {
        //type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: 'Issue',
        required: true,
    }
},{ timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
