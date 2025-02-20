const express = require("express");
const { createProject, getProjects, getProjectById, updateProject, deleteProject, getCompletedByLead, getCompletedByProject,getProjectDetail, getProjectsByUserId, addTaskToProject } = require("../controllers/ProjectController");
const { islogin } = require("../middleware/IsLogin");
const router = express.Router();

router.post("/project/create",createProject); 
router.get("/project/all", getProjects); 
router.get("/project/:_id", getProjectById);
router.put("/project/:_id", updateProject); 
router.delete("/project/:_id", deleteProject);
router.get('/completed-project/lead/:_id', getCompletedByLead);
router.get('/completed-project/project/:_id', getCompletedByProject);
router.get('/project/details/:_id', getProjectDetail)
router.get("/project/user/:userId", getProjectsByUserId);
router.post("/projects/:projectId/tasks", addTaskToProject);
module.exports = router;
