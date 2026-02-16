import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Portfolio.css';

const Portfolio = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverFit, setCoverFit] = useState('cover');

  // Platform icon and color mapping with intelligent matching
  const getPlatformStyle = (platformName) => {
    if (!platformName) return { icon: 'fas fa-link', color: '#667eea' };
    
    // Normalize the platform name: lowercase, remove spaces, special chars
    const normalize = (str) => str.toLowerCase().replace(/[\s\-_.]/g, '');
    const normalized = normalize(platformName);
    
    const platformStyles = {
      // Social Media (with common misspellings)
      github: { icon: 'fab fa-github', color: '#181717' },
      git: { icon: 'fab fa-github', color: '#181717' },
      linkedin: { icon: 'fab fa-linkedin', color: '#0A66C2' },
      linkdin: { icon: 'fab fa-linkedin', color: '#0A66C2' },
      linkdein: { icon: 'fab fa-linkedin', color: '#0A66C2' },
      linkedn: { icon: 'fab fa-linkedin', color: '#0A66C2' },
      instagram: { icon: 'fab fa-instagram', color: '#E4405F' },
      insta: { icon: 'fab fa-instagram', color: '#E4405F' },
      istagram: { icon: 'fab fa-instagram', color: '#E4405F' },
      instagr: { icon: 'fab fa-instagram', color: '#E4405F' },
      facebook: { icon: 'fab fa-facebook', color: '#1877F2' },
      fb: { icon: 'fab fa-facebook', color: '#1877F2' },
      twitter: { icon: 'fab fa-twitter', color: '#1DA1F2' },
      x: { icon: 'fab fa-twitter', color: '#000000' },
      youtube: { icon: 'fab fa-youtube', color: '#FF0000' },
      yt: { icon: 'fab fa-youtube', color: '#FF0000' },
      tiktok: { icon: 'fab fa-tiktok', color: '#000000' },
      snapchat: { icon: 'fab fa-snapchat', color: '#FFFC00' },
      snap: { icon: 'fab fa-snapchat', color: '#FFFC00' },
      pinterest: { icon: 'fab fa-pinterest', color: '#E60023' },
      reddit: { icon: 'fab fa-reddit', color: '#FF4500' },
      
      // Messaging
      whatsapp: { icon: 'fab fa-whatsapp', color: '#25D366' },
      whatsap: { icon: 'fab fa-whatsapp', color: '#25D366' },
      telegram: { icon: 'fab fa-telegram', color: '#26A5E4' },
      discord: { icon: 'fab fa-discord', color: '#5865F2' },
      slack: { icon: 'fab fa-slack', color: '#4A154B' },
      skype: { icon: 'fab fa-skype', color: '#00AFF0' },
      
      // Coding Platforms
      codeforces: { icon: 'fas fa-code', color: '#1F8ACB' },
      codeforce: { icon: 'fas fa-code', color: '#1F8ACB' },
      leetcode: { icon: 'fas fa-laptop-code', color: '#FFA116' },
      leet: { icon: 'fas fa-laptop-code', color: '#FFA116' },
      hackerrank: { icon: 'fab fa-hackerrank', color: '#2EC866' },
      hacker: { icon: 'fab fa-hackerrank', color: '#2EC866' },
      codechef: { icon: 'fas fa-utensils', color: '#5B4638' },
      stackoverflow: { icon: 'fab fa-stack-overflow', color: '#F58025' },
      stackexchange: { icon: 'fab fa-stack-exchange', color: '#1E5397' },
      codepen: { icon: 'fab fa-codepen', color: '#000000' },
      
      // Development
      gitlab: { icon: 'fab fa-gitlab', color: '#FC6D26' },
      bitbucket: { icon: 'fab fa-bitbucket', color: '#0052CC' },
      
      // Design
      behance: { icon: 'fab fa-behance', color: '#1769FF' },
      dribbble: { icon: 'fab fa-dribbble', color: '#EA4C89' },
      figma: { icon: 'fab fa-figma', color: '#F24E1E' },
      
      // Content/Blog
      medium: { icon: 'fab fa-medium', color: '#000000' },
      dev: { icon: 'fab fa-dev', color: '#0A0A0A' },
      devto: { icon: 'fab fa-dev', color: '#0A0A0A' },
      hashnode: { icon: 'fas fa-hashtag', color: '#2962FF' },
      
      // Streaming
      twitch: { icon: 'fab fa-twitch', color: '#9146FF' },
      
      // Email/Contact
      email: { icon: 'fas fa-envelope', color: '#EA4335' },
      gmail: { icon: 'fas fa-envelope', color: '#EA4335' },
      mail: { icon: 'fas fa-envelope', color: '#EA4335' },
      
      // Other
      website: { icon: 'fas fa-globe', color: '#4285F4' },
      site: { icon: 'fas fa-globe', color: '#4285F4' },
      portfolio: { icon: 'fas fa-briefcase', color: '#764ba2' },
    };

    // Try exact match first
    if (platformStyles[normalized]) {
      return platformStyles[normalized];
    }

    // Try partial matching - check if any key is contained in the normalized name
    // Sort keys by length (longer first) for better matching
    const sortedKeys = Object.keys(platformStyles).sort((a, b) => b.length - a.length);
    
    for (const key of sortedKeys) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return platformStyles[key];
      }
    }

    // Default style for unknown platforms
    return { icon: 'fas fa-link', color: '#667eea' };
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('https://my-portfolio-hxer.onrender.com/api/profile');
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
            <h1 className="profile-name">
              {(profile.name || 'Anonymous User').split('').map((char, index) => (
                <span 
                  key={index} 
                  className="char-wave"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>
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
                  .map((platform, index) => {
                    const style = getPlatformStyle(platform.platformName || '');
                    return (
                      <a
                        key={index}
                        href={platform.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="platform-link"
                      >
                        <div 
                          className="platform-icon" 
                          style={{ background: style.color }}
                        >
                          <i className={style.icon}></i>
                        </div>
                        <span>{platform.platformName || 'Platform ' + (index + 1)}</span>
                      </a>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
