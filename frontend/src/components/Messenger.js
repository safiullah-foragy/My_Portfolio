import React, { useState } from 'react';
import axios from 'axios';
import './Messenger.css';

const Messenger = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await axios.post('http://localhost:5000/api/messages/simple', {
        name: name.trim(),
        message: message.trim(),
      });

      setSuccessMsg('Message sent successfully!');
      setMessage('');
      // Keep the name for convenience
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Send message error:', error);
      setError('Error sending message: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="messenger-container">
      <div className="messenger-header">
        <h3>Send me a message</h3>
        <p>I'll get back to you soon!</p>
      </div>

      <div className="messenger-form-container">
        {error && <div className="error-message">{error}</div>}
        {successMsg && <div className="success-message">{successMsg}</div>}
        
        <form onSubmit={handleSendMessage} className="message-form">
          <div className="input-group">
            <label>Your Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div className="input-group">
            <label>Message *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows="6"
              required
            />
          </div>
          
          <button type="submit" disabled={loading} className="send-button">
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Sending...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i> Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Messenger;
