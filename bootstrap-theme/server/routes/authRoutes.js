const express = require('express');
const User = require('../models/User');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');
const jwt = require('jsonwebtoken');

const router = express.Router();

const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('jwt', token, options).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      notificationsEnabled: user.notificationsEnabled
    }
  });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if email exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }
    
    const user = await User.create({ name, email, password });
    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(400).json({ success: false, error: 'Please provide valid details.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  res.cookie('jwt', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  
  res.status(200).json({ success: true, data: {} });
});

// Get Current Logged In User
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
});

// Update User details / settings
router.put('/update', protect, async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name || req.user.name,
      email: req.body.email || req.user.email,
    };
    if (req.body.notificationsEnabled !== undefined) {
      fieldsToUpdate.notificationsEnabled = req.body.notificationsEnabled;
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: 'Update Failed' });
  }
});

// Change Password
router.put('/updatepassword', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({ success: false, error: 'Password incorrect' });
    }
        
    user.password = req.body.newPassword;
    await user.save();
    
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, error: 'Failed to update password' });
  }
});

// Delete account
router.delete('/delete', protect, async (req, res) => {
  try {
    await Task.deleteMany({ owner: req.user.id });
    const user = await User.findById(req.user.id);
    await user.deleteOne();
    
    res.cookie('jwt', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
        
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete' });
  }
});

module.exports = router;
