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
    console.error('Login error:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  console.log('Login attempt with:', { email: req.body.email });
  
  try {
    const { email, password } = req.body;
    console.log('Parsed credentials:', { email, password: '***' });
    
    // Check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ msg: 'Server configuration error' });
    }
    
    // Check for hardcoded admin login
    console.log('Checking admin credentials...');
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
          role: 'admin',
          department: 'Administration' // Adding department field as it's required in the User model
        });
        await adminUser.save();
      }
      
      const payload = { id: adminUser._id, role: adminUser.role };
      try {
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
        console.log('Admin login successful: Token generated');
        return res.json({ 
          token, 
          user: { 
            id: adminUser._id, 
            name: adminUser.name, 
            email: adminUser.email, 
            role: adminUser.role 
          } 
        });
      } catch (error) {
        console.error('Admin token generation error:', error.message);
        return res.status(500).json({ msg: 'Server error during token generation' });
      }
        }
    
    // Regular user login
    let user = await User.findOne({ email });
    if (!user) {
      console.log(`Login attempt failed: User not found with email ${email}`);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log(`Login attempt failed: Password mismatch for user ${email}`);
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
    } catch (error) {
      console.error(`Password comparison error for user ${email}:`, error.message);
      return res.status(500).json({ msg: 'Server error during authentication' });
    }

    const payload = { id: user._id, role: user.role };
    try {
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
      console.log(`Login successful: Token generated for user ${email}`);
      res.json({ 
        token, 
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        } 
      });
    } catch (error) {
      console.error(`Token generation error for user ${email}:`, error.message);
      return res.status(500).json({ msg: 'Server error during token generation' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;