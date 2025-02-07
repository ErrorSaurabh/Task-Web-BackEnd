const Comment = require('../models/Comment');
const User = require('../models/User');
const Issue = require('../models/Issue');

const createComment = async (req, res) => {
    try {
        const {
            content,
            author,
            issue
        } = req.body;

        // 1.  Validate author is existing user
        const isAuthorValid = await User.findById(author);
        if (!isAuthorValid || !["Admin", "Developer", "Manager"].includes(isAuthorValid.role)) {
            return res.json({
                msg: "Invalid author"
            });
        }

        // 2.  Validate issue id is valid
        const isIssueValid = await Issue.findById(issue);
        if (!isIssueValid) {
            return res.json({
                msg: "Invalid issue"
            });
        }

        const comment = new Comment({
            content,
            author,
            issue
        });
        await comment.save();
        res.json({
            msg: "Comment created"
        });
    } catch (err) {
        console.error(err);
        res.json({
            msg: "Error creating comment"
        });
    }
};

const getComments = async (req, res) => {
    try {
        const comments = await Comment.find().populate('author', 'name email'); // Populate author details
        res.json(comments);
    } catch (err) {
        console.error(err);
        res.json({
            msg: "Error fetching comments"
        });
    }
};

const getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params._id).populate('author', 'name email');
        if (comment) {
            res.json(comment);
        } else {
            return res.json({
                msg: "Comment not found"
            });
        }
    } catch (err) {
        console.error(err);
        res.json({
            msg: "Error fetching comment"
        });
    }
};

const updateComment = async (req, res) => {
    try {
        const {
            content,
            author,
            issue
        } = req.body;

        // 1.  Validate author is existing user
        const isAuthorValid = await User.findById(author);
        if (!isAuthorValid || !["Admin", "Developer", "Manager"].includes(isAuthorValid.role)) {
            return res.json({
                msg: "Invalid author"
            });
        }

        // 2.  Validate issue id is valid
        const isIssueValid = await Issue.findById(issue);
        if (!isIssueValid) {
            return res.json({
                msg: "Invalid issue"
            });
        }

        const comment = await Comment.findByIdAndUpdate(req.params._id, {
            content,
            author,
            issue
        }, {
            new: true
        });
        if (comment) {
            res.json({
                msg: "Comment updated"
            });
        } else {
            return res.json({
                msg: "Comment not found"
            });
        }
    } catch (err) {
        console.error(err);
        res.json({
            msg: "Error updating comment"
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params._id);
        if (comment) {
            res.json({
                msg: "Comment deleted"
            });
        } else {
            return res.json({
                msg: "Comment not found"
            });
        }
    } catch (err) {
        console.error(err);
        res.json({
            msg: "Error deleting comment"
        });
    }
};

module.exports = { createComment, getComments, getCommentById, updateComment, deleteComment };