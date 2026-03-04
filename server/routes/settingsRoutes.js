import express from 'express';
import UserSettings from '../models/UserSettings.js';
import SystemSettings from '../models/SystemSettings.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET User Settings
router.get('/user', auth, async (req, res) => {
  try {
    let settings = await UserSettings.findOne({ userId: req.user._id });
    if (!settings) {
      settings = await UserSettings.create({ userId: req.user._id });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT User Settings
router.put('/user', auth, async (req, res) => {
  try {
    // Prevent updating userId intentionally
    delete req.body.userId;
    
    let settings = await UserSettings.findOneAndUpdate(
      { userId: req.user._id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET System Settings (All can view, admin/hr manages)
router.get('/system', auth, async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT System Settings (Admin / HR only)
router.put('/system', auth, requireRole('admin', 'hr'), async (req, res) => {
  try {
    let settings = await SystemSettings.getSettings();
    
    // Only allow updating certain fields based on requirements
    if (req.body.company) settings.company = { ...settings.company, ...req.body.company };
    if (req.body.attendance) settings.attendance = { ...settings.attendance, ...req.body.attendance };
    if (req.body.leave) settings.leave = { ...settings.leave, ...req.body.leave };
    if (req.body.announcements) settings.announcements = { ...settings.announcements, ...req.body.announcements };
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
