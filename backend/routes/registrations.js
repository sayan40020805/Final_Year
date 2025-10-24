const express = require('express');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register for event
router.post('/', auth, async (req, res) => {
  try {
    const { eventId } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      user: req.user.user.id,
      event: eventId,
    });
    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Check max participants
    if (event.maxParticipants && event.registeredUsers.length >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Create registration
    const registration = new Registration({
      user: req.user.user.id,
      event: eventId,
    });

    await registration.save();

    // Add user to event's registered users
    event.registeredUsers.push(req.user.user.id);
    await event.save();

    res.json({ message: 'Registered successfully', registration });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user's registrations
router.get('/my', auth, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.user.id })
      .populate('event')
      .sort({ registeredAt: -1 });
    res.json(registrations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Cancel registration
router.delete('/:id', auth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check if user owns the registration
    if (registration.user.toString() !== req.user.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Remove user from event's registered users
    await Event.findByIdAndUpdate(registration.event, {
      $pull: { registeredUsers: req.user.user.id },
    });

    await Registration.findByIdAndDelete(req.params.id);
    res.json({ message: 'Registration cancelled' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
