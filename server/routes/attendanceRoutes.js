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

// 🗺️ Feature 3: Advanced Geo-Fencing Check-in
router.post('/check-in', auth, async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    if (!employee) return res.status(404).json({ message: 'Employee profile not found' });

    const { lat, lng } = req.body;
    const now = new Date();
    const date = now.toISOString().split('T')[0];

    // Check if remote or within geofence
    if (!employee.isRemote) {
        if (!lat || !lng) return res.status(400).json({ message: 'GPS location required for office check-in' });
        
        const dist = distanceInMeters(
            employee.officeLocation.lat,
            employee.officeLocation.lng,
            lat,
            lng
        );

        if (dist > employee.officeLocation.radius) {
            return res.status(403).json({ 
                message: `Out of bounds. You are ${Math.round(dist)}m away from office. Limit is ${employee.officeLocation.radius}m.` 
            });
        }
    }

    const checkInTime = now.toTimeString().slice(0, 8);
    const status = now.getHours() < 9 || (now.getHours() === 9 && now.getMinutes() === 0) ? 'present' : 'late';

    const record = await Attendance.findOneAndUpdate(
      { employeeId: employee._id, date },
      {
        employeeId: employee._id,
        employeeName: employee.name,
        date,
        checkIn: checkInTime,
        status,
        location: { lat, lng, address: employee.isRemote ? 'Remote' : 'Office' },
        markedBy: req.user._id,
      },
      { upsert: true, new: true }
    );

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Original Routes Rest (simplified for space)
router.post('/check-out', auth, async (req, res) => {
    try {
      const employee = await Employee.findOne({ email: req.user.email });
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const record = await Attendance.findOne({ employeeId: employee._id, date });
      if (!record) return res.status(400).json({ message: 'Check-in first' });
      record.checkOut = now.toTimeString().slice(0, 8);
      await record.save();
      res.json(record);
    } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/history', auth, async (req, res) => {
  try {
    const attendance = await Attendance.find().sort({ date: -1 });
    res.json(attendance);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/today', auth, async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const attendance = await Attendance.find({ date: today });
      res.json(attendance);
    } catch (error) { res.status(500).json({ message: error.message }); }
});

export default router;
