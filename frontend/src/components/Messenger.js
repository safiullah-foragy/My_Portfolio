import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadFile } from '../config/supabase';
import axios from 'axios';
import './Messenger.css';

const Messenger = () => {
  const { user, token, signIn, signUp, signOut, forgotPassword, verifyOTP, resetPassword } = useAuth();
  const [view, setView] = useState('login'); // 'login', 'signup', 'forgot-password', 'verify-otp', 'reset-password'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [tempEmail, setTempEmail] = useState(''); // Store email for OTP flow
  const [tempOTP, setTempOTP] = useState(''); // Store OTP for password reset
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const conversationEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchUserMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const fetchUserMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/messages/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (view === 'login') {
        const result = await signIn(email, password);
        if (result.success) {
          setSuccessMsg('Login successful!');
        }
      } else if (view === 'signup') {
        if (!name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        const result = await signUp(email, password, name);
        if (result.success) {
          setSuccessMsg('Account created and logged in successfully!');
        }
      }
      setEmail('');
      setPassword('');
      setName('');
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setTempEmail(email);
        setSuccessMsg(`OTP sent! Your OTP is: ${result.otp} (Check console for production)`);
        setView('verify-otp');
        setEmail('');
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const result = await verifyOTP(tempEmail, otp);
      if (result.success) {
        setTempOTP(otp);
        setSuccessMsg('OTP verified! Please enter your new password.');
        setView('reset-password');
        setOtp('');
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const result = await resetPassword(tempEmail, tempOTP, newPassword);
      if (result.success) {
        setSuccessMsg('Password reset successful! Please login with your new password.');
        setView('login');
        setTempEmail('');
        setTempOTP('');
        setNewPassword('');
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && files.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const attachments = [];

      // Upload files to Supabase storage
      if (files.length > 0) {
        try {
          for (const file of files) {
            const fileUrl = await uploadFile(file, user.id);
            attachments.push({
              url: fileUrl,
              fileName: file.name,
              type: file.type,
            });
          }
        } catch (uploadError) {
          console.error('File upload error:', uploadError);
          // If files were selected but upload failed and no message text, don't send
          if (!message.trim()) {
            setError('Failed to upload files: ' + uploadError.message + '. Please add a text message or try again.');
            setLoading(false);
            return;
          }
          // If there's message text, continue without attachments
          setError('Failed to upload files. Sending message without attachments.');
        }
      }

      // Save message to database with JWT token
      await axios.post('http://localhost:5000/api/messages', {
        userId: user.id,
        userName: user.name || user.email,
        userEmail: user.email,
        message: message || '',
        attachments: attachments,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('');
      setFiles([]);
      setSuccessMsg('Message sent successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchUserMessages();
    } catch (error) {
      console.error('Send message error:', error);
      setError('Error sending message: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setMessages([]);
    } catch (error) {
      setError('Error logging out');
    }
  };

  if (!user) {
    return (
      <div className="messenger-auth">
        <div className="auth-notice">
          <i className="fas fa-info-circle"></i>
          <p>Create an account and login to chat directly with me!</p>
        </div>
        
        <div className="auth-container">
          {/* Login View */}
          {view === 'login' && (
            <>
              <h2>Login</h2>
              {error && <div className="error-message">{error}</div>}
              {successMsg && <div className="success-message">{successMsg}</div>}
              
              <form onSubmit={handleAuth}>
                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div className="input-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                </div>
                
                <button type="submit" disabled={loading} className="auth-button">
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
              
              <p className="auth-toggle">
                Don't have an account? <span onClick={() => setView('signup')}>Sign Up</span>
              </p>
              <p className="auth-toggle">
                <span onClick={() => setView('forgot-password')}>Forgot Password?</span>
              </p>
            </>
          )}

          {/* Signup View */}
          {view === 'signup' && (
            <>
              <h2>Create Account</h2>
              {error && <div className="error-message">{error}</div>}
              {successMsg && <div className="success-message">{successMsg}</div>}
              
              <form onSubmit={handleAuth}>
                <div className="input-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    required
                  />
                </div>
                
                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div className="input-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (min 6 characters)"
                    required
                  />
                </div>
                
                <button type="submit" disabled={loading} className="auth-button">
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>
              
              <p className="auth-toggle">
                Already have an account? <span onClick={() => setView('login')}>Login</span>
              </p>
            </>
          )}

          {/* Forgot Password View */}
          {view === 'forgot-password' && (
            <>
              <h2>Forgot Password</h2>
              {error && <div className="error-message">{error}</div>}
              {successMsg && <div className="success-message">{successMsg}</div>}
              
              <p className="auth-info">Enter your email to receive a verification code</p>
              
              <form onSubmit={handleForgotPassword}>
                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <button type="submit" disabled={loading} className="auth-button">
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>
              
              <p className="auth-toggle">
                <span onClick={() => setView('login')}>Back to Login</span>
              </p>
            </>
          )}

          {/* Verify OTP View */}
          {view === 'verify-otp' && (
            <>
              <h2>Verify OTP</h2>
              {error && <div className="error-message">{error}</div>}
              {successMsg && <div className="success-message">{successMsg}</div>}
              
              <p className="auth-info">Enter the 6-digit code sent to {tempEmail}</p>
              
              <form onSubmit={handleVerifyOTP}>
                <div className="input-group">
                  <label>OTP Code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    maxLength="6"
                    required
                  />
                </div>
                
                <button type="submit" disabled={loading} className="auth-button">
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>
              
              <p className="auth-toggle">
                <span onClick={() => setView('forgot-password')}>Resend OTP</span>
              </p>
            </>
          )}

          {/* Reset Password View */}
          {view === 'reset-password' && (
            <>
              <h2>Reset Password</h2>
              {error && <div className="error-message">{error}</div>}
              {successMsg && <div className="success-message">{successMsg}</div>}
              
              <p className="auth-info">Enter your new password</p>
              
              <form onSubmit={handleResetPassword}>
                <div className="input-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password (min 6 characters)"
                    required
                  />
                </div>
                
                <button type="submit" disabled={loading} className="auth-button">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="messenger-container">
      <div className="messenger-header">
        <div>
          <h3>Messages</h3>
          <p className="user-email">{user.name || user.email}</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>

      <div className="conversation-view">
        {messages.length === 0 ? (
          <div className="no-messages">
            <i className="fas fa-comments"></i>
            <p>No messages yet. Send your first message!</p>
          </div>
        ) : (
          <div className="conversation-thread">
            {messages.map((msg) => (
              <React.Fragment key={msg._id}>
                {/* User Message */}
                <div className="message-bubble user-message">
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
                    {msg.isRead && <span className="read-badge">✓ Read</span>}
                  </div>
                </div>

                {/* Admin Reply */}
                {msg.adminReply && (
                  <div className="message-bubble admin-message">
                    <div className="admin-label">Admin</div>
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
        )}
      </div>

      <div className="message-input-container">
        <form onSubmit={handleSendMessage}>
          {error && <div className="error-message">{error}</div>}
          {successMsg && <div className="success-message">{successMsg}</div>}
          
          <div className="file-upload-section">
            <label htmlFor="file-input" className="file-input-label">
              <i className="fas fa-paperclip"></i>
              {files.length > 0 ? `${files.length} file(s) selected` : 'Attach files'}
            </label>
            <input
              id="file-input"
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              style={{ display: 'none' }}
            />
          </div>

          <div className="message-input-wrapper">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows="3"
              required={files.length === 0}
            />
            <button type="submit" disabled={loading || (!message.trim() && files.length === 0)}>
              {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Messenger;
