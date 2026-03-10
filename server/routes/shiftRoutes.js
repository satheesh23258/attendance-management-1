import express from 'express';
import Shift from '../models/Shift.js';
import { auth, requireRole } from '../middleware/auth.js';
import { logAudit } from '../utils/auditLogger.js';

const router = express.Router();

// 📅 Get all shifts (HR/Admin)
router.get('/all', auth, requireRole('admin', 'hr'), async (req, res) => {
  try {
    const { start, end } = req.query; // Expecting ISO strings
    const query = {};
    if (start && end) {
      query.date = { $gte: new Date(start), $lte: new Date(end) };
    }
    
    const shifts = await Shift.find(query).sort({ date: 1, startTime: 1 });
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📅 Get my shift roster (Employee)
router.get('/my', auth, async (req, res) => {
  try {
    const { start, end } = req.query;
    const query = { employeeId: req.user.employeeId };
    if (start && end) {
      query.date = { $gte: new Date(start), $lte: new Date(end) };
    }
    
    const shifts = await Shift.find(query).sort({ date: 1 });
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📅 Create/Assign shift (Admin/HR)
router.post('/assign', auth, requireRole('admin', 'hr'), async (req, res) => {
  try {
    const { employeeId, employeeName, date, startTime, endTime, title, color, notes } = req.body;
    
    // Check if overlap exists (simple date check for roster)
    const existing = await Shift.findOne({ employeeId, date: new Date(date) });
    if (existing) return res.status(400).json({ message: 'A shift is already assigned for this date.' });

    const shift = new Shift({
      employeeId,
      employeeName,
      date,
      startTime,
      endTime,
      title,
      color,
      notes
    });

    await shift.save();
    
    // Log Audit
    await logAudit(req, 'SHIFT_ASSIGNED', 'Roster', { 
        to: employeeName, 
        date, 
        times: `${startTime}-${endTime}` 
    });

    res.status(201).json(shift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📅 Bulk assign (Optional utility)
router.post('/bulk-assign', auth, requireRole('admin', 'hr'), async (req, res) => {
    try {
        const { shifts } = req.body; // Array of shift objects
        if (!Array.isArray(shifts)) return res.status(400).json({ message: 'Invalid payload' });
        
        const created = await Shift.insertMany(shifts, { ordered: false });
        res.status(201).json(created);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📅 Delete shift
router.delete('/:id', auth, requireRole('admin', 'hr'), async (req, res) => {
  try {
    const shift = await Shift.findByIdAndDelete(req.params.id);
    if (!shift) return res.status(404).json({ message: 'Shift not found' });
    
    await logAudit(req, 'SHIFT_REMOVED', 'Roster', { 
        from: shift.employeeName, 
        date: shift.date 
    });
    
    res.json({ message: 'Shift removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
