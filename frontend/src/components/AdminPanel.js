import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './AdminPanel.css';

const AdminPanel = () => {
  const messageTimeoutRef = useRef(null);
  const [profile, setProfile] = useState({
    profileImage: '',
    coverPhoto: '',
    name: '',
    dateOfBirth: '',
    fatherName: '',
    motherName: '',
    contactNumber: '',
    email: '',
    homeAddress: '',
    countries: [],
    region: '',
    education: {
      school: {
        institutionType: 'school',
        institutionName: '',
        studyPeriod: { startDate: '', endDate: '' },
        degree: '',
        result: ''
      },
      college: {
        institutionType: 'college',
        institutionName: '',
        studyPeriod: { startDate: '', endDate: '' },
        degree: '',
        result: ''
      },
      university: {
        institutionType: 'university',
        institutionName: '',
        studyPeriod: { startDate: '', endDate: '' },
        degree: '',
        result: ''
      }
    },
    sscResult: '',
    hscResult: '',
    universityResult: '',
    platforms: Array(20).fill(null).map((_, index) => ({
      serialNumber: index + 1,
      platformName: '',
      link: ''
    }))
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [coverFit, setCoverFit] = useState('cover');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const countryOptions = [
    { value: 'United States', label: 'United States' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Germany', label: 'Germany' },
    { value: 'France', label: 'France' },
    { value: 'India', label: 'India' },
    { value: 'China', label: 'China' },
    { value: 'Japan', label: 'Japan' },
    { value: 'Bangladesh', label: 'Bangladesh' },
    { value: 'Pakistan', label: 'Pakistan' },
    { value: 'Brazil', label: 'Brazil' },
    { value: 'Mexico', label: 'Mexico' },
    { value: 'South Africa', label: 'South Africa' },
    { value: 'Russia', label: 'Russia' },
    { value: 'Italy', label: 'Italy' },
    { value: 'Spain', label: 'Spain' },
    { value: 'Netherlands', label: 'Netherlands' },
    { value: 'Switzerland', label: 'Switzerland' },
    { value: 'Sweden', label: 'Sweden' },
  ];

  useEffect(() => {
    fetchProfile();
    
    // Cleanup timeout on unmount
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  const showMessage = (msg) => {
    // Clear any existing timeout
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    
    setMessage(msg);
    
    // Set new timeout to clear message
    messageTimeoutRef.current = setTimeout(() => {
      setMessage('');
      messageTimeoutRef.current = null;
    }, 2000);
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      if (response.data) {
        setProfile(response.data);
        if (response.data.profileImage) {
          setImagePreview(response.data.profileImage);
        }
        if (response.data.coverPhoto) {
          setCoverPreview(response.data.coverPhoto);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return profile.profileImage;

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post('/api/profile/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const uploadCover = async () => {
    if (!coverFile) return profile.coverPhoto;

    const formData = new FormData();
    formData.append('image', coverFile);

    try {
      const response = await axios.post('/api/profile/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading cover:', error);
      throw error;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEducationChange = (type, field, value) => {
    setProfile(prev => ({
      ...prev,
      education: {
        ...prev.education,
        [type]: {
          ...prev.education[type],
          [field]: value
        }
      }
    }));
  };

  const handleEducationDateChange = (type, dateType, value) => {
    setProfile(prev => ({
      ...prev,
      education: {
        ...prev.education,
        [type]: {
          ...prev.education[type],
          studyPeriod: {
            ...prev.education[type].studyPeriod,
            [dateType]: value
          }
        }
      }
    }));
  };

  const handlePlatformChange = (index, field, value) => {
    const newPlatforms = [...profile.platforms];
    newPlatforms[index] = {
      ...newPlatforms[index],
      [field]: value
    };
    setProfile(prev => ({
      ...prev,
      platforms: newPlatforms
    }));
  };

  const handleCountryChange = (selectedOptions) => {
    setProfile(prev => ({
      ...prev,
      countries: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let imageUrl = profile.profileImage;
      let coverUrl = profile.coverPhoto;
      
      if (imageFile) {
        imageUrl = await uploadImage();
      }
      
      if (coverFile) {
        coverUrl = await uploadCover();
      }

      const updatedProfile = {
        ...profile,
        profileImage: imageUrl,
        coverPhoto: coverUrl
      };

      await axios.post('/api/profile', updatedProfile);
      showMessage('Profile saved successfully!');
      fetchProfile();
    } catch (error) {
      showMessage('Error saving profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete the entire profile?')) {
      setLoading(true);
      try {
        await axios.delete('/api/profile');
        showMessage('Profile deleted successfully!');
        setProfile({
          profileImage: '',
          coverPhoto: '',
          name: '',
          dateOfBirth: '',
          fatherName: '',
          motherName: '',
          contactNumber: '',
          email: '',
          homeAddress: '',
          countries: [],
          region: '',
          education: {
            school: {
              institutionType: 'school',
              institutionName: '',
              studyPeriod: { startDate: '', endDate: '' },
              degree: '',
              result: ''
            },
            college: {
              institutionType: 'college',
              institutionName: '',
              studyPeriod: { startDate: '', endDate: '' },
              degree: '',
              result: ''
            },
            university: {
              institutionType: 'university',
              institutionName: '',
              studyPeriod: { startDate: '', endDate: '' },
              degree: '',
              result: ''
            }
          },
          sscResult: '',
          hscResult: '',
          universityResult: '',
          platforms: Array(20).fill(null).map((_, index) => ({
            serialNumber: index + 1,
            platformName: '',
            link: ''
          }))
        });
        setImagePreview('');
        setImageFile(null);
        setCoverPreview('');
        setCoverFile(null);
        setCoverFit('cover');
      } catch (error) {
        showMessage('Error deleting profile: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="admin-panel">
      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="admin-header">
        <h1>Portfolio Admin Panel</h1>
        <p>Manage your portfolio information</p>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {/* Profile Image */}
        <div className="form-section">
          <h2>Profile Image</h2>
          <div className="image-upload">
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Profile Preview" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
          </div>
        </div>

        {/* Cover Photo */}
        <div className="form-section">
          <h2>Cover Photo</h2>
          <div className="image-upload">
            {coverPreview && (
              <div className="cover-preview">
                <img 
                  src={coverPreview} 
                  alt="Cover Preview" 
                  style={{ objectFit: coverFit }}
                />
                <div className="resize-controls">
                  <label>
                    <input 
                      type="radio" 
                      name="coverFit" 
                      value="cover"
                      checked={coverFit === 'cover'}
                      onChange={(e) => setCoverFit(e.target.value)}
                    />
                    Fill (Crop to fit)
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="coverFit" 
                      value="contain"
                      checked={coverFit === 'contain'}
                      onChange={(e) => setCoverFit(e.target.value)}
                    />
                    Fit (Show all)
                  </label>
                </div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="file-input"
            />
            <p className="file-hint">Recommended size: 1640 x 624 pixels</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="form-section">
          <h2>Personal Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Father's Name</label>
              <input
                type="text"
                name="fatherName"
                value={profile.fatherName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Mother's Name</label>
              <input
                type="text"
                name="motherName"
                value={profile.motherName}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="form-section">
          <h2>Contact Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={profile.contactNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group full-width">
              <label>Home Address</label>
              <textarea
                name="homeAddress"
                value={profile.homeAddress}
                onChange={handleInputChange}
                rows="3"
              />
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="form-section">
          <h2>Location Information</h2>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Countries</label>
              <Select
                isMulti
                options={countryOptions}
                value={countryOptions.filter(option => 
                  profile.countries.includes(option.value)
                )}
                onChange={handleCountryChange}
                className="country-select"
              />
            </div>
            <div className="form-group full-width">
              <label>Region</label>
              <input
                type="text"
                name="region"
                value={profile.region}
                onChange={handleInputChange}
                placeholder="e.g., Dhaka, California, etc."
              />
            </div>
          </div>
        </div>

        {/* Education - School */}
        <div className="form-section">
          <h2>School Education</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>School Name</label>
              <input
                type="text"
                value={profile.education.school.institutionName}
                onChange={(e) => handleEducationChange('school', 'institutionName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={profile.education.school.studyPeriod.startDate ? 
                  profile.education.school.studyPeriod.startDate.split('T')[0] : ''}
                onChange={(e) => handleEducationDateChange('school', 'startDate', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={profile.education.school.studyPeriod.endDate ? 
                  profile.education.school.studyPeriod.endDate.split('T')[0] : ''}
                onChange={(e) => handleEducationDateChange('school', 'endDate', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>SSC Result</label>
              <input
                type="text"
                name="sscResult"
                value={profile.sscResult}
                onChange={handleInputChange}
                placeholder="e.g., GPA 5.00"
              />
            </div>
          </div>
        </div>

        {/* Education - College */}
        <div className="form-section">
          <h2>College Education</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>College Name</label>
              <input
                type="text"
                value={profile.education.college.institutionName}
                onChange={(e) => handleEducationChange('college', 'institutionName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={profile.education.college.studyPeriod.startDate ? 
                  profile.education.college.studyPeriod.startDate.split('T')[0] : ''}
                onChange={(e) => handleEducationDateChange('college', 'startDate', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={profile.education.college.studyPeriod.endDate ? 
                  profile.education.college.studyPeriod.endDate.split('T')[0] : ''}
                onChange={(e) => handleEducationDateChange('college', 'endDate', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>HSC Result</label>
              <input
                type="text"
                name="hscResult"
                value={profile.hscResult}
                onChange={handleInputChange}
                placeholder="e.g., GPA 5.00"
              />
            </div>
          </div>
        </div>

        {/* Education - University */}
        <div className="form-section">
          <h2>University Education</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>University Name</label>
              <input
                type="text"
                value={profile.education.university.institutionName}
                onChange={(e) => handleEducationChange('university', 'institutionName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Degree</label>
              <input
                type="text"
                value={profile.education.university.degree}
                onChange={(e) => handleEducationChange('university', 'degree', e.target.value)}
                placeholder="e.g., B.Sc. in Computer Science"
              />
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={profile.education.university.studyPeriod.startDate ? 
                  profile.education.university.studyPeriod.startDate.split('T')[0] : ''}
                onChange={(e) => handleEducationDateChange('university', 'startDate', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={profile.education.university.studyPeriod.endDate ? 
                  profile.education.university.studyPeriod.endDate.split('T')[0] : ''}
                onChange={(e) => handleEducationDateChange('university', 'endDate', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>University Result</label>
              <input
                type="text"
                name="universityResult"
                value={profile.universityResult}
                onChange={handleInputChange}
                placeholder="e.g., CGPA 3.75"
              />
            </div>
          </div>
        </div>

        {/* Social Media Platforms */}
        <div className="form-section">
          <h2>Social Media Platforms (20 Platforms)</h2>
          <div className="platforms-grid">
            {profile.platforms.map((platform, index) => (
              <div key={index} className="platform-item">
                <div className="platform-number">{index + 1}</div>
                <div className="platform-fields">
                  <input
                    type="text"
                    placeholder="Platform Name"
                    value={platform.platformName}
                    onChange={(e) => handlePlatformChange(index, 'platformName', e.target.value)}
                  />
                  <input
                    type="url"
                    placeholder="Platform Link/URL"
                    value={platform.link}
                    onChange={(e) => handlePlatformChange(index, 'link', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
          <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={loading}>
            Delete Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPanel;
