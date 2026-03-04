import express from 'express';
import Leave from '../models/Leave.js';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import { auth as protect, requireRole as authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private (Employee, HR, Admin)
router.post('/', protect, async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;
        
        let empName = req.user.name;
        if (!empName) {
            const emp = await Employee.findOne({ email: req.user.email });
            empName = emp ? emp.name : 'Unknown Employee';
        }

        const leave = await Leave.create({
            employeeId: req.user._id,
            employeeName: empName,
            leaveType,
            startDate,
            endDate,
            reason,
            status: 'pending',
        });

        res.status(201).json(leave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get my leaves
// @route   GET /api/leaves/my
// @access  Private
router.get('/my', protect, async (req, res) => { // Changed to /my to avoid conflict with /:id if needed
    try {
        const leaves = await Leave.find({ employeeId: req.user._id }).sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all leaves (Admin/HR only)
// @route   GET /api/leaves
// @access  Private (Admin, HR)
router.get('/', protect, authorize('admin', 'hr'), async (req, res) => {
    try {
        const leaves = await Leave.find({}).sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update leave status
// @route   PUT /api/leaves/:id/status
// @access  Private (Admin, HR)
router.put('/:id/status', protect, authorize('admin', 'hr'), async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;
        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: 'Leave application not found' });
        }

        leave.status = status;
        leave.approvedBy = req.user._id;
        leave.approvedByName = req.user.name;
        if (status === 'rejected') {
            leave.rejectionReason = rejectionReason;
        }

        const updatedLeave = await leave.save();
        res.json(updatedLeave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
