const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Post = require('../models/Post');
const fs = require('fs');
const path = require('path');
const Event = require('../models/Event');

const router = express.Router();

// Middleware to check admin role
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  next();
}

// Get admin dashboard data
router.get('/dashboard', auth, adminOnly, async (req, res) => {
  try {
    const alumniCount = await User.countDocuments({ role: 'alumni' });
    const postsCount = await Post.countDocuments();
    const pendingPostsCount = await Post.countDocuments({ approved: false });
    const eventsCount = await Event.countDocuments();
    
    res.json({
      alumniCount,
      postsCount,
      pendingPostsCount,
      eventsCount
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all alumni
router.get('/alumni', auth, adminOnly, async (req, res) => {
  try {
    const alumni = await User.find({ role: 'alumni' }).select('-password');
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete an alumni
router.delete('/alumni/:id', auth, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Alumni deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all posts
router.get('/posts', auth, adminOnly, async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name email');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a post
router.delete('/posts/:id', auth, adminOnly, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Approve or unapprove a post
router.patch('/posts/:id/approve', auth, adminOnly, async (req, res) => {
  try {
    const { approved } = req.body;
    const post = await Post.findByIdAndUpdate(req.params.id, { approved }, { new: true });
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a post (attachment or content)
router.put('/posts/:id', auth, adminOnly, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    // If removing attachment, delete file from server
    if (req.body.attachment === null && post.attachment) {
      const filePath = path.join(__dirname, '../..', post.attachment);
      fs.unlink(filePath, (err) => { /* ignore error if file doesn't exist */ });
      post.attachment = null;
    }
    if (req.body.attachment !== undefined && req.body.attachment !== null) post.attachment = req.body.attachment;
    if (req.body.content !== undefined) post.content = req.body.content;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Events CRUD
router.get('/events', auth, adminOnly, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/events', auth, adminOnly, async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const event = new Event({ title, description, date });
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/events/:id', auth, adminOnly, async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const event = await Event.findByIdAndUpdate(req.params.id, { title, description, date }, { new: true });
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/events/:id', auth, adminOnly, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router; 