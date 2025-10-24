const express = require('express');
const axios = require('axios');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Proxy route to ML service for skill extraction
router.post('/extract-skills', auth, async (req, res) => {
  try {
    const { resume_text } = req.body;

    if (!resume_text) {
      return res.status(400).json({ message: 'Resume text is required' });
    }

    // Call ML service
    const mlResponse = await axios.post('http://localhost:8000/extract-skills', {
      resume_text
    });

    res.json(mlResponse.data);
  } catch (error) {
    console.error('ML service error:', error.message);
    res.status(500).json({ message: 'Error processing resume' });
  }
});

// Proxy route to ML service for recommendations
router.post('/recommend-events', auth, async (req, res) => {
  try {
    const { skills, user_id } = req.body;

    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ message: 'Skills array is required' });
    }

    // Call ML service
    const mlResponse = await axios.post('http://localhost:8000/recommend-events', {
      skills,
      user_id: user_id || req.user.user.id
    });

    res.json(mlResponse.data);
  } catch (error) {
    console.error('ML service error:', error.message);
    res.status(500).json({ message: 'Error getting recommendations' });
  }
});

module.exports = router;
