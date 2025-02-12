const Project = require('../models/Project')
const User = require('../models/User')
const createProject = async (req, res) => {
    try {
        // Find the user by ID
        const user = await User.findById(req.body.lead);
        if (!user) {
            res.json({ msg: "Lead user not found" });
        }
        // Check if the user's role is valid for lead
        if (!["Admin", "Developer", "Manager", "Lead"].includes(user.role)) {
            res.json({ msg: "User is not eligible to be a lead" });
        }
        // Create the project
        let project = new Project(req.body);
        await project.save();
        res.json({ msg: "Project created", project });
    } catch (err) {
        // console.error("Project Creation Error:", err);
        res.json({ msg: "Error in project creation", error: err.message });
    }
};

    // const createProject = async (req, res) => {
    //     try {
    //         let project = new Project(req.body);
    //         await project.save();
    //         res.json({ msg: "Project created" });
    //     } catch (err) {
    //         console.log(err)
    //         res.json({ msg: "Error in project creation" });
    //     }
    // };

    const getProjects = async (req, res) => {
        try {
            let projects = await Project.find().populate("lead members");
            if (projects && projects.length > 0) {
                const simplifiedProjects = projects.map(project => ({
                    _id: project._id,
                    name: project.name,
                    key: project.key,
                    description: project.description,
                    category: project.category || 'To Do', // Add category, default to 'To Do'
                    lead: {
                        _id: project.lead?._id,
                        name: project.lead?.name,
                        role: project.lead?.role,
                    },
                    members: project.members.map(member => ({
                        _id: member?._id,
                        name: member?.name,
                        role: member?.role,
                    })),
                    // Include the date fields here:
                    todoDate: project.todoDate,
                    inProgressDate: project.inProgressDate,
                    codeReviewDate: project.codeReviewDate,
                    doneDate: project.doneDate,
                }));
                res.json(simplifiedProjects);
            } else {
                res.json({ msg: "Project not found" });
            }
        } catch (err) {
            console.log(err)
            res.json({ msg: "Error in fetching projects" });
        }
    };
    



// const getProjects = async (req, res) => {
//     try {
//         let projects = await Project.find().populate("lead members");
//         if (projects && projects.length > 0) { 
//             //res.json(projects);
//             const simplifiedProjects = projects.map(project => ({
//                 _id: project._id,
//                 name: project.name,
//                 key: project.key,
//                 description: project.description,
//                 lead: {
//                     _id: project.lead?._id, // Use optional chaining
//                     name: project.lead?.name,
//                     role: project.lead?.role,
//                 },
//                 members: project.members.map(member => ({
//                     _id: member?._id, // Use optional chaining
//                     name: member?.name,
//                     role: member?.role,
//                 }))
//             }));

//             res.json(simplifiedProjects); // Send the array of simplified projects
//         } else {
//         res.json({ msg: "Project not found" });
//     }
//     } catch (err) {
//         console.log(err)
//         res.json({ msg: "Error in fetching projects" });
//     }
// };

const getProjectById = async (req, res) => {
    try {
        let project = await Project.findById(req.params._id).populate("lead members");
        if (project) {
            //res.json(project);
            const simplifiedProject = {
                _id: project._id,
                name: project.name,
                key: project.key,
                description: project.description,
                lead: {
                    _id: project.lead._id,
                    name: project.lead.name,
                    role: project.lead.role,
                },
                members: project.members.map(member => ({
                    _id: member._id,
                    name: member.name,
                    role: member.role,
                }))
            };

            res.json(simplifiedProject);
        } else {
            res.json({ msg: "Project not found" });
        }
    } catch (err) {
        res.json({ msg: "Error in fetching project" });
    }
};


const updateProject = async (req, res) => {
    try {
        let updateData = { ...req.body }; // Copy req.body to avoid modifying it directly
        const project = await Project.findById(req.params._id);

        if (!project) {
            return res.status(404).json({ msg: "Project not found" });
        }

        // Update date fields based on category change
        if (req.body.category && req.body.category !== project.category) {
            const currentDate = new Date();
            switch (req.body.category) {
                case "To Do":
                    updateData.todoDate = currentDate;
                    break;
                case "In Progress":
                    updateData.inProgressDate = currentDate;
                    break;
                case "Code Review":
                    updateData.codeReviewDate = currentDate;
                    break;
                case "Done":
                    updateData.doneDate = currentDate;
                    break;
            }
        }

        // Update the project
        let updatedProject = await Project.findByIdAndUpdate(req.params._id, updateData, { new: true }).populate("lead members");

        if (updatedProject) {
            const simplifiedProject = {
                _id: updatedProject._id,
                name: updatedProject.name,
                key: updatedProject.key,
                description: updatedProject.description,
                lead: {
                    _id: updatedProject.lead?._id,
                    name: updatedProject.lead?.name,
                    role: updatedProject.lead?.role,
                },
                members: updatedProject.members.map(member => ({
                    _id: member?._id,
                    name: member?.name,
                    role: member?.role,
                })),
                todoDate: updatedProject.todoDate,
                inProgressDate: updatedProject.inProgressDate,
                codeReviewDate: updatedProject.codeReviewDate,
                doneDate: updatedProject.doneDate,
            };
            res.json(simplifiedProject);
        } else {
            res.status(404).json({ msg: "Project not found" }); // Use status codes for clarity
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error in updating project", error: err.message }); // Include error message for debugging
    }
};


// const updateProject = async (req, res) => {
//     try {
//         let project = await Project.findByIdAndUpdate(req.params._id, req.body, { new: true }).populate("lead members");
//         if (project) {
//             const simplifiedProject = {
//                 _id: project._id,
//                 name: project.name,
//                 key: project.key,
//                 description: project.description,
//                 lead: {
//                     _id: project.lead?._id,
//                     name: project.lead?.name,
//                     role: project.lead?.role,
//                 },
//                 members: project.members.map(member => ({
//                     _id: member?._id,
//                     name: member?.name,
//                     role: member?.role,
//                 })),
//             };
//             res.json(simplifiedProject);
//             // res.json({ msg: "Project updated" });
//         } else {
//             res.json({ msg: "Project not found" });
//         }
//     } catch (err) {
//         res.json({ msg: "Error in updating project" });
//     }
// };

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
    const { _id } = req.params;  // Use _id to match the route parameter
    try {
        const completedProjects = await Project.find({
            lead: _id,
            status: 'completed'
        })
        .populate({
            path: 'lead',
            select: 'name role' // Specify the fields you want to retrieve from the User model
        });

        res.json(completedProjects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching completed projects by lead' });
    }
};


const getCompletedByProject = async (req, res) => {
    const { _id } = req.params;  // Use _id to match the route parameter

    try {
        const completedProjects = await Project.find({
            _id: _id,  // Use _id in the query
            status: 'completed'
        }).populate('lead');

        res.json(completedProjects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching completed projects by project' });
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



module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject, getCompletedByLead, getCompletedByProject, getProjectDetail };
