import express from 'express';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import { sendEmail } from '../utils/smsService.js';

const router = express.Router();

// GET pending admins
router.get('/pending-admins', async (req, res) => {
  try {
    const pendingAdmins = await User.find({ role: 'admin', status: 'pending' }).select('-password');
    res.json(pendingAdmins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH approve admin
router.patch('/:id/approve', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'admin' || user.status !== 'pending') {
      return res.status(400).json({ message: 'User is not a pending admin' });
    }

    user.status = 'active';
    await user.save();

    // Also update the associate employee record if it exists
    await Employee.findOneAndUpdate(
      { email: user.email },
      { isActive: true }
    );

    // Send mock email
    if (user.email) {
      await sendEmail(user.email, 'Account Approved', 'Your Admin account has been approved. You can now log in.');
    }

    res.json({ message: 'Admin approved successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH reject admin
router.patch('/:id/reject', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (user.role !== 'admin' || user.status !== 'pending') {
      return res.status(400).json({ message: 'User is not a pending admin' });
    }

    user.status = 'inactive';
    await user.save();

    if (user.email) {
      await sendEmail(user.email, 'Account Rejected', 'Your Admin account request has been rejected.');
    }

    res.json({ message: 'Admin rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
