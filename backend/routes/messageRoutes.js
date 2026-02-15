const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all messages (admin)
router.get('/', messageController.getAllMessages);

// Get messages by user ID (protected - for logged-in users)
router.get('/user/:userId', authMiddleware, messageController.getMessagesByUser);

// Get messages by user ID (admin - no auth required)
router.get('/admin/user/:userId', messageController.getMessagesByUser);

// Create a new message (protected)
router.post('/', authMiddleware, messageController.createMessage);

// Reply to a message (admin)
router.put('/:id/reply', messageController.replyToMessage);

// Mark message as read
router.put('/:id/read', messageController.markAsRead);

// Delete a message
router.delete('/:id', messageController.deleteMessage);

module.exports = router;
