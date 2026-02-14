import React, { useState } from 'react';
import AdminPanel from './components/AdminPanel';
import AdminMessages from './components/AdminMessages';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="App">
      <div className="admin-tabs">
        <button
          className={activeTab === 'profile' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('profile')}
        >
          <i className="fas fa-user"></i> Profile Management
        </button>
        <button
          className={activeTab === 'messages' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('messages')}
        >
          <i className="fas fa-envelope"></i> Messages
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'profile' ? <AdminPanel /> : <AdminMessages />}
      </div>
    </div>
  );
}

export default App;
