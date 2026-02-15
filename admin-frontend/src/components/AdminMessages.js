import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { uploadFile } from '../config/supabase';
import './AdminMessages.css';

const AdminMessages = () => {
  const [allMessages, setAllMessages] = useState([]);
  const [userConversations, setUserConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserMessages, setSelectedUserMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [replyFiles, setReplyFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread, replied
  const [uploadError, setUploadError] = useState('');
  const conversationEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [selectedUserMessages]);

  const scrollToBottom = () => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderAttachment = (att, idx) => {
    const fileType = att.type || att.fileType || '';
    const fileUrl = att.url || att;
    const fileName = att.fileName || `Attachment ${idx + 1}`;

    // Image files
    if (fileType.startsWith('image/')) {
      return (
        <div key={idx} className="attachment-preview image-preview">
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <img src={fileUrl} alt={fileName} />
          </a>
          <div className="attachment-name">{fileName}</div>
        </div>
      );
    }

    // Video files
    if (fileType.startsWith('video/')) {
      return (
        <div key={idx} className="attachment-preview video-preview">
          <video controls>
            <source src={fileUrl} type={fileType} />
            Your browser does not support the video tag.
          </video>
          <div className="attachment-name">{fileName}</div>
        </div>
      );
    }

    // Other files (PDF, documents, etc.)
    return (
      <a 
        key={idx}
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="attachment-link"
      >
        <i className="fas fa-paperclip"></i> {fileName}
      </a>
    );
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/messages');
      setAllMessages(response.data);
      groupMessagesByUser(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const groupMessagesByUser = (messages) => {
    const grouped = messages.reduce((acc, msg) => {
      if (!acc[msg.userId]) {
        acc[msg.userId] = {
          userId: msg.userId,
          userName: msg.userName,
          userEmail: msg.userEmail,
          messages: [],
          lastMessage: msg,
          unreadCount: 0,
          hasUnread: false,
          hasReply: false,
        };
      }
      acc[msg.userId].messages.push(msg);
      if (!msg.isRead) {
        acc[msg.userId].unreadCount++;
        acc[msg.userId].hasUnread = true;
      }
      if (msg.adminReply) {
        acc[msg.userId].hasReply = true;
      }
      // Update last message if this is more recent
      if (new Date(msg.createdAt) > new Date(acc[msg.userId].lastMessage.createdAt)) {
        acc[msg.userId].lastMessage = msg;
      }
      return acc;
    }, {});

    // Convert to array and sort by last message date
    const conversations = Object.values(grouped).sort(
      (a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    );

    setUserConversations(conversations);
  };

  const handleSelectUser = async (conversation) => {
    setSelectedUser(conversation);
    try {
      const response = await axios.get(`http://localhost:5000/api/messages/admin/user/${conversation.userId}`);
      // Sort messages chronologically (oldest first for chat view)
      const sortedMessages = response.data.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setSelectedUserMessages(sortedMessages);
      
      // Mark unread messages as read
      const unreadMessages = sortedMessages.filter(msg => !msg.isRead);
      for (const msg of unreadMessages) {
        await axios.put(`http://localhost:5000/api/messages/${msg._id}/read`);
      }
      
      // Refresh the conversations list
      fetchMessages();
    } catch (error) {
      console.error('Error fetching user messages:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setReplyFiles(selectedFiles);
    setUploadError('');
  };

  const handleReply = async () => {
    if (!replyText.trim() && replyFiles.length === 0) return;
    if (!selectedUserMessages.length) return;

    // Find the first unreplied message or use the latest message
    const unrepliedMessage = selectedUserMessages.find(msg => !msg.adminReply);
    const targetMessage = unrepliedMessage || selectedUserMessages[selectedUserMessages.length - 1];

    setLoading(true);
    setUploadError('');
    
    try {
      const attachments = [];

      // Upload files if any
      if (replyFiles.length > 0) {
        try {
          for (const file of replyFiles) {
            const fileUrl = await uploadFile(file, 'messages/admin');
            attachments.push({
              url: fileUrl,
              fileName: file.name,
              type: file.type,
            });
          }
        } catch (uploadError) {
          console.error('File upload error:', uploadError);
          // If files were selected but upload failed and no message text, don't send
          if (!replyText.trim()) {
            setUploadError('Failed to upload files: ' + uploadError.message + '. Please add a text message or try again.');
            setLoading(false);
            return;
          }
          // If there's message text, continue without attachments
          setUploadError('Failed to upload files. Sending message without attachments.');
        }
      }

      await axios.put(`http://localhost:5000/api/messages/${targetMessage._id}/reply`, {
        adminReply: replyText,
        adminAttachments: attachments,
      });
      
      setReplyText('');
      setReplyFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // Refresh the conversation
      handleSelectUser(selectedUser);
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Error sending reply: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/messages/${messageId}`);
      // Refresh the conversation
      if (selectedUser) {
        handleSelectUser(selectedUser);
      }
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message');
    }
  };

  const filteredConversations = userConversations.filter(conv => {
    if (filter === 'unread') return conv.hasUnread;
    if (filter === 'replied') return conv.hasReply;
    return true;
  });

  const totalUnread = userConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="admin-messages-container">
      <div className="messages-header">
        <h2>
          <i className="fas fa-envelope"></i> Messages
          {totalUnread > 0 && <span className="unread-badge">{totalUnread}</span>}
        </h2>
        
        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All ({userConversations.length})
          </button>
          <button
            className={filter === 'unread' ? 'active' : ''}
            onClick={() => setFilter('unread')}
          >
            Unread ({userConversations.filter(c => c.hasUnread).length})
          </button>
          <button
            className={filter === 'replied' ? 'active' : ''}
            onClick={() => setFilter('replied')}
          >
            Replied ({userConversations.filter(c => c.hasReply).length})
          </button>
        </div>
      </div>

      <div className="messages-layout">
        {/* Conversations Sidebar */}
        <div className="conversations-sidebar">
          {filteredConversations.length === 0 ? (
            <div className="no-conversations">
              <i className="fas fa-inbox"></i>
              <p>No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.userId}
                className={`conversation-item ${selectedUser?.userId === conv.userId ? 'active' : ''} ${conv.hasUnread ? 'has-unread' : ''}`}
                onClick={() => handleSelectUser(conv)}
              >
                <div className="user-avatar">
                  {conv.userName.charAt(0).toUpperCase()}
                </div>
                <div className="conversation-info">
                  <div className="conversation-header">
                    <h4>{conv.userName}</h4>
                    {conv.unreadCount > 0 && (
                      <span className="unread-count">{conv.unreadCount}</span>
                    )}
                  </div>
                  <p className="user-email">{conv.userEmail}</p>
                  <p className="last-message">{conv.lastMessage.message}</p>
                  <span className="conversation-time">
                    {new Date(conv.lastMessage.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Conversation Thread */}
        <div className="conversation-panel">
          {!selectedUser ? (
            <div className="no-conversation-selected">
              <i className="fas fa-comments"></i>
              <p>Select a conversation to view messages</p>
            </div>
          ) : (
            <>
              <div className="conversation-header">
                <div className="user-info">
                  <div className="user-avatar large">
                    {selectedUser.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3>{selectedUser.userName}</h3>
                    <p>{selectedUser.userEmail}</p>
                  </div>
                </div>
                <button className="close-btn" onClick={() => setSelectedUser(null)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="conversation-thread">
                {selectedUserMessages.map((msg) => (
                  <React.Fragment key={msg._id}>
                    {/* User Message */}
                    <div className="message-bubble user-message">
                      <div className="message-header">
                        <span className="sender-name">{msg.userName}</span>
                        <div className="message-actions-inline">
                          <button
                            className="delete-btn-inline"
                            onClick={() => handleDelete(msg._id)}
                            title="Delete message"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div className="message-text">{msg.message}</div>
                      
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="message-attachments">
                          {msg.attachments.map((att, idx) => renderAttachment(att, idx))}
                        </div>
                      )}
                      
                      <div className="message-meta">
                        <span className="message-time">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Admin Reply */}
                    {msg.adminReply && (
                      <div className="message-bubble admin-message">
                        <div className="message-header">
                          <span className="sender-name admin-label">
                            <i className="fas fa-user-shield"></i> You (Admin)
                          </span>
                        </div>
                        <div className="message-text">{msg.adminReply}</div>
                        
                        {msg.adminAttachments && msg.adminAttachments.length > 0 && (
                          <div className="message-attachments">
                            {msg.adminAttachments.map((att, idx) => renderAttachment(att, idx))}
                          </div>
                        )}
                        
                        <div className="message-meta">
                          <span className="message-time">
                            {new Date(msg.repliedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
                <div ref={conversationEndRef} />
              </div>

              {/* Reply Input at Bottom */}
              <div className="reply-input-container">
                {uploadError && <div className="upload-error">{uploadError}</div>}
                
                <div className="file-upload-section">
                  <label htmlFor="admin-file-input" className="file-input-label">
                    <i className="fas fa-paperclip"></i>
                    {replyFiles.length > 0 ? `${replyFiles.length} file(s) selected` : 'Attach files'}
                  </label>
                  <input
                    id="admin-file-input"
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                    style={{ display: 'none' }}
                  />
                </div>
                
                <div className="message-input-wrapper">
                  <textarea
                    placeholder="Type your message..."
                    rows="3"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleReply();
                      }
                    }}
                  />
                  <button
                    className="send-reply-btn"
                    onClick={handleReply}
                    disabled={loading || (!replyText.trim() && replyFiles.length === 0)}
                  >
                    {loading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-paper-plane"></i>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
