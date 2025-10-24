import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    fetchEvents();
    fetchRecommendations();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      // Get user profile to extract skills
      const profileResponse = await axios.get('http://localhost:5000/api/users/profile');
      const userSkills = profileResponse.data.profile?.skills || [];

      if (userSkills.length > 0) {
        // Call ML service for recommendations
        const recResponse = await axios.post('http://localhost:5000/api/ml/recommend-events', {
          skills: userSkills,
          user_id: user.id
        });
        setRecommendations(recResponse.data.recommendations || []);
      } else {
        // Show sample recommendations if no skills
        setRecommendations([
          {
            event_id: 1,
            title: 'AI Hackathon',
            similarity_score: 0.85,
            matching_skills: ['python', 'machine learning']
          },
          {
            event_id: 2,
            title: 'Web Development Workshop',
            similarity_score: 0.72,
            matching_skills: ['javascript', 'react']
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Fallback to sample data
      setRecommendations([
        {
          event_id: 1,
          title: 'AI Hackathon',
          similarity_score: 0.85,
          matching_skills: ['python', 'machine learning']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const registerForEvent = async (eventId) => {
    try {
      await axios.post(`http://localhost:5000/api/registrations`, { eventId });
      alert('Successfully registered for the event!');
      fetchEvents(); // Refresh events
    } catch (error) {
      alert('Failed to register for the event');
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
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div>
            <h1 className="dashboard-title">SkillSphere</h1>
          </div>
          <div className="dashboard-user-info">
            <span className="dashboard-user-greeting">Welcome, {user?.name || 'User'}</span>
            <div className="dashboard-actions">
              <button
                onClick={() => window.location.href = '/profile'}
                className="btn btn-primary"
              >
                Profile
              </button>
              <button
                onClick={logout}
                className="btn btn-danger"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Tabs */}
        <div className="dashboard-tabs">
          <nav className="dashboard-tab-list">
            <button
              onClick={() => setActiveTab('events')}
              className={`dashboard-tab ${activeTab === 'events' ? 'active' : ''}`}
            >
              All Events
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`dashboard-tab ${activeTab === 'recommendations' ? 'active' : ''}`}
            >
              Recommended for You
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'events' && (
          <div className="dashboard-content">
            {events.map((event) => (
              <div key={event._id} className="event-card">
                <div className="event-card-header">
                  <h3 className="event-card-title">{event.title}</h3>
                  <p className="event-card-description">{event.description}</p>
                  <span className="event-card-category">{event.category}</span>
                </div>
                <div className="event-card-footer">
                  <span className="event-card-date">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => registerForEvent(event._id)}
                    className="btn btn-primary"
                  >
                    Register
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="dashboard-content">
            {recommendations.map((rec) => (
              <div key={rec.event_id || rec.id} className="recommendation-card">
                <div className="recommendation-card-header">
                  <h3 className="recommendation-card-title">{rec.title}</h3>
                  <p className="recommendation-card-score">
                    Similarity Score: {(rec.similarity_score * 100).toFixed(1)}%
                  </p>
                  <div className="recommendation-skills">
                    <span className="recommendation-skills-label">Matching skills:</span>
                    <div className="skill-tags">
                      {rec.matching_skills.map((skill) => (
                        <span key={skill} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="recommendation-card-footer">
                  <button className="btn btn-primary">
                    Register
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
