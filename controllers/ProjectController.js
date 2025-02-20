
const Project = require("../models/Project")
const User = require('../models/User')
const transporter = require('../config/mailer')

const createProject = async (req, res) => {
    try {
        const user = await User.findById(req.body.lead);
        if (!user) {
            return res.status(404).json({ msg: "Lead user not found" }); 
        }
        if (!["Developer", "Manager"].includes(user.role)) {
            return res.status(403).json({ msg: "User is not eligible to be a lead" }); 
        }
        const projectData = {
            ...req.body,
            tasks: [] 
        };
        
        let project = new Project(projectData);
        await project.save();

         const leadUser = await User.findById(req.body.lead);
         const memberUsers = await User.find({ _id: { $in: req.body.members } });
 
         const mailOptions = {
             from: 'jira.tool@gmail.com', 
             to: [leadUser.email, ...memberUsers.map(member => member.email)].join(', '), 
             subject: 'New Project Assigned: ' + project.name,
             html: `<p>Dear ${leadUser.name} and team,</p>
                    <p>A new project has been assigned to you:</p>
                    <ul>
                        <li><strong>Project Name:</strong> ${project.name}</li>
                        <li><strong>Description:</strong> ${project.description}</li>
                        <li><strong>Key:</strong> ${project.key}</li>
                    </ul>
                    <p>Please start working on it.</p>`
         };
 
         transporter.sendMail(mailOptions, function (err, info) {
             if (err) {
                 console.log(err);
             } else {
                 console.log('Email sent: ' + info.response);
             }
         });
        
        res.status(201).json({ msg: "Project created", project }); 
    } catch (err) {
        console.error("Project Creation Error:", err);
        res.status(500).json({ msg: "Error in project creation", error: err.message }); 
    }
};

const getProjects = async (req, res) => {
    try {
        let projects = await Project.find()
            .populate("lead")
            .populate("members")
            .populate("tasks.assignedTo") // Populating assigned user in tasks
            .populate("comments.user"); // Populating user in comments

        if (!projects || projects.length === 0) {
            return res.json({ msg: "Project not found" });
        }

        // Formatting the response properly
        const simplifiedProjects = projects.map(project => ({
            _id: project._id,
            name: project.name,
            key: project.key,
            description: project.description,
            category: project.category || 'To Do',
            status: project.status || 'active',
            lead: project.lead ? {
                _id: project.lead._id,
                name: project.lead.name,
                role: project.lead.role,
            } : null,
            members: project.members.length > 0 ? project.members.map(member => ({
                _id: member._id,
                name: member.name,
                role: member.role,
            })) : [],
            createdAt: project.createdAt, 
            updatedAt: project.updatedAt, 
            todoDate: project.todoDate,
            inProgressDate: project.inProgressDate,
            codeReviewDate: project.codeReviewDate,
            pendingDate: project.pendingDate,
            doneDate: project.doneDate,
            tasks: project.tasks.length > 0 ? project.tasks.map(task => ({
                _id: task._id,
                name: task.name,
                status: task.status,
                assignedTo: task.assignedTo ? {
                    _id: task.assignedTo._id,
                    name: task.assignedTo.name
                } : null,
                startDate: task.startDate,
                endDate: task.endDate,
            })) : [],
            comments: project.comments.length > 0 ? project.comments.map(comment => ({
                _id: comment._id,
                text: comment.text,
                user: comment.user ? {
                    _id: comment.user._id,
                    name: comment.user.name
                } : null,
                createdAt: comment.createdAt,
            })) : [],
        }));

        res.json(simplifiedProjects);
    } catch (err) {
        console.error("Error fetching projects:", err);
        res.status(500).json({ msg: "Error in fetching projects", error: err.message });
    }
};


// const getProjects = async (req, res) => {
//     try {
//         let projects = await Project.find().populate("lead members");
//         if (projects && projects.length > 0) {
//             const simplifiedProjects = projects.map(project => ({
//                 _id: project._id,
//                 name: project.name,
//                 key: project.key,
//                 description: project.description,
//                 category: project.category || 'To Do',
//                 status: project.status || 'active',
//                 lead: project.lead ? {
//                     _id: project.lead._id,
//                     name: project.lead.name,
//                     role: project.lead.role,
//                 } : null,
//                 members: project.members ? project.members.map(member => ({
//                     _id: member._id,
//                     name: member.name,
//                     role: member.role,
//                 })) : [],
//                 createdAt: project.createdAt, 
//                 updatedAt: project.updatedAt, 
//                 todoDate: project.todoDate,
//                 inProgressDate: project.inProgressDate,
//                 codeReviewDate: project.codeReviewDate,
//                 pendingDate: project.pendingDate,
//                 doneDate: project.doneDate,
//                 tasks: project.tasks ? project.tasks.map(task => ({
//                     _id: task._id,
//                     name: task.name,
//                     status: task.status,
//                     assignedTo: task.assignedTo,
//                     startDate: task.startDate,
//                     endDate: task.endDate,
//                 })) : [],
//                 comments: project.comments ? project.comments.map(comment => ({
//                     _id: comment._id,
//                     text: comment.text,
//                     user: comment.user,
//                     createdAt: comment.createdAt,
//                 })) : [],
//             }));
//             res.json(simplifiedProjects);
//         } else {
//             res.json({ msg: "Project not found" });
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: "Error in fetching projects", error: err.message });
//     }
// };


const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params._id).populate("lead members");

        if (!project) {
            return res.status(404).json({ msg: "Project not found" }); 
        }

        const simplifiedLead = project.lead ? {
            _id: project.lead._id,
            name: project.lead.name,
            role: project.lead.role,
        } : null; 

        const simplifiedMembers = project.members ? project.members.map(member => ({
            _id: member._id,
            name: member.name,
            role: member.role,
        })) : []; 

         const simplifiedTasks = project.tasks ? project.tasks.map(task => ({
            _id: task._id,
            name: task.name,
            status: task.status,
            assignedTo: task.assignedTo,
            startDate: task.startDate,
            endDate: task.endDate,
        })) : [];

        const simplifiedComments = project.comments ? project.comments.map(comment => ({
            _id: comment._id,
            text: comment.text,
            user: comment.user,
            createdAt: comment.createdAt,
        })) : [];

        const simplifiedProject = {
            _id: project._id,
            name: project.name,
            key: project.key,
            description: project.description,
            category: project.category, 
            status: project.status,
            todoDate: project.todoDate,
            inProgressDate: project.inProgressDate,
            codeReviewDate: project.codeReviewDate,
            doneDate: project.doneDate,
            lead: simplifiedLead,
            members: simplifiedMembers,
            tasks: simplifiedTasks,
            comments: simplifiedComments,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        };

        res.status(200).json(simplifiedProject); 

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error in fetching project" }); 
    }
};

const updateProject = async (req, res) => {
    try {
        const { _id } = req.params;
        const { comment, user, tasks, status, category, lead, members, name, key, description } = req.body;

        const project = await Project.findById(_id);

        if (!project) {
            return res.status(404).json({ msg: "Project not found" });
        }

        const previousCategory = project.category;

        if (name) project.name = name;
        if (key) project.key = key;
        if (description) project.description = description;
        if (lead) project.lead = lead;
        if (members) project.members = members;

        if (comment && user) {
            project.comments.push({
                text: comment,
                user: user,
                createdAt: new Date()
            });
        }
        if (tasks) {
            project.tasks = tasks;
        }

        if (category && category !== previousCategory) {
            project.category = category;

            switch (category) {
                case "To Do":
                    project.todoDate = new Date();
                    break;
                case "In Progress":
                    project.inProgressDate = new Date();
                    break;
                case "Code Review":
                    project.codeReviewDate = new Date();
                    break;
                case "Done":
                    project.doneDate = new Date();
                    break;
                default:
                    break;
            }

            try {
                await sendCategoryUpdateEmail(project, previousCategory, category);
            } catch (emailError) {
                console.error("Error sending category update email:", emailError);
            }
        }

        const previousStatus = project.status;
        if (status && status !== previousStatus) {
            project.status = status;

            if (status === 'completed' && previousStatus !== 'completed') {
                try {
                    await sendCompletionEmail(project);
                } catch (emailError) {
                    console.error("Error sending completion email:", emailError);
                }
            }
        }

        await project.save();

        const updatedProject = await Project.findById(_id).populate("lead members tasks");
        const simplifiedProject = {
            _id: updatedProject._id,
            name: updatedProject.name,
            key: updatedProject.key,
            description: updatedProject.description,
            category: updatedProject.category,
            lead: updatedProject.lead ? {
                _id: updatedProject.lead._id,
                name: updatedProject.lead.name,
                role: updatedProject.lead.role,
            } : null,
            members: updatedProject.members.map(member => ({
                _id: member._id,
                name: member.name,
                role: member.role,
            })),
            comments: updatedProject.comments.map(comment => ({
                text: comment.text,
                user: comment.user,
                createdAt: comment.createdAt
            })),
            tasks: updatedProject.tasks.map(task => ({
                _id: task._id,
                name: task.name,
                description: task.description,
                status: task.status,
            })),
            todoDate: updatedProject.todoDate || null,
            inProgressDate: updatedProject.inProgressDate || null,
            codeReviewDate: updatedProject.codeReviewDate || null,
            pendingDate: updatedProject.pendingDate || null,
            doneDate: updatedProject.doneDate || null,
        };

        res.status(200).json(simplifiedProject);

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error in updating project", error: err.message });
    }
};
async function sendCategoryUpdateEmail(project, previousCategory, newCategory) {
    const leadUser = await User.findById(project.lead);
    const memberUsers = await User.find({ _id: { $in: project.members } });

    if (!leadUser) {
        throw new Error("Lead user not found");
    }

    const mailOptions = {
        from: 'jira.tool@gmail.com',
        to: [leadUser.email, ...memberUsers.map(member => member.email)].join(', '),
        subject: `Project Update: ${project.name} is now ${newCategory}`,
        html: `<p>Dear ${leadUser.name} and team,</p>
               <p>The project <strong>"${project.name}"</strong> has moved from <strong>${previousCategory}</strong> to <strong>${newCategory}</strong>.</p>
               <p>Keep up the great work!</p>
               <p>Updated Date: ${new Date().toLocaleDateString()}</p>`
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.error("Error sending category update email:", err);
                return reject(err);
            } else {
                console.log('Category Update Email sent: ' + info.response);
                resolve(info);
            }
        });
    });
}


// const updateProject = async (req, res) => {
//     try {
//         const { _id } = req.params; // Get the project ID from the parameters
//         const { comment, user, tasks, status, category, lead, members, name, key, description } = req.body; // Extract comment, user, tasks, status, and category from request body

//         // Find the project by its ID
//         const project = await Project.findById(_id);

//         if (!project) {
//             return res.status(404).json({ msg: "Project not found" });
//         }

//         // Update basic project information
//         if (name) project.name = name;
//         if (key) project.key = key;
//         if (description) project.description = description;
//         if (lead) project.lead = lead;
//         if (members) project.members = members; // Ensure members are updated

//         // Update the project's fields
//         if (comment && user) {
//             project.comments.push({
//                 text: comment,
//                 user: user,
//                 createdAt: new Date()
//             });
//         }

//         // Update the tasks array (if provided)
//         if (tasks) {
//             project.tasks = tasks;  // Replace the existing tasks array with the new one from the request
//         }

//         // Update the category (This addresses the original issue)
//         if (category) {
//             project.category = category;
//         }

//         // Status update and completion email logic
//         const previousStatus = project.status; // Store previous status
//         if (status && status !== previousStatus) {  // Only update if the status is actually changing
//             project.status = status; // Update to the new status

//             if (status === 'completed' && previousStatus !== 'completed') {
//                 // Completion email logic (moved to a separate function)
//                 try {
//                     await sendCompletionEmail(project); // Await the email sending
//                 } catch (emailError) {
//                     console.error("Error sending completion email:", emailError);
//                     // Consider whether to return an error or just log it.
//                     // If email is critical, you might want to return an error.
//                     // Otherwise, log it and continue to update the project.
//                 }
//             }
//         }

//         // Save the updated project
//         await project.save();

//         // Populate lead, members, and tasks before sending the response
//         const updatedProject = await Project.findById(_id).populate("lead members tasks");

//         // Simplify the response - INCLUDE TASKS!!!
//         const simplifiedProject = {
//             _id: updatedProject._id,
//             name: updatedProject.name,
//             key: updatedProject.key,
//             description: updatedProject.description,
//             category: updatedProject.category, // ADDED category to the simplified project
//             lead: updatedProject.lead ? {
//                 _id: updatedProject.lead._id,
//                 name: updatedProject.lead.name,
//                 role: updatedProject.lead.role,
//             } : null,
//             members: updatedProject.members.map(member => ({
//                 _id: member._id,
//                 name: member.name,
//                 role: member.role,
//             })),
//             comments: updatedProject.comments.map(comment => ({
//                 text: comment.text,
//                 user: comment.user,
//                 createdAt: comment.createdAt
//             })),
//             tasks: updatedProject.tasks.map(task => ({
//                 _id: task._id,
//                 name: task.name,
//                 description: task.description,
//                 status: task.status,
//             })),
//             todoDate: updatedProject.todoDate,
//             inProgressDate: updatedProject.inProgressDate,
//             codeReviewDate: updatedProject.codeReviewDate,
//             doneDate: updatedProject.doneDate,
//         };

//         res.status(200).json(simplifiedProject);

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: "Error in updating project", error: err.message });
//     }
// };

// // Separate function for sending completion email
// async function sendCompletionEmail(project) {
//     // Fetch lead and members details
//     const leadUser = await User.findById(project.lead);
//     const memberUsers = await User.find({ _id: { $in: project.members } });

//     if (!leadUser) {
//         throw new Error("Lead user not found"); // Or handle this more gracefully
//     }

//     // Compose email message for completion
//     const mailOptions = {
//         from: 'jira.tool@gmail.com', // Your Gmail address
//         to: [leadUser.email, ...memberUsers.map(member => member.email)].join(', '), // List of receivers
//         subject: 'Project Completed: ' + project.name,
//         html: `<p>Dear ${leadUser.name} and team,</p>
//                <p>Thank you for your hard work! The project "${project.name}" has been completed.</p>
//                <p>Completion Date: ${new Date().toLocaleDateString()}</p>`
//     };

//     // Send email notification for completion
//     return new Promise((resolve, reject) => {  // Wrap in a Promise to use with `await`
//         transporter.sendMail(mailOptions, function (err, info) {
//             if (err) {
//                 console.error("Error sending email:", err);
//                 return reject(err);
//             } else {
//                 console.log('Email sent: ' + info.response);
//                 resolve(info);
//             }
//         });
//     });
// }


const deleteProject = async (req, res) => {
    try {
        let project = await Project.findByIdAndDelete(req.params._id);
        if (project) {
            res.json({ msg: "Project deleted" });
        } else {
            res.json({ msg: "Project not found" });
        }
    } catch (err) {
        res.json({ msg: "Error in deleting project" });
    }
};

const getCompletedByLead = async (req, res) => {
    const { _id } = req.params;  

    try {
        // Validate that _id is a valid ObjectId (optional but recommended)
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: 'Invalid lead ID format' });
        }

        const completedProjects = await Project.find({
            lead: _id,
            status: 'completed'
        })
        .populate({
            path: 'lead',
            select: 'name role' // Specify the fields you want to retrieve from the User model
        });

        if (!completedProjects || completedProjects.length === 0) {
            return res.status(404).json({ message: 'No completed projects found for this lead' }); // Informative message
        }

        // Simplify the data before sending it to the client (optional but good practice)
        const simplifiedProjects = completedProjects.map(project => ({
            _id: project._id,
            name: project.name,
            key: project.key,
            description: project.description,
            category: project.category,
            status: project.status,
            lead: {
                _id: project.lead._id,
                name: project.lead.name,
                role: project.lead.role
            },
            todoDate: project.todoDate,
            inProgressDate: project.inProgressDate,
            codeReviewDate: project.codeReviewDate,
            doneDate: project.doneDate,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        }));

        res.status(200).json(simplifiedProjects); // Explicit 200 OK

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching completed projects by lead' });
    }
};



const getCompletedByProject = async (req, res) => {
    const { _id } = req.params;  // Use _id to match the route parameter

    try {
        // Validate that _id is a valid ObjectId (optional but recommended)
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: 'Invalid project ID format' });
        }

        const completedProjects = await Project.find({
            _id: _id,  // Use _id in the query
            status: 'completed'
        }).populate('lead');

        if (!completedProjects || completedProjects.length === 0) {
            return res.status(404).json({ message: 'No completed projects found for this project ID' });
        }

        // Simplify the response (optional but good practice)
        const simplifiedProjects = completedProjects.map(project => ({
            _id: project._id,
            name: project.name,
            key: project.key,
            description: project.description,
            lead: {
                _id: project.lead._id,
                name: project.lead.name,
                role: project.lead.role,
            },
            todoDate: project.todoDate,
            inProgressDate: project.inProgressDate,
            codeReviewDate: project.codeReviewDate,
            doneDate: project.doneDate,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        }));

        res.status(200).json(simplifiedProjects); // Explicit 200 OK

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching completed projects by project' });
    }
};

const getProjectsByUserId = async (req, res) => {
    const userId = req.params.userId;

    try {
        const projects = await Project.find({
            $or: [
                { members: userId },
                { lead: userId }
            ]
        })
        .populate({
            path: 'lead',
            select: 'name role'
        })
        .populate({
            path: 'members',
            select: 'name role'
        });

        if (!projects || projects.length === 0) {
            return res.status(404).json({ message: 'No projects found for this user' });
        }

        res.status(200).json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getProjectDetail = async (req, res) => {
    const { _id } = req.params;
    try {
        const project = await Project.findById(_id)
            .populate({
                path: 'lead',
                select: 'name role'
            })
             .populate({  // Populate the 'members' field
                path: 'members',
                select: 'name role' // Adjust the select to include 'role' if needed
            });;

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching project details' });
    }
};
const addTaskToProject = async (req, res) => {
    try {
        const { projectId } = req.params;  // Get project ID from URL parameters
        const { name, status, assignedTo, startDate, endDate } = req.body; // Get task details from request body

        // Find the project by its UUID
        const project = await Project.findOne({ _id: projectId });

        if (!project) {
            return res.status(404).json({ msg: "Project not found" });
        }

        // Create the new task object
        const newTask = {
            name,
            status,
            assignedTo,
            startDate,
            endDate
        };

        // Add the new task to the project's tasks array
        project.tasks.push(newTask);

        // Save the updated project
        await project.save();

        res.status(201).json({
            msg: "Task added successfully",
            task: newTask  // Respond with the newly created task
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error adding task to project", error: err.message });
    }
};

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject, getCompletedByLead, getCompletedByProject,getProjectDetail, getProjectsByUserId,addTaskToProject };
