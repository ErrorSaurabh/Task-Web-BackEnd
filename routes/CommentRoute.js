const express = require('express');
const router = express.Router();
const {createComment, getComments, getCommentById, updateComment, deleteComment} = require("../controllers/CommentController")

router.post('/comment', createComment)
router.get('/comment', getComments);
router.get('/comment/:_id', getCommentById);
router.put('/comment/:_id', updateComment);
router.delete('/comment/:_id', deleteComment);

module.exports = router;