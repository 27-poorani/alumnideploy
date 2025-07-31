const express = require('express');
const TopStudent = require('../models/TopStudent');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Middleware to check admin role
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  next();
}

// GET all top students (public)
router.get('/', async (req, res) => {
  try {
    const students = await TopStudent.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ADD a top student (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { name, company, package: pkg, batch, photo } = req.body;
    const student = new TopStudent({ name, company, package: pkg, batch, photo });
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Upload photo for top student (admin only)
router.post('/upload-photo', auth, adminOnly, upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  // Return the relative path or URL to the uploaded file
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// UPDATE a top student (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { name, company, package: pkg, batch, photo } = req.body;
    const student = await TopStudent.findByIdAndUpdate(
      req.params.id,
      { name, company, package: pkg, batch, photo },
      { new: true }
    );
    res.json(student);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE a top student (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await TopStudent.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router; 