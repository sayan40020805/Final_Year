import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import '../styles/Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    skills: [],
    interests: [],
    department: '',
    year: '',
    resume: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/profile');
      setProfile(response.data.profile || profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillAdd = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleInterestAdd = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile({
        ...profile,
        interests: [...profile.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const handleInterestRemove = (interestToRemove) => {
    setProfile({
      ...profile,
      interests: profile.interests.filter(interest => interest !== interestToRemove)
    });
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;

    try {
      // For now, we'll extract text from the file (in production, you'd upload to server)
      const text = await resumeFile.text();
      const response = await axios.post('http://localhost:5000/api/ml/extract-skills', {
        resume_text: text
      });

      // Update profile with extracted skills
      setProfile({
        ...profile,
        skills: [...new Set([...profile.skills, ...response.data.skills])]
      });

      alert('Resume processed successfully! Skills extracted and added to your profile.');
    } catch (error) {
      console.error('Error processing resume:', error);
      alert('Error processing resume. Please try again.');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('http://localhost:5000/api/users/profile', {
        profile
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <h1 className="profile-title">My Profile</h1>
            <p className="profile-subtitle">
              Manage your skills, interests, and upload your resume for better recommendations
            </p>
          </div>

          <div className="profile-body">
            {/* Basic Info */}
            <div className="profile-form-grid">
              <div className="profile-form-group">
                <label className="profile-label">Department</label>
                <input
                  type="text"
                  value={profile.department}
                  onChange={(e) => setProfile({...profile, department: e.target.value})}
                  className="profile-input"
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div className="profile-form-group">
                <label className="profile-label">Year</label>
                <select
                  value={profile.year}
                  onChange={(e) => setProfile({...profile, year: e.target.value})}
                  className="profile-select"
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>

            {/* Skills */}
            <div className="skills-section">
              <label className="skills-label">Skills</label>
              <div className="skills-display">
                {profile.skills.map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}
                    <button
                      onClick={() => handleSkillRemove(skill)}
                      className="skill-remove-btn"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="skill-input-group">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSkillAdd()}
                  className="skill-input"
                  placeholder="Add a skill..."
                />
                <button
                  onClick={handleSkillAdd}
                  className="skill-add-btn"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Interests */}
            <div className="interests-section">
              <label className="interests-label">Interests</label>
              <div className="interests-display">
                {profile.interests.map((interest) => (
                  <span key={interest} className="interest-tag">
                    {interest}
                    <button
                      onClick={() => handleInterestRemove(interest)}
                      className="interest-remove-btn"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="interest-input-group">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleInterestAdd()}
                  className="interest-input"
                  placeholder="Add an interest..."
                />
                <button
                  onClick={handleInterestAdd}
                  className="interest-add-btn"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Resume Upload */}
            <div className="resume-section">
              <label className="resume-label">Resume</label>
              <div className="resume-upload-group">
                <input
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="resume-input"
                />
                <button
                  onClick={handleResumeUpload}
                  disabled={!resumeFile}
                  className="resume-process-btn"
                >
                  Process Resume
                </button>
              </div>
              <p className="resume-help">
                Upload your resume to automatically extract skills and improve recommendations
              </p>
            </div>

            {/* Save Button */}
            <div className="profile-actions">
              <button
                onClick={handleSave}
                disabled={saving}
                className="profile-save-btn"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
