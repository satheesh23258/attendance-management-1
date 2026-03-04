import express from 'express';
import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';
import Notification from '../models/Notification.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// utility: Haversine distance in meters
const distanceInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Admin/HR – mark attendance for an employee
router.post('/mark', auth, requireRole('admin', 'hr'), async (req, res) => {
  try {
    const {
      employeeId,
      officeLat,
      officeLng,
      radiusMeters,
      allowedStartTime, // 'HH:mm'
      checkInTime,
      statusOverride,
    } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const now = checkInTime ? new Date(checkInTime) : new Date();
    const date = now.toISOString().split('T')[0];

    // For now, we expect employee.location to contain last known location if stored
    const loc = employee.currentLocation || employee.location || null;
    let status = 'absent';

    const allowedStatuses = ['present', 'late', 'absent'];

    if (statusOverride && allowedStatuses.includes(statusOverride)) {
      // Manual override from Admin/HR
      status = statusOverride;
    } else if (loc && officeLat != null && officeLng != null && radiusMeters != null) {
      const dist = distanceInMeters(
        officeLat,
        officeLng,
        loc.lat,
        loc.lng
      );
      if (dist <= radiusMeters) {
        if (allowedStartTime) {
          const [h, m] = allowedStartTime.split(':').map(Number);
          const allowed = new Date(now);
          allowed.setHours(h, m, 0, 0);
          status = now <= allowed ? 'present' : 'late';
        } else {
          status = 'present';
        }
      } else {
        status = 'absent';
      }
    }

    const record = await Attendance.findOneAndUpdate(
      { employeeId: employee._id, date },
      {
        employeeId: employee._id,
        employeeName: employee.name,
        date,
        checkIn: now.toTimeString().slice(0, 8),
        status,
        location: loc || undefined,
        markedBy: req.user._id,
      },
      { upsert: true, new: true }
    );

    // Create an in-app notification for the employee
    try {
      const notif = await Notification.create({
        title: `Attendance ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `${req.user.name || 'Admin/HR'} marked your attendance as ${status} for ${date}`,
        type: 'attendance',
        isRead: false,
        actionUrl: '/attendance',
        userId: employee._id,
      });
      // Include notification id in response for convenience
      res.json({ record, notification: notif });
    } catch (notifErr) {
      // If notification creation fails, still return attendance record
      console.error('Failed to create notification:', notifErr);
      res.json({ record });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Employee check-in
router.post('/check-in', auth, async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const now = new Date();
    const date = now.toISOString().split('T')[0];

    let existingRecord = await Attendance.findOne({ employeeId: employee._id, date });
    if (existingRecord && existingRecord.checkIn) {
      return res.status(400).json({ message: 'Already checked in for today' });
    }

    const checkInTime = now.toTimeString().slice(0, 8);
    // Simple logic: Assuming 09:00:00 is the threshold for 'present' vs 'late'.
    const status = now.getHours() < 9 || (now.getHours() === 9 && now.getMinutes() === 0) ? 'present' : 'late';

    const record = await Attendance.findOneAndUpdate(
      { employeeId: employee._id, date },
      {
        employeeId: employee._id,
        employeeName: employee.name,
        date,
        checkIn: checkInTime,
        status,
        markedBy: req.user._id, // self marked
      },
      { upsert: true, new: true }
    );

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Employee check-out
router.post('/check-out', auth, async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const now = new Date();
    const date = now.toISOString().split('T')[0];

    const record = await Attendance.findOne({ employeeId: employee._id, date });
    if (!record) {
      return res.status(400).json({ message: 'Must check in first' });
    }
    if (record.checkOut) {
      return res.status(400).json({ message: 'Already checked out for today' });
    }

    record.checkOut = now.toTimeString().slice(0, 8);

    // Calculate duration
    const checkInDate = new Date(`${date}T${record.checkIn}`);
    const checkOutDate = new Date(`${date}T${record.checkOut}`);
    const diffMs = checkOutDate - checkInDate;
    if (diffMs > 0) {
      record.workingHours = Number((diffMs / (1000 * 60 * 60)).toFixed(2));
    }

    await record.save();
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET attendance history
// GET my attendance history (for logged in user)
router.get('/my-history', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const employee = await Employee.findOne({ email: req.user.email });

    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const filter = { employeeId: employee._id };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }

    const attendance = await Attendance.find(filter).sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET attendance history (Admin/HR can see all, Employee limited to self)
router.get('/history', auth, async (req, res) => {
  try {
    let { employeeId, startDate, endDate } = req.query;
    const filter = {};

    // If user is employee, they can only see their own attendance
    // (This fallback remains, but /my-history is preferred for self)
    if (req.user.role === 'employee') {
      const employee = await Employee.findOne({ email: req.user.email });
      if (!employee) {
        return res.status(404).json({ message: 'Employee profile not found' });
      }
      filter.employeeId = employee._id;
    } else if (employeeId) {
      // Admin/HR can query for specific employee
      filter.employeeId = employeeId;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }
    const attendance = await Attendance.find(filter).sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET today's attendance
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const attendance = await Attendance.find({ date: today });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET stats
router.get('/stats', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const presentToday = await Attendance.countDocuments({
      date: today,
      status: { $in: ['present', 'late'] },
    });
    const totalEmployees = await Employee.countDocuments({ isActive: true });
    res.json({
      presentToday,
      absentToday: totalEmployees - presentToday,
      totalEmployees,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an attendance record (Admin/HR only)
router.put('/:id', auth, requireRole('admin', 'hr'), async (req, res) => {
  try {
    const updated = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Attendance not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an attendance record (Admin/HR only)
router.delete('/:id', auth, requireRole('admin', 'hr'), async (req, res) => {
  try {
    const deleted = await Attendance.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Attendance not found' });
    }
    res.json({ message: 'Attendance deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
