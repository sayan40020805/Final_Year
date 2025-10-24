const express = require('express');
const Event = require('../models/Event');
const { auth, roleAuth } = require('../middleware/auth');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const { category, status } = req.query;
    let query = {};

    if (category) query.category = category;
    if (status) query.status = status;

    const events = await Event.find(query).populate('organizer', 'name email');
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create event (organizer/admin only)
router.post('/', auth, roleAuth(['organizer', 'admin']), async (req, res) => {
  try {
    const { title, description, date, location, category, skills, maxParticipants } = req.body;

    const event = new Event({
      title,
      description,
      date,
      location,
      category,
      skills,
      maxParticipants,
      organizer: req.user.user.id,
    });

    await event.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update event (organizer/admin only)
router.put('/:id', auth, roleAuth(['organizer', 'admin']), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer or admin
    if (event.organizer.toString() !== req.user.user.id && req.user.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete event (organizer/admin only)
router.delete('/:id', auth, roleAuth(['organizer', 'admin']), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer or admin
    if (event.organizer.toString() !== req.user.user.id && req.user.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
