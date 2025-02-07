const Project = require('../models/Project')

const createProject = async (req, res) => {
    try {
        let project = new Project(req.body);
        await project.save();
        res.json({ msg: "Project created" });
    } catch (err) {
        //console.log(err)
        res.json({ msg: "Error in project creation" });
    }
};

const getProjects = async (req, res) => {
    try {
        let projects = await Project.find().populate("lead members");
        res.json(projects);
    } catch (err) {
        res.json({ msg: "Error in fetching projects" });
    }
};

const getProjectById = async (req, res) => {
    try {
        let project = await Project.findById(req.params._id).populate("lead members");
        if (project) {
            res.json(project);
        } else {
            res.json({ msg: "Project not found" });
        }
    } catch (err) {
        res.json({ msg: "Error in fetching project" });
    }
};

const updateProject = async (req, res) => {
    try {
        let project = await Project.findByIdAndUpdate(req.params._id, req.body, { new: true });
        if (project) {
            res.json({ msg: "Project updated" });
        } else {
            res.json({ msg: "Project not found" });
        }
    } catch (err) {
        res.json({ msg: "Error in updating project" });
    }
};

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

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject };
