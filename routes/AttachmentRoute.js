const express = require('express');
const router = express.Router();
const {createAttachment, getAttachment, getAttachmentById, updateAttachment, deleteAttachment} = require("../controllers/AttachmentCnotroller")

router.post('/attachment', createAttachment)
router.get('/attachment', getAttachment)
router.get('/attachment/:_id', getAttachmentById)
router.put('/attachment/:_id', updateAttachment)
router.delete('/attachment/:_id', deleteAttachment)

module.exports = router;