import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Messenger from './Messenger';
import './Contact.css';

const Contact = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const getPlatformIcon = (platformName) => {
    if (!platformName) return 'fas fa-link';
    
    const normalized = platformName.toLowerCase().replace(/[\s\-_.]/g, '');
    
    const iconMap = {
      linkedin: 'fab fa-linkedin',
      facebook: 'fab fa-facebook',
      twitter: 'fab fa-twitter',
      github: 'fab fa-github',
      instagram: 'fab fa-instagram',
      youtube: 'fab fa-youtube',
      whatsapp: 'fab fa-whatsapp',
      telegram: 'fab fa-telegram',
      discord: 'fab fa-discord',
    };

    for (const [key, icon] of Object.entries(iconMap)) {
      if (normalized.includes(key)) {
        return icon;
      }
    }
    
    return 'fas fa-link';
  };

  const getLinkedInProfile = () => {
    if (!profile?.platforms) return null;
    const linkedin = profile.platforms.find(p => 
      p?.platformName && p?.link && (
        p.platformName.toLowerCase().includes('linkedin') ||
        p.platformName.toLowerCase().includes('linkdin')
      )
    );
    return linkedin;
  };

  const getFacebookProfile = () => {
    if (!profile?.platforms) return null;
    const facebook = profile.platforms.find(p => 
      p?.platformName && p?.link && (
        p.platformName.toLowerCase().includes('facebook') ||
        p.platformName.toLowerCase().includes('fb')
      )
    );
    return facebook;
  };

  const getInstagramProfile = () => {
    if (!profile?.platforms) return null;
    const instagram = profile.platforms.find(p => 
      p?.platformName && p?.link && (
        p.platformName.toLowerCase().includes('instagram') ||
        p.platformName.toLowerCase().includes('insta') ||
        p.platformName.toLowerCase().includes('istagram') ||
        p.platformName.toLowerCase().includes('instagr')
      )
    );
    return instagram;
  };

  const getTwitterProfile = () => {
    if (!profile?.platforms) return null;
    const twitter = profile.platforms.find(p => 
      p?.platformName && p?.link && (
        p.platformName.toLowerCase().includes('twitter') ||
        p.platformName.toLowerCase() === 'x'
      )
    );
    return twitter;
  };

  if (loading) {
    return (
      <div className="contact-loading">
        <div className="spinner"></div>
        <p>Loading contact information...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="contact-empty">
        <h2>No Contact Information</h2>
        <p>Please add your contact information in the admin panel.</p>
      </div>
    );
  }

  const linkedInProfile = getLinkedInProfile();
  const facebookProfile = getFacebookProfile();
  const instagramProfile = getInstagramProfile();
  const twitterProfile = getTwitterProfile();

  return (
    <div className="contact-container">
      {/* Profile Header */}
      {profile && (
        <div className="contact-profile-header">
          <div className="contact-profile-image">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt={profile.name} />
            ) : (
              <div className="contact-profile-placeholder">
                {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
              </div>
            )}
          </div>
          <div className="contact-profile-info">
            <h1>{profile.name || 'Anonymous'}</h1>
            {profile.region && (
              <p className="contact-location">
                <i className="fas fa-map-marker-alt"></i> {profile.region}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Contact Header */}
      <div className="contact-header">
        <h2>Get In Touch</h2>
        <p>Feel free to reach out through any of the following channels</p>
      </div>

      {/* Contact Cards */}
      <div className="contact-cards">
        {/* Gmail */}
        {profile.gmail && (
          <div className="contact-card">
            <div className="contact-icon gmail">
              <i className="fas fa-envelope"></i>
            </div>
            <div className="contact-card-content">
              <h3>Gmail</h3>
              <a href={`mailto:${profile.gmail}`} className="contact-link">
                {profile.gmail}
              </a>
            </div>
          </div>
        )}

        {/* Email */}
        {profile.email && (
          <div className="contact-card">
            <div className="contact-icon email">
              <i className="fas fa-envelope"></i>
            </div>
            <div className="contact-card-content">
              <h3>Email</h3>
              <a href={`mailto:${profile.email}`} className="contact-link">
                {profile.email}
              </a>
            </div>
          </div>
        )}

        {/* WhatsApp */}
        {profile.whatsapp && (
          <div className="contact-card">
            <div className="contact-icon whatsapp">
              <i className="fab fa-whatsapp"></i>
            </div>
            <div className="contact-card-content">
              <h3>WhatsApp</h3>
              <a 
                href={`https://wa.me/${profile.whatsapp.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                {profile.whatsapp}
              </a>
            </div>
          </div>
        )}

        {/* Contact Number */}
        {profile.contactNumber && (
          <div className="contact-card">
            <div className="contact-icon phone">
              <i className="fas fa-phone"></i>
            </div>
            <div className="contact-card-content">
              <h3>Phone</h3>
              <a href={`tel:${profile.contactNumber}`} className="contact-link">
                {profile.contactNumber}
              </a>
            </div>
          </div>
        )}

        {/* LinkedIn */}
        {linkedInProfile && linkedInProfile.link && (
          <div className="contact-card">
            <div className="contact-icon linkedin">
              <i className="fab fa-linkedin"></i>
            </div>
            <div className="contact-card-content">
              <h3>LinkedIn</h3>
              <a 
                href={linkedInProfile.link}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                View Profile
              </a>
            </div>
          </div>
        )}

        {/* Facebook */}
        {facebookProfile && facebookProfile.link && (
          <div className="contact-card">
            <div className="contact-icon facebook">
              <i className="fab fa-facebook"></i>
            </div>
            <div className="contact-card-content">
              <h3>Facebook</h3>
              <a 
                href={facebookProfile.link}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                View Profile
              </a>
            </div>
          </div>
        )}

        {/* Instagram */}
        {instagramProfile && instagramProfile.link && (
          <div className="contact-card">
            <div className="contact-icon instagram">
              <i className="fab fa-instagram"></i>
            </div>
            <div className="contact-card-content">
              <h3>Instagram</h3>
              <a 
                href={instagramProfile.link}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                View Profile
              </a>
            </div>
          </div>
        )}

        {/* Twitter */}
        {twitterProfile && twitterProfile.link && (
          <div className="contact-card">
            <div className="contact-icon twitter">
              <i className="fab fa-twitter"></i>
            </div>
            <div className="contact-card-content">
              <h3>Twitter</h3>
              <a 
                href={twitterProfile.link}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                View Profile
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Messaging Section */}
      <div className="messaging-section">
        <Messenger />
      </div>
    </div>
  );
};

export default Contact;
