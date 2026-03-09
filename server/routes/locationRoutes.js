import express from 'express';
import Location from '../models/Location.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET live locations
router.get('/live', auth, requireRole('admin', 'hr'), async (req, res) => {
  try {
    const locations = await Location.find({ isActive: true })
      .populate('employeeId', 'name email')
      .sort({ createdAt: -1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET location history
router.get('/history', auth, async (req, res) => {
  try {
    const { employeeId } = req.query;
    const filter = employeeId ? { employeeId } : {};
    const locations = await Location.find(filter).sort({ createdAt: -1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST update location
router.post('/update', auth, async (req, res) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
