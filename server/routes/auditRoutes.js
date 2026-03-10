import express from 'express';
import AuditLog from '../models/AuditLog.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// 🛡️ Feature 7: Fetch all logs (Admin Only)
router.get('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const { module, action, limit = 50 } = req.query;
    const query = {};
    
    if (module) query.module = module;
    if (action) query.action = action;

    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .populate('userId', 'name role email');
      
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get system activity stats
router.get('/stats', auth, requireRole('admin'), async (req, res) => {
    try {
        const stats = await AuditLog.aggregate([
            { $group: { _id: '$module', count: { $sum: 1 } } }
        ]);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
