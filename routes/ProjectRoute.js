const express = require("express");
const { createProject, getProjects, getProjectById, updateProject, deleteProject } = require("../controllers/ProjectController");
const router = express.Router();

router.post("/project/create", createProject);
router.get("/project/all", getProjects);
router.get("/project/:_id", getProjectById);
router.put("/project/:_id", updateProject);
router.delete("/project/:_id", deleteProject);

module.exports = router;
