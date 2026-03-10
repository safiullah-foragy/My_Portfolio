import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/profile');
      const projectsList = response.data.projects || [];
      console.log('Fetched projects:', projectsList);
      // Filter valid projects and sort by priority
      const validProjects = projectsList.filter(p => p && p.priority && p.title);
      const sortedProjects = validProjects.sort((a, b) => a.priority - b.priority);
      setProjects(sortedProjects);
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
      <div className="projects-header">
        <h1>My Projects</h1>
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
