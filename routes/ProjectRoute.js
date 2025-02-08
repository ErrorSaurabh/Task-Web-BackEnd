const express = require("express");
const { createProject, getProjects, getProjectById, updateProject, deleteProject } = require("../controllers/ProjectController");
const router = express.Router();

router.post("/project/create", createProject); // create 
router.get("/project/all", getProjects); // project
router.get("/project/:_id", getProjectById);
router.put("/project/:_id", updateProject); // in progress
router.delete("/project/:_id", deleteProject); // no use

module.exports = router;
