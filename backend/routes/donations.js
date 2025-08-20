const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Donation = require('../models/Donation');

// @route   POST api/donations
// @desc    Create a new donation
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check('amount', 'Amount is required').not().isEmpty(),
      check('amount', 'Amount must be a number').isNumeric(),
      check('purpose', 'Purpose is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      const { name, email, phone, amount, purpose, message, paymentDetails, status } = req.body;
      
      // Ensure amount is a number
      const numericAmount = Number(amount);
      if (isNaN(numericAmount)) {
        return res.status(400).json({ msg: 'Amount must be a valid number' });
      }

      const newDonation = new Donation({
        user: req.user.id,
        name,
        email,
        phone,
        amount: numericAmount, // Store as number
        purpose,
        message,
        paymentDetails,
        status: status || 'pending' // Default to pending if not provided
      });

      const donation = await newDonation.save();
      console.log(`New donation created: ${donation._id}`);

      res.status(201).json({
        msg: 'Donation created successfully',
        donation
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);

// @route   GET api/donations
// @desc    Get all donations
// @access  Private/Admin
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to view all donations' });
    }

    const donations = await Donation.find().sort({ date: -1 });
    res.json(donations);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});



// @route   GET api/donations/me
// @desc    Get current user's donations
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.user.id }).sort({ date: -1 });
    res.json(donations);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET api/donations/stats
// @desc    Get donation statistics
// @access  Private/Admin
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to view donation statistics' });
    }

    // Get total donations
    const totalDonations = await Donation.countDocuments();
    
    // Get donations by status
    const pendingDonations = await Donation.countDocuments({ status: 'pending' });
    const completedDonations = await Donation.countDocuments({ status: 'completed' });
    const rejectedDonations = await Donation.countDocuments({ status: 'rejected' });
    
    // Get total amount
    const totalAmountResult = await Donation.aggregate([
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);
    
    const totalAmount = totalAmountResult.length > 0 ? totalAmountResult[0].totalAmount : 0;
    
    // Get completed amount
    const completedAmountResult = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);
    
    const completedAmount = completedAmountResult.length > 0 ? completedAmountResult[0].totalAmount : 0;
    
    res.json({
      totalDonations,
      pendingDonations,
      completedDonations,
      rejectedDonations,
      totalAmount,
      completedAmount
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});


// @route   GET api/donations/:id
// @desc    Get donation by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ msg: 'Donation not found' });
    }

    // Check if user is admin or the donation owner
    if (donation.user.toString() !== req.user.id && user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to view this donation' });
    }

    res.json(donation);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Donation not found' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   PUT api/donations/:id
// @desc    Update donation status
// @access  Private/Admin
router.put('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to update donation status' });
    }

    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ msg: 'Donation not found' });
    }

    const { status, adminNotes } = req.body;

    if (status) donation.status = status;
    if (adminNotes) donation.adminNotes = adminNotes;

    await donation.save();
    console.log(`Donation ${donation._id} status updated to: ${status}`);

    res.json(donation);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Donation not found' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET api/donations/stats/total
// @desc    Get total donation amount
// @access  Public
router.get('/stats/total', async (req, res) => {
  try {
    // Aggregate to calculate total amount of completed donations
    const result = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);
    
    const totalAmount = result.length > 0 ? result[0].totalAmount : 0;
    
    res.json({ totalAmount });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET api/donations/stats
// @desc    Get donation statistics
// @access  Private/Admin
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to view donation statistics' });
    }

    // Get total donations
    const totalDonations = await Donation.countDocuments();
    
    // Get donations by status
    const pendingDonations = await Donation.countDocuments({ status: 'pending' });
    const completedDonations = await Donation.countDocuments({ status: 'completed' });
    const rejectedDonations = await Donation.countDocuments({ status: 'rejected' });
    
    // Get total amount
    const totalAmountResult = await Donation.aggregate([
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);
    
    const totalAmount = totalAmountResult.length > 0 ? totalAmountResult[0].totalAmount : 0;
    
    // Get completed amount
    const completedAmountResult = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);
    
    const completedAmount = completedAmountResult.length > 0 ? completedAmountResult[0].totalAmount : 0;
    
    res.json({
      totalDonations,
      pendingDonations,
      completedDonations,
      rejectedDonations,
      totalAmount,
      completedAmount
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;