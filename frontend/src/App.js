import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Portfolio from './components/Portfolio';
import Projects from './components/Projects';
import Contact from './components/Contact';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
        {/* Navigation Bar */}
        <nav className="app-navbar">
          <div className="navbar-container">
            <div className="navbar-brand">Portfolio</div>
            <div className="navbar-menu">
              <NavLink
                to="/"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                end
              >
                <i className="fas fa-home"></i> Home
              </NavLink>
              <NavLink
                to="/projects"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <i className="fas fa-folder"></i> Projects
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <i className="fas fa-address-book"></i> Contact
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
