const express = require('express');
const router = express.Router();
const chatController = require("../controllers/chatController");
const messageController = require("../controllers/messageController");
const feedbackController = require("../controllers/feedbackController");
const authenticateToken = require("../middleware/authMiddleware");


router.get('', authenticateToken, chatController.getChats);
router.delete('/:chat_id', authenticateToken, chatController.deleteChat);
router.get('/:chat_id/messages', authenticateToken, messageController.getMessages);
router.post('/:chat_id/message', authenticateToken, messageController.createMessage);
router.post('/:chat_id/message/:message_id/feedback', authenticateToken, feedbackController.createFeedback);

module.exports = router;
