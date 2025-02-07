const Issue = require('../models/Issue');
const Project = require('../models/Project');
const User = require('../models/User');

const createIssue = async (req, res) => {
    try {
        const { project, reporter, assignee } = req.body;

        // 1. Validate Project exists
        const isProjectValid = await Project.findById(project);
        if (!isProjectValid) {
            return res.json({ msg: "Invalid project" });
        }

        // 2. Validate Reporter exists and has allowed role
        const reporterUser = await User.findById(reporter);
        if (!reporterUser || !["Admin", "Developer", "Manager"].includes(reporterUser.role)) {
            return res.json({ msg: "Invalid reporter" });
        }

        // 3. Validate Assignee exists and has allowed role (if present)
        if (assignee) {
            const assigneeUser = await User.findById(assignee);
            if (!assigneeUser || !["Admin", "Developer", "Manager"].includes(assigneeUser.role)) {
                return res.json({ msg: "Invalid assignee" });
            }
        }

        let issue = new Issue(req.body);
        await issue.save();
        res.json({ msg: "Issue created" });
    } catch (err) {
        console.error(err);
        res.json({ msg: "Error in issue creation" });
    }
};

const getIssues = async (req, res) => {
    try {
        let issues = await Issue.find().populate("project assignee reporter");
        res.json(issues);
    } catch (err) {
        console.error(err);
        res.json({ msg: "Error in fetching issues" });
    }
};

const getIssueById = async (req, res) => {
    try {
        let issue = await Issue.findById(req.params._id).populate("project assignee reporter comments attachments");
        if (issue) {
            res.json(issue);
        } else {
            return res.json({ msg: "Issue not found" });
        }
    } catch (err) {
        console.error(err);
        res.json({ msg: "Error in fetching issue" });
    }
};

const updateIssue = async (req, res) => {
    try {
        const { project, reporter, assignee } = req.body;

        // 1. Validate Project exists
        const isProjectValid = await Project.findById(project);
        if (!isProjectValid) {
            return res.json({ msg: "Invalid project" });
        }

        // 2. Validate Reporter exists and has allowed role
        const reporterUser = await User.findById(reporter);
        if (!reporterUser || !["Admin", "Developer", "Manager"].includes(reporterUser.role)) {
            return res.json({ msg: "Invalid reporter" });
        }

        // 3. Validate Assignee exists and has allowed role (if present)
        if (assignee) {
            const assigneeUser = await User.findById(assignee);
            if (!assigneeUser || !["Admin", "Developer", "Manager"].includes(assigneeUser.role)) {
                return res.json({ msg: "Invalid assignee" });
            }
        }
        let issue = await Issue.findByIdAndUpdate(req.params._id, req.body, { new: true });
        if (issue) {
            res.json({ msg: "Issue updated" });
        } else {
            res.json({ msg: "Issue not found" });
        }
    } catch (err) {
        console.error(err);
        res.json({ msg: "Error in updating issue" });
    }
};

const deleteIssue = async (req, res) => {
    try {
        let issue = await Issue.findByIdAndDelete(req.params._id);
        if (issue) {
            res.json({ msg: "Issue deleted" });
        } else {
            res.json({ msg: "Issue not found" });
        }
    } catch (err) {
        console.error(err);
        res.json({ msg: "Error in deleting issue" });
    }
};

module.exports = { createIssue, getIssues, getIssueById, updateIssue, deleteIssue };


// const createIssue = async (req, res) => {
//     try {
//         const { project, reporter } = req.body;

//         // Validate Project and Reporter exists
//         if (!await Project.findById(project) || !await User.findById(reporter)) {
//             return res.status(400).json({ msg: "Invalid project or reporter" });
//         }

//         let issue = new Issue(req.body);
//         await issue.save();
//         res.json({ msg: "Issue created" });
//     } catch (err) {
//         console.error(err); // Log the error
//         res.status(500).json({ msg: "Error in issue creation" });
//     }
// };

// const getIssues = async (req, res) => {
//     try {
//         let issues = await Issue.find().populate("project assignee reporter");
//         res.json(issues);
//     } catch (err) {
//         console.error(err); // Log the error
//         res.status(500).json({ msg: "Error in fetching issues" });
//     }
// };

// const getIssueById = async (req, res) => {
//     try {
//         let issue = await Issue.findById(req.params._id).populate("project assignee reporter comments attachments");
//         if (issue) {
//             res.json(issue);
//         } else {
//             res.status(404).json({ msg: "Issue not found" });
//         }
//     } catch (err) {
//         console.error(err); // Log the error
//         res.status(500).json({ msg: "Error in fetching issue" });
//     }
// };

// const updateIssue = async (req, res) => {
//     try {
//         let issue = await Issue.findByIdAndUpdate(req.params._id, req.body, { new: true });
//         if (issue) {
//             res.json({ msg: "Issue updated" });
//         } else {
//             res.status(404).json({ msg: "Issue not found" });
//         }
//     } catch (err) {
//         console.error(err); // Log the error
//         res.status(500).json({ msg: "Error in updating issue" });
//     }
// };

// const deleteIssue = async (req, res) => {
//     try {
//         let issue = await Issue.findByIdAndDelete(req.params._id);
//         if (issue) {
//             res.json({ msg: "Issue deleted" });
//         } else {
//             res.status(404).json({ msg: "Issue not found" });
//         }
//     } catch (err) {
//         console.error(err); // Log the error
//         res.status(500).json({ msg: "Error in deleting issue" });
//     }
// };

// module.exports = { createIssue, getIssues, getIssueById, updateIssue, deleteIssue };
