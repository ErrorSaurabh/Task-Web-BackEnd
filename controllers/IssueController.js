const Issue = require('../models/Issue');
const Project = require('../models/Project');
const User = require('../models/User');

const createIssue = async (req, res) => {
    try {
        const {
            project,
            assignee
        } = req.body;

        // 2. Validate Project exists
        const isProjectValid = await Project.findById(project);
        if (!isProjectValid) {
            return res.json({
                msg: "Invalid project"
            });
        }

        // 2. Validate Assignee exists and has allowed role (if present)
        if (assignee) {
            const assigneeUser = await User.findById(assignee);
            if (!assigneeUser || !["Admin", "Developer", "Manager"].includes(assigneeUser.role)) {
                return res.json({
                    msg: "Invalid assignee"
                });
            }
        }

        let issue = new Issue(req.body);
        await issue.save();
        res.json({
            msg: "Issue created"
        });
    } catch (err) {
        console.error(err);
        res.json({
            msg: "Error in issue creation"
        });
    }
};

const getIssues = async (req, res) => {
    try {
        let issues = await Issue.find().populate("project assignee");
        if (issues) {
            //res.json(issues);
            const simplifiedIssues = issues.map(issue => ({
                _id: issue._id,
                project: {
                    _id: issue.project ?._id,
                    name: issue.project ?.name,
                    description: issue.project ?.description,
                },
                assignee: issue.assignee ? {
                    _id: issue.assignee._id,
                    name: issue.assignee.name,
                    role: issue.assignee.role
                } : null,
                description: issue.description,
                status: issue.status,
                priority: issue.priority,
                issueType: issue.issueType,
                comments: issue.comments,
                attachments: issue.attachments,
            }));

            res.json(simplifiedIssues);
        } else {
            return res.json({
                msg: "Issue not found"
            });
        }
    } catch (err) {
        console.error(err);
        res.json({
            msg: "Error in fetching issues"
        });
    }
};

const getIssueById = async (req, res) => {
    try {
        let issue = await Issue.findById(req.params._id).populate("project assignee comments attachments");
        if (issue) {
            //res.json(issue);
            const simplifiedIssue = {
                _id: issue._id,
                project: issue.project ? {
                    _id: issue.project._id,
                    name: issue.project.name,
                    description: issue.project.description,
                } : {},
                assignee: issue.assignee ? {
                    _id: issue.assignee._id,
                    name: issue.assignee.name,
                    role: issue.assignee.role
                } : null,
                description: issue.description,
                status: issue.status,
                priority: issue.priority,
                issueType: issue.issueType,
                comments: issue.comments,
                attachments: issue.attachments,
            };

            res.json(simplifiedIssue);

        } else {
            return res.json({
                msg: "Issue not found"
            });
        }
    } catch (err) {
        console.error(err);
        res.json({
            msg: "Error in fetching issue"
        });
    }
};

// const updateIssue = async (req, res) => {
//     try {
//         const { project, assignee } = req.body;

//         // 1. Validate Project exists
//         const isProjectValid = await Project.findById(project);
//         if (!isProjectValid) {
//             return res.json({ msg: "Invalid project" });
//         }

//         // 2. Validate Assignee exists and has allowed role (if present)
//         if (assignee) {
//             const assigneeUser = await User.findById(assignee);
//             if (!assigneeUser || !["Admin", "Developer", "Manager"].includes(assigneeUser.role)) {
//                 return res.json({ msg: "Invalid assignee" });
//             }
//         }
//         let issue = await Issue.findByIdAndUpdate(req.params._id, req.body, { new: true });
//         if (issue) {
//             res.json({ msg: "Issue updated" });
//         } else {
//             res.json({ msg: "Issue not found" });
//         }

const updateIssue = async (req, res) => {
    try {
        let issue = await Issue.findById(req.params._id);
        if (!issue) {
            return res.json({
                msg: "Issue not found"
            });
        }

        const {
            description,
            status,
            priority,
            comments,
            attachments
        } = req.body;

        // Create an object with only the allowed fields
        const updateData = {
            description,
            status,
            priority,
            comments,
            attachments,
        };

        // Update the issue with only the allowed fields
        issue = await Issue.findByIdAndUpdate(req.params._id, updateData, {
            new: true
        });

        if (issue) {
            res.json({
                msg: "Issue updated"
            });
        } else {
            res.json({
                msg: "Issue not found"
            });
        }
    } catch (err) {
        console.error(err);
        res.json({
            msg: "Error in updating issue"
        });
    }
};


const deleteIssue = async (req, res) => {
    try {
        let issue = await Issue.findByIdAndDelete(req.params._id);
        if (issue) {
            res.json({
                msg: "Issue deleted"
            });
        } else {
            res.json({
                msg: "Issue not found"
            });
        }
    } catch (err) {
        console.error(err);
        res.json({
            msg: "Error in deleting issue"
        });
    }
};

module.exports = {
    createIssue,
    getIssues,
    getIssueById,
    updateIssue,
    deleteIssue
};