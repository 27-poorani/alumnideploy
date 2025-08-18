const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Mentorship = require('../models/Mentorship');
const User = require('../models/User');

// @route   GET /api/mentorship
// @desc    Get all approved and active mentorship programs (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const mentorships = await Mentorship.find({ isActive: true, approved: true })
      .populate('mentor', 'name company designation photo')
      .sort({ createdAt: -1 });
    res.json(mentorships);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/mentorship/featured
// @desc    Get featured mentorship programs for homepage
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const mentorships = await Mentorship.find({ isActive: true, approved: true, featured: true })
      .populate('mentor', 'name company designation photo')
      .sort({ createdAt: -1 })
      .limit(6);
    res.json(mentorships);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/mentorship/:id
// @desc    Get mentorship program by ID (public if approved)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const mentorship = await Mentorship.findById(req.params.id)
      .populate('mentor', 'name company designation photo email linkedin')
      .populate('mentees.user', 'name photo');
    
    if (!mentorship) {
      return res.status(404).json({ msg: 'Mentorship program not found' });
    }

    // Only return approved mentorships for public access
    if (!mentorship.approved) {
      return res.status(404).json({ msg: 'Mentorship program not found' });
    }

    res.json(mentorship);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Mentorship program not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET /api/mentorship/auth/:id
// @desc    Get mentorship program by ID (authenticated users)
// @access  Private
router.get('/auth/:id', auth, async (req, res) => {
  try {
    console.log('Fetching authenticated mentorship details for ID:', req.params.id);
    
    const mentorship = await Mentorship.findById(req.params.id)
      .populate('mentor', 'name company designation photo email linkedin')
      .populate('mentees.user', 'name photo');
    
    if (!mentorship) {
      return res.status(404).json({ msg: 'Mentorship program not found' });
    }

    // For authenticated users, return the mentorship regardless of approval status
    // if they are the mentor, a mentee, or an admin
    const user = await User.findById(req.user.id);
    const isMentor = mentorship.mentor.toString() === req.user.id;
    const isMentee = mentorship.mentees.some(m => m.user.toString() === req.user.id);
    const isAdmin = user.role === 'admin';
    
    if (!mentorship.approved && !isMentor && !isMentee && !isAdmin) {
      return res.status(404).json({ msg: 'Mentorship program not found' });
    }

    console.log('Returning mentorship with finalThanked:', mentorship.finalThanked);
    
    res.json(mentorship);
  } catch (err) {
    console.error('Error fetching authenticated mentorship:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Mentorship program not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST /api/mentorship
// @desc    Create a mentorship program (requires admin approval)
// @access  Private (Alumni only)
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const {
      title,
      description,
      expertise,
      availability,
      maxMentees
    } = req.body;

    const newMentorship = new Mentorship({
      mentor: req.user.id,
      title,
      description,
      expertise,
      availability,
      maxMentees: maxMentees || 5,
      approved: false, // Requires admin approval
      featured: false
    });

    const mentorship = await newMentorship.save();
    res.json(mentorship);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/mentorship/:id
// @desc    Update a mentorship program
// @access  Private (Mentor only)
router.put('/:id', auth, async (req, res) => {
  try {
    const mentorship = await Mentorship.findById(req.params.id);
    
    if (!mentorship) {
      return res.status(404).json({ msg: 'Mentorship program not found' });
    }

    // Check user
    if (mentorship.mentor.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Reset approval status if content is changed
    if (req.body.title || req.body.description || req.body.expertise) {
      req.body.approved = false;
      req.body.featured = false;
    }

    const updatedMentorship = await Mentorship.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedMentorship);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/mentorship/:id
// @desc    Delete a mentorship program
// @access  Private (Mentor or Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const mentorship = await Mentorship.findById(req.params.id);
    const user = await User.findById(req.user.id);
    
    if (!mentorship) {
      return res.status(404).json({ msg: 'Mentorship program not found' });
    }

    // Check if user is mentor or admin
    if (mentorship.mentor.toString() !== req.user.id && user.role !== 'admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await mentorship.remove();
    res.json({ msg: 'Mentorship program removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/mentorship/:id/request
// @desc    Request to join a mentorship program
// @access  Private
router.post('/:id/request', auth, async (req, res) => {
  try {
    const mentorship = await Mentorship.findById(req.params.id);
    
    if (!mentorship) {
      return res.status(404).json({ msg: 'Mentorship program not found' });
    }

    if (!mentorship.approved) {
      return res.status(400).json({ msg: 'Cannot request to join an unapproved program' });
    }

    // Check if user is already a mentee
    if (mentorship.mentees.some(mentee => mentee.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Already requested or joined this program' });
    }

    // Check if program is full
    if (mentorship.currentMentees >= mentorship.maxMentees) {
      return res.status(400).json({ msg: 'This mentorship program is full' });
    }

    const { requestMessage } = req.body;

    mentorship.mentees.unshift({
      user: req.user.id,
      requestMessage
    });

    await mentorship.save();
    res.json(mentorship);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/mentorship/:id/request/:userId
// @desc    Accept or reject a mentee request
// @access  Private (Mentor only)
router.put('/:id/request/:userId', auth, async (req, res) => {
  try {
    const mentorship = await Mentorship.findById(req.params.id);
    
    if (!mentorship) {
      return res.status(404).json({ msg: 'Mentorship program not found' });
    }

    // Check if user is the mentor
    if (mentorship.mentor.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const { status } = req.body;
    
    // Find the mentee request
    const menteeIndex = mentorship.mentees.findIndex(
      mentee => mentee.user.toString() === req.params.userId
    );

    if (menteeIndex === -1) {
      return res.status(404).json({ msg: 'Mentee request not found' });
    }

    // Update status
    mentorship.mentees[menteeIndex].status = status;

    // Update current mentees count if accepted
    if (status === 'accepted') {
      mentorship.currentMentees += 1;
    }

    await mentorship.save();
    res.json(mentorship);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/mentorship/:id/approve
// @desc    Approve or feature a mentorship program (Admin only)
// @access  Private (Admin only)
router.put('/:id/approve', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { approved, featured } = req.body;
    
    const mentorship = await Mentorship.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          approved: approved !== undefined ? approved : true,
          featured: featured !== undefined ? featured : false 
        } 
      },
      { new: true }
    );

    if (!mentorship) {
      return res.status(404).json({ msg: 'Mentorship program not found' });
    }

    res.json(mentorship);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Admin: Send thank you message and propose dates
router.put('/:id/admin-message', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    const { adminMessage, proposedDates } = req.body;
    const mentorship = await Mentorship.findByIdAndUpdate(
      req.params.id,
      { $set: { adminMessage, proposedDates } },
      { new: true }
    );
    if (!mentorship) return res.status(404).json({ msg: 'Mentorship not found' });
    res.json(mentorship);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Alumni: Accept a proposed date
router.put('/:id/select-date', auth, async (req, res) => {
  try {
    console.log('Selecting date for mentorship:', req.params.id);
    
    const mentorship = await Mentorship.findById(req.params.id);
    if (!mentorship) return res.status(404).json({ msg: 'Mentorship not found' });
    
    // Only the mentor (alumni) can select a date
    if (mentorship.mentor.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const { selectedDate } = req.body;
    console.log('Selected date:', selectedDate);
    
    mentorship.selectedDate = selectedDate;
    await mentorship.save();
    
    console.log('Updated mentorship with selected date:', mentorship);
    console.log('finalThanked status:', mentorship.finalThanked);
    
    res.json(mentorship);
  } catch (err) {
    console.error('Error selecting date:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin: Send final thank you after alumni accepts a date
router.put('/:id/final-thank', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    console.log('Sending final thank you for mentorship:', req.params.id);
    
    const mentorship = await Mentorship.findByIdAndUpdate(
      req.params.id,
      { $set: { finalThanked: true } },
      { new: true }
    );
    
    if (!mentorship) return res.status(404).json({ msg: 'Mentorship not found' });
    
    console.log('Updated mentorship with finalThanked:', mentorship);
    
    res.json(mentorship);
  } catch (err) {
    console.error('Error sending final thank you:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/mentorship/user/mentor
// @desc    Get all mentorship programs where user is mentor
// @access  Private
router.get('/user/mentor', auth, async (req, res) => {
  try {
    const mentorships = await Mentorship.find({ mentor: req.user.id })
      .populate('mentees.user', 'name photo')
      .sort({ createdAt: -1 });
    res.json(mentorships);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/mentorship/user/mentee
// @desc    Get all mentorship programs where user is mentee
// @access  Private
router.get('/user/mentee', auth, async (req, res) => {
  try {
    const mentorships = await Mentorship.find({ 'mentees.user': req.user.id })
      .populate('mentor', 'name company designation photo')
      .sort({ createdAt: -1 });
    res.json(mentorships);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/mentorship/admin/pending
// @desc    Get all pending mentorship programs for admin approval
// @access  Private (Admin only)
router.get('/admin/pending', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const mentorships = await Mentorship.find({ approved: false })
      .populate('mentor', 'name company designation photo email')
      .sort({ createdAt: -1 });
    res.json(mentorships);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/mentorship/admin/with-selected-dates
// @desc    Get all approved mentorships with selected dates for admin to send final thank you
// @access  Private (Admin only)
router.get('/admin/with-selected-dates', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const mentorships = await Mentorship.find({ 
      approved: true, 
      selectedDate: { $exists: true, $ne: null },
      finalThanked: { $ne: true } // Only get mentorships that haven't been thanked yet
    })
      .populate('mentor', 'name company designation photo email')
      .sort({ createdAt: -1 });
    res.json(mentorships);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;