const express = require("express");
const {createIssue, getIssues, getIssueById, updateIssue, deleteIssue} = require("../controllers/IssueController");
const router = express.Router();

router.post('/issue', createIssue);
router.get('/issue', getIssues);
router.get('/issue/:_id', getIssueById);
router.put('/issue/:_id', updateIssue);
router.delete('/issue/:_id',deleteIssue)

module.exports = router;