const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: '',
  },
  attachments: [{
    url: { type: String },
    fileName: { type: String },
    type: { type: String },
  }],
  adminReply: {
    type: String,
    default: '',
  },
  adminAttachments: [{
    url: { type: String },
    fileName: { type: String },
    type: { type: String },
  }],
  repliedAt: {
    type: Date,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Message', messageSchema);
