const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, department, batch } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword, department, batch });
    await user.save();

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department, batch: user.batch } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Check for hardcoded admin login
    if (email === 'admin' && password === '123') {
      // Try to find or create admin user
      let adminUser = await User.findOne({ email: 'admin@alumni.com' });
      
      if (!adminUser) {
        // Create admin user if it doesn't exist
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123', salt);
        
        adminUser = new User({
          name: 'Admin',
          email: 'admin@alumni.com',
          password: hashedPassword,
          role: 'admin'
        });
        await adminUser.save();
      }
      
      const payload = { id: adminUser._id, role: adminUser.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({ 
        token, 
        user: { 
          id: adminUser._id, 
          name: adminUser.name, 
          email: adminUser.email, 
          role: adminUser.role 
        } 
      });
        }
    
    // Regular user login
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router; 