import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminMessages.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://my-portfolio-hxer.onrender.com';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/messages`);
      // Sort by most recent first
      const sortedMessages = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setMessages(sortedMessages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  const handleSelectMessage = async (message) => {
    setSelectedMessage(message);
    
    // Mark as read if not already
    if (!message.isRead) {
      try {
        await axios.put(`${API_URL}/api/messages/${message._id}/read`);
        fetchMessages(); // Refresh to update read status
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await axios.delete(`${API_URL}/api/messages/${messageId}`);
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message');
    }
  };

  const handleClose = () => {
    setSelectedMessage(null);
  };

  const unreadCount = messages.filter(msg => !msg.isRead).length;

  if (loading) {
    return (
      <div className="admin-messages-container">
        <div className="loading-message">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="admin-messages-container">
      <div className="messages-header">
        <h2>
          <i className="fas fa-envelope"></i> Messages
          {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
        </h2>
        <p className="total-messages">Total: {messages.length}</p>
      </div>

      <div className="messages-layout">
        {/* Messages List */}
        <div className="messages-list">
          {messages.length === 0 ? (
            <div className="no-messages">
              <i className="fas fa-inbox"></i>
              <p>No messages yet</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`message-item ${selectedMessage?._id === msg._id ? 'active' : ''} ${!msg.isRead ? 'unread' : ''}`}
              >
                <div className="message-item-header" onClick={() => handleSelectMessage(msg)}>
                  <div className="sender-avatar">
                    {(msg.name || msg.userName || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="message-item-info">
                    <h4>{msg.name || msg.userName || 'Unknown'}</h4>
                    <p className="message-preview">
                      {msg.message && msg.message.length > 50 
                        ? msg.message.substring(0, 50) + '...' 
                        : msg.message || 'No message'}
                    </p>
                    <span className="message-time">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {!msg.isRead && <span className="unread-dot"></span>}
                </div>
                <button
                  className="message-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(msg._id);
                  }}
                  title="Delete message"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Message Detail View */}
        <div className="message-detail">
          {selectedMessage ? (
            <>
              <div className="message-detail-header">
                <div>
                  <h3>{selectedMessage.name || selectedMessage.userName || 'Unknown'}</h3>
                  <span className="message-date">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="message-actions">
                  <button 
                    onClick={() => handleDelete(selectedMessage._id)}
                    className="delete-button"
                    title="Delete message"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                  <button 
                    onClick={handleClose}
                    className="close-button"
                    title="Close"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
              
              <div className="message-detail-body">
                <div className="message-content">
                  <p>{selectedMessage.message || 'No message content'}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <i className="fas fa-mouse-pointer"></i>
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
