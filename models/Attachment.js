const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const AttachmentSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    filename: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    uploadedBy: {
        //type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: 'User',
        required: true
    },
    issue: {
        //type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: 'Issue',
        required: true
    }
},{ timestamps: true });

module.exports = mongoose.model('Attachment', AttachmentSchema);

// const mongoose = require('mongoose');

// const AttachmentSchema = new mongoose.Schema({
//     originalName: {
//         type: String,
//         required: true
//     },
//     filename: { 
//         type: String,
//         required: true,
//         unique: true 
//     },
//     filePath: {
//         type: String,
//         required: true
//     },
//     fileType: { 
//         type: String,
//         required: true
//     },
//     fileSize: {
//         type: Number,
//         required: true
//     },
//     uploadedBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//         index: true
//     },
//     issue: { 
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Issue',
//         required: true,
//         index: true
//     }
// }, {
//     timestamps: true,
// });


// module.exports = mongoose.model('Attachment', AttachmentSchema);
