const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const NetworkingEvent = require('../models/NetworkingEvent');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/events';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `event-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, and PNG image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

// @route   GET api/networking-events
// @desc    Get networking events (all for admin, published only for others)
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Check if user is authenticated and is admin
    const token = req.header('x-auth-token');
    let isAdmin = false;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('role');
        isAdmin = user && user.role === 'admin';
      } catch (err) {
        // Token invalid, treat as non-admin
      }
    }
    
    // Build query based on user role
    const query = isAdmin ? {} : { published: true };
    
    const events = await NetworkingEvent.find(query)
      .populate('organizer', 'name photo company designation')
      .populate('attendees.user', 'name photo company designation email')
      .sort({ startDate: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error: ' + err.message });
  }
});

// @route   GET api/networking-events/:id
// @desc    Get networking event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await NetworkingEvent.findById(req.params.id)
      .populate('organizer', 'name photo company designation')
      .populate('attendees.user', 'name photo company designation');

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/networking-events
// @desc    Create a networking event (Admin only)
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Only administrators can create events' });
    }

    const {
      title,
      description,
      eventType,
      location,
      virtualLink,
      startDate,
      endDate,
      image,
      capacity,
      speakers
    } = req.body;

    // Validate required fields
    if (!title || !description || !eventType || !startDate || !endDate) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    // Validate event type specific fields
    if ((eventType === 'In-Person' || eventType === 'Hybrid') && !location) {
      return res.status(400).json({ msg: 'Location is required for in-person or hybrid events' });
    }

    if ((eventType === 'Virtual' || eventType === 'Hybrid') && !virtualLink) {
      return res.status(400).json({ msg: 'Virtual link is required for virtual or hybrid events' });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({ msg: 'End date must be after start date' });
    }

    if (start < new Date()) {
      return res.status(400).json({ msg: 'Start date cannot be in the past' });
    }

    const newEvent = new NetworkingEvent({
      title,
      description,
      eventType,
      location,
      virtualLink,
      startDate,
      endDate,
      image,
      capacity: capacity || null,
      speakers: speakers || [],
      organizer: req.user.id,
      published: false, // Default to draft mode
      attendees: []
    });

    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error: ' + err.message });
  }
});

// @route   PUT api/networking-events/:id
// @desc    Update a networking event (Admin only)
// @access  Private (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await NetworkingEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Only administrators can update events' });
    }

    const {
      title,
      description,
      eventType,
      location,
      virtualLink,
      startDate,
      endDate,
      image,
      capacity,
      speakers
    } = req.body;

    // Validate required fields
    if (!title || !description || !eventType || !startDate || !endDate) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    // Validate event type specific fields
    if ((eventType === 'In-Person' || eventType === 'Hybrid') && !location) {
      return res.status(400).json({ msg: 'Location is required for in-person or hybrid events' });
    }

    if ((eventType === 'Virtual' || eventType === 'Hybrid') && !virtualLink) {
      return res.status(400).json({ msg: 'Virtual link is required for virtual or hybrid events' });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({ msg: 'End date must be after start date' });
    }

    // Only check for past dates if the event hasn't started yet
    if (new Date(event.startDate) > new Date() && start < new Date()) {
      return res.status(400).json({ msg: 'Start date cannot be in the past' });
    }

    // Update event fields
    event.title = title;
    event.description = description;
    event.eventType = eventType;
    event.location = location;
    event.virtualLink = virtualLink;
    event.startDate = startDate;
    event.endDate = endDate;
    if (image) event.image = image;
    event.capacity = capacity || null;
    event.speakers = speakers || [];

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).json({ msg: 'Server Error: ' + err.message });
  }
});

// @route   DELETE api/networking-events/:id
// @desc    Delete a networking event (Admin only)
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await NetworkingEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Only administrators can delete events' });
    }

    await NetworkingEvent.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).json({ msg: 'Server Error: ' + err.message });
  }
});

// @route   POST api/networking-events/upload-image
// @desc    Upload event image
// @access  Private
// router.post('/upload-image', [auth, upload.single('image')], async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ msg: 'Please upload an image file' });
//     }

//     const imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;
//     res.json({ imageUrl });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ msg: 'Server Error: ' + err.message });
//   }
// });

// @route   POST api/networking-events/:id/rsvp
// @desc    RSVP to an event
// @access  Private
router.post('/:id/rsvp', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['attending', 'declined'].includes(status)) {
      return res.status(400).json({ msg: 'Please provide a valid RSVP status' });
    }

    const event = await NetworkingEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    if (!event.published) {
      return res.status(400).json({ msg: 'Cannot RSVP to an unpublished event' });
    }

    if (new Date(event.startDate) < new Date()) {
      return res.status(400).json({ msg: 'Cannot RSVP to a past event' });
    }

    // Check if user is already in attendees list
    const attendeeIndex = event.attendees.findIndex(
      attendee => attendee.user.toString() === req.user.id
    );

    if (attendeeIndex > -1) {
      // User already has an RSVP, update it
      event.attendees[attendeeIndex].status = status;
      event.attendees[attendeeIndex].registrationDate = Date.now();
    } else {
      // Check capacity if user is attending
      if (status === 'attending' && event.capacity) {
        const currentAttendees = event.attendees.filter(a => a.status === 'attending').length;
        if (currentAttendees >= event.capacity) {
          return res.status(400).json({ msg: 'Event has reached maximum capacity' });
        }
      }

      // Add new attendee
      event.attendees.push({
        user: req.user.id,
        status,
        registrationDate: Date.now()
      });
    }

    await event.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).json({ msg: 'Server Error: ' + err.message });
  }
});

// @route   PUT api/networking-events/:id/publish
// @desc    Publish an event and send notification to alumni (Admin only)
// @access  Private (Admin only)
router.put('/:id/publish', auth, async (req, res) => {
  try {
    const event = await NetworkingEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Only administrators can publish events' });
    }

    event.published = true;
    event.notificationSent = true; // Mark that notification should be sent
    await event.save();
    
    // Here you would typically send notifications to all alumni
    // For now, we'll just mark it as sent
    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).json({ msg: 'Server Error: ' + err.message });
  }
});

// @route   GET api/networking-events/notifications
// @desc    Get events that have notifications for the logged-in user
// @access  Private
router.get('/notifications', auth, async (req, res) => {
  try {
    const events = await NetworkingEvent.find({
      published: true,
      notificationSent: true,
      startDate: { $gte: new Date() } // Only future events
    })
      .populate('organizer', 'name photo company designation')
      .sort({ startDate: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error: ' + err.message });
  }
});

// @route   GET api/networking-events/my
// @desc    Get all events created by the logged-in user
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const events = await NetworkingEvent.find({ organizer: req.user.id })
      .sort({ startDate: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/networking-events/my-rsvps
// @desc    Get all events the logged-in user has RSVP'd to
// @access  Private
router.get('/my-rsvps', auth, async (req, res) => {
  try {
    const events = await NetworkingEvent.find({
      'attendees.user': req.user.id,
      published: true
    })
      .populate('organizer', 'name photo company designation')
      .sort({ startDate: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error: ' + err.message });
  }
});

// @route   GET api/networking-events/admin/all
// @desc    Get all events with detailed attendee information (Admin only)
// @access  Private (Admin only)
router.get('/admin/all', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id).select('role');
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }

    const events = await NetworkingEvent.find({})
      .populate('organizer', 'name photo company designation email')
      .populate('attendees.user', 'name photo company designation email phone linkedin')
      .sort({ startDate: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error: ' + err.message });
  }
});

module.exports = router;