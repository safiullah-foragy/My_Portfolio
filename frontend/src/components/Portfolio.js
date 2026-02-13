import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Portfolio.css';

const Portfolio = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverFit, setCoverFit] = useState('cover');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const isCurrentlyStudying = (startDate, endDate) => {
    if (!startDate || !endDate) return false;
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return '';
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.getFullYear()} - ${end.getFullYear()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const getEducationStatus = (education) => {
    if (!education || !education.institutionName) return null;

    const isStudying = isCurrentlyStudying(
      education.studyPeriod?.startDate,
      education.studyPeriod?.endDate
    );
    const dateRange = formatDateRange(
      education.studyPeriod?.startDate,
      education.studyPeriod?.endDate
    );

    return {
      status: isStudying ? 'Studies' : 'Studied',
      institutionName: education.institutionName,
      degree: education.degree,
      dateRange: dateRange
    };
  };

  if (loading) {
    return (
      <div className="portfolio-loading">
        <div className="spinner"></div>
        <p>Loading portfolio...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="portfolio-empty">
        <h2>No Profile Found</h2>
        <p>Please add your profile information in the admin panel.</p>
      </div>
    );
  }

  const university = getEducationStatus(profile.education?.university);
  const college = getEducationStatus(profile.education?.college);
  const school = getEducationStatus(profile.education?.school);

  return (
    <div className="portfolio-container">
      {/* Cover Photo Section */}
      <div className="cover-section">
        <div 
          className="cover-photo" 
          style={{
            backgroundImage: profile.coverPhoto ? `url(${profile.coverPhoto})` : undefined,
            backgroundSize: coverFit,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {profile.coverPhoto && (
            <div className="cover-controls">
              <button 
                className={`cover-btn ${coverFit === 'cover' ? 'active' : ''}`}
                onClick={() => setCoverFit('cover')}
                title="Fill (Crop to fit)"
              >
                <span>⬜</span>
              </button>
              <button 
                className={`cover-btn ${coverFit === 'contain' ? 'active' : ''}`}
                onClick={() => setCoverFit('contain')}
                title="Fit (Show all)"
              >
                <span>🖼️</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-pic-container">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt={profile.name} className="profile-pic" />
            ) : (
              <div className="profile-pic-placeholder">
                {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
              </div>
            )}
          </div>
          <div className="profile-name-section">
            <h1 className="profile-name color-changing">{profile.name || 'Anonymous User'}</h1>
            {profile.region && (
              <p className="profile-region">
                <i className="icon-location"></i> Lives in {profile.region}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {/* Left Sidebar - Intro */}
        <div className="profile-sidebar">
          <div className="intro-card">
            <h2>Intro</h2>
            <div className="intro-content">
              {/* Education */}
              {university && (
                <div className="intro-item">
                  <i className="icon-education"></i>
                  <div>
                    <span className="intro-text">
                      {university.status} {university.degree ? university.degree : ''} at{' '}
                      <strong>{university.institutionName}</strong>
                    </span>
                    {university.dateRange && (
                      <div className="intro-subtext">{university.dateRange}</div>
                    )}
                  </div>
                </div>
              )}

              {college && (
                <div className="intro-item">
                  <i className="icon-education"></i>
                  <div>
                    <span className="intro-text">
                      {college.status} at <strong>{college.institutionName}</strong>
                    </span>
                    {college.dateRange && (
                      <div className="intro-subtext">{college.dateRange}</div>
                    )}
                  </div>
                </div>
              )}

              {school && (
                <div className="intro-item">
                  <i className="icon-education"></i>
                  <div>
                    <span className="intro-text">
                      Went to <strong>{school.institutionName}</strong>
                    </span>
                    {school.dateRange && (
                      <div className="intro-subtext">{school.dateRange}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Region */}
              {profile.region && (
                <div className="intro-item">
                  <i className="icon-location"></i>
                  <div>
                    <span className="intro-text">
                      Lives in <strong>{profile.region}</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Date of Birth */}
              {profile.dateOfBirth && (
                <div className="intro-item">
                  <i className="icon-birthday"></i>
                  <div>
                    <span className="intro-text">
                      Born on <strong>{formatDate(profile.dateOfBirth)}</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Address */}
              {profile.homeAddress && (
                <div className="intro-item">
                  <i className="icon-home"></i>
                  <div>
                    <span className="intro-text">
                      <strong>{profile.homeAddress}</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Contact */}
              {profile.contactNumber && (
                <div className="intro-item">
                  <i className="icon-phone"></i>
                  <div>
                    <span className="intro-text">{profile.contactNumber}</span>
                  </div>
                </div>
              )}

              {profile.email && (
                <div className="intro-item">
                  <i className="icon-email"></i>
                  <div>
                    <span className="intro-text">{profile.email}</span>
                  </div>
                </div>
              )}

              {/* Countries */}
              {profile.countries && profile.countries.length > 0 && (
                <div className="intro-item">
                  <i className="icon-globe"></i>
                  <div>
                    <span className="intro-text">
                      Connected to <strong>{profile.countries.join(', ')}</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {/* About Card */}
          <div className="profile-card">
            <h2>About</h2>
            <div className="about-content">
              <div className="about-section">
                <h3>Personal Information</h3>
                <div className="info-grid">
                  {profile.name && (
                    <div className="info-item">
                      <span className="info-label">Full Name:</span>
                      <span className="info-value">{profile.name}</span>
                    </div>
                  )}
                  {profile.dateOfBirth && (
                    <div className="info-item">
                      <span className="info-label">Date of Birth:</span>
                      <span className="info-value">{formatDate(profile.dateOfBirth)}</span>
                    </div>
                  )}
                  {profile.fatherName && (
                    <div className="info-item">
                      <span className="info-label">Father's Name:</span>
                      <span className="info-value">{profile.fatherName}</span>
                    </div>
                  )}
                  {profile.motherName && (
                    <div className="info-item">
                      <span className="info-label">Mother's Name:</span>
                      <span className="info-value">{profile.motherName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Education Details */}
              {(profile.sscResult || profile.hscResult || profile.universityResult) && (
                <div className="about-section">
                  <h3>Academic Results</h3>
                  <div className="info-grid">
                    {profile.sscResult && (
                      <div className="info-item">
                        <span className="info-label">SSC Result:</span>
                        <span className="info-value">{profile.sscResult}</span>
                      </div>
                    )}
                    {profile.hscResult && (
                      <div className="info-item">
                        <span className="info-label">HSC Result:</span>
                        <span className="info-value">{profile.hscResult}</span>
                      </div>
                    )}
                    {profile.universityResult && (
                      <div className="info-item">
                        <span className="info-label">University Result:</span>
                        <span className="info-value">{profile.universityResult}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Social Media Platforms */}
          {profile.platforms && profile.platforms.some(p => p.platformName || p.link) && (
            <div className="profile-card">
              <h2>Connect With Me</h2>
              <div className="platforms-content">
                {profile.platforms
                  .filter(platform => platform.platformName || platform.link)
                  .map((platform, index) => (
                    <a
                      key={index}
                      href={platform.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="platform-link"
                    >
                      <div className="platform-icon">{index + 1}</div>
                      <span>{platform.platformName || 'Platform ' + (index + 1)}</span>
                    </a>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
