const Attachment = require('../models/Attachment');
const User = require('../models/User'); 
const Issue = require('../models/Issue');

const createAttachment = async (req, res) => {
    try {
        const { filename, filePath, uploadedBy, issue } = req.body;

        // Validate uploadedBy user and their role
        const uploader = await User.findById(uploadedBy);
        if (!uploader || !["Admin", "Developer", "Manager"].includes(uploader.role)) {
            return res.json({ msg: "Invalid uploader" });
        }

        // Validate issue exists
        const isIssueValid = await Issue.findById(issue);
        if (!isIssueValid) {
            return res.json({ msg: "Invalid issue" });
        }

        const attachment = new Attachment({ filename, filePath, uploadedBy, issue });
        await attachment.save();
        res.json({ msg: "Attachment created" });
    } catch (err) {
        console.error(err);
        res.json({ msg: "Error creating attachment" });
    }
};

const getAttachment = async (req, res) => {
    try {
        const attachments = await Attachment.find().populate('uploadedBy', 'name email'); 
        res.json(attachments);
    } catch (err) {
        console.error(err);
        res.json({ msg: "Error fetching attachments" });
    }
};

const getAttachmentById = async (req, res) => {
    try {
        const attachment = await Attachment.findById(req.params._id).populate('uploadedBy', 'name email');
        if (attachment) {
            res.json(attachment);
        } else {
            return res.json({ msg: "Attachment not found" });
        }
    } catch (err) {
        console.error(err);
        res.json({ msg: "Error fetching attachment" });
    }
};

const updateAttachment = async (req, res) => {
    try {
        const { filename, filePath, uploadedBy, issue } = req.body;

        // Validate uploadedBy user and their role
        const uploader = await User.findById(uploadedBy);
        if (!uploader || !["Admin", "Developer", "Manager"].includes(uploader.role)) {
            return res.json({ msg: "Invalid uploader" });
        }

        // Validate issue exists
        const isIssueValid = await Issue.findById(issue);
        if (!isIssueValid) {
            return res.json({ msg: "Invalid issue" });
        }
        const attachment = await Attachment.findByIdAndUpdate(req.params._id, { filename, filePath, uploadedBy, issue }, { new: true });
        if (attachment) {
            res.json({ msg: "Attachment updated" });
        } else {
            return res.json({ msg: "Attachment not found" });
        }
    } catch (err) {
        console.error(err);
        res.json({ msg: "Error updating attachment" });
    }
};

const deleteAttachment = async (req, res) => {
    try {
        const attachment = await Attachment.findByIdAndDelete(req.params._id);
        if (attachment) {
            res.json({ msg: "Attachment deleted" });
        } else {
            return res.json({ msg: "Attachment not found" });
        }
    } catch (err) {
        console.error(err);
        res.json({ msg: "Error deleting attachment" });
    }
};

module.exports = { createAttachment, getAttachment, getAttachmentById, updateAttachment, deleteAttachment };
