import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Sign in to SkillSphere</h2>
          <p className="login-subtitle">Discover events that match your skills</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}
          <div className="login-form-group">
            <label htmlFor="email" className="login-label">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="login-input"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="login-form-group">
            <label htmlFor="password" className="login-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="login-input"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" disabled={loading} className="login-submit-btn">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="login-footer">
          <button type="button" onClick={() => navigate('/register')} className="login-link">
            Don't have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
