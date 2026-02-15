import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/profile');
      const projectsList = response.data.projects || [];
      console.log('Fetched projects:', projectsList);
      // Filter valid projects and sort by priority
      const validProjects = projectsList.filter(p => p && p.priority && p.title);
      const sortedProjects = validProjects.sort((a, b) => a.priority - b.priority);
      setProjects(sortedProjects);
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="projects-loading">
        <div className="spinner"></div>
        <p>Loading projects...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="projects-empty">
        <h2>No Projects Yet</h2>
        <p>Projects will be displayed here soon!</p>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <div className="projects-top-section">
        {/* Mini Profile Section */}
        {profile && (
          <div className="mini-profile">
            <div className="mini-profile-image">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt={profile.name} />
              ) : (
                <div className="mini-profile-placeholder">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
                </div>
              )}
            </div>
            <div className="mini-profile-info">
              <h3>{profile.name || 'Anonymous'}</h3>
              {profile.region && (
                <p className="mini-profile-region">
                  <i className="fas fa-map-marker-alt"></i> {profile.region}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="projects-header">
          <h1>My Projects</h1>
          <p>Check out some of my work below</p>
        </div>
      </div>

      <div className="projects-content">
        <div className="projects-grid">{projects.map((project, index) => (
          <div key={index} className="project-card">
            <div className="project-content">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">
                {project.description}
              </p>
              <div className="project-links">
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    <i className="fas fa-external-link-alt"></i> Live Project
                  </a>
                )}
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link github-link"
                  >
                    <i className="fab fa-github"></i> GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default Projects;
