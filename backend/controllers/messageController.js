const Message = require('../models/Message');

// Get all messages (for admin)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

// Get messages by user ID
exports.getMessagesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({ userId }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user messages', error: error.message });
  }
};

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const { userId, userName, userEmail, message, attachments } = req.body;
    
    const newMessage = new Message({
      userId,
      userName,
      userEmail,
      message,
      attachments: attachments || [],
    });
    
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error creating message', error: error.message });
  }
};

// Reply to a message (admin only)
exports.replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminReply } = req.body;
    
    const message = await Message.findByIdAndUpdate(
      id,
      { 
        adminReply,
        repliedAt: new Date(),
        isRead: true,
      },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error replying to message', error: error.message });
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const message = await Message.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error marking message as read', error: error.message });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const message = await Message.findByIdAndDelete(id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error: error.message });
  }
};
