import React, { useState } from 'react';
import AdminPanel from './components/AdminPanel';
import Portfolio from './components/Portfolio';
import './App.css';

function App() {
  const [view, setView] = useState('portfolio'); // 'portfolio' or 'admin'

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="app-nav">
        <button 
          className={`nav-btn ${view === 'portfolio' ? 'active' : ''}`}
          onClick={() => setView('portfolio')}
        >
          Portfolio
        </button>
        <button 
          className={`nav-btn ${view === 'admin' ? 'active' : ''}`}
          onClick={() => setView('admin')}
        >
          Admin Panel
        </button>
      </nav>

      {/* Content */}
      {view === 'portfolio' ? <Portfolio /> : <AdminPanel />}
    </div>
  );
}

export default App;
