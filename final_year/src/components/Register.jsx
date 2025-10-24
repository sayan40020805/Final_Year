import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student', // default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    const result = await register(userData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2 className="register-title">Create your SkillSphere account</h2>
          <p className="register-subtitle">Join the community and discover personalized events</p>
        </div>
        <form className="register-form" onSubmit={handleSubmit}>
          {error && <div className="register-error">{error}</div>}
          <div className="register-form-group">
            <label htmlFor="name" className="register-label">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="register-input"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="register-form-group">
            <label htmlFor="email" className="register-label">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="register-input"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="register-form-group">
            <label htmlFor="role" className="register-label">Role</label>
            <select
              id="role"
              name="role"
              className="register-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="organizer">Event Organizer</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div className="register-form-group">
            <label htmlFor="password" className="register-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="register-input"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="register-form-group">
            <label htmlFor="confirmPassword" className="register-label">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="register-input"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <button type="submit" disabled={loading} className="register-submit-btn">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <div className="register-footer">
          <button type="button" onClick={() => navigate('/login')} className="register-link">
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
