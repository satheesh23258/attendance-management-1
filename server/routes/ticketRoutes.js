import express from 'express';
import Ticket from '../models/Ticket.js';
import Employee from '../models/Employee.js';
import { auth, requireRole } from '../middleware/auth.js';
import { logAudit } from '../utils/auditLogger.js';

const router = express.Router();

// 🎫 Get all tickets (HR/Admin)
router.get('/all', auth, requireRole('admin', 'hr'), async (req, res) => {
  try {
    const { status, priority, category } = req.query;
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    const tickets = await Ticket.find(query).sort({ status: 1, createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🎫 Get my tickets (Employee)
router.get('/my', auth, async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    if (!employee) return res.status(404).json({ message: 'Employee profile not found' });
    
    const tickets = await Ticket.find({ employeeId: employee._id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🎫 Create new ticket
router.post('/create', auth, async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    if (!employee) return res.status(404).json({ message: 'Employee profile not found' });

    const { subject, description, category, priority } = req.body;
    
    const ticket = new Ticket({
      employeeId: employee._id,
      employeeName: employee.name,
      subject,
      description,
      category,
      priority
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🎫 Update ticket (Assign/Resolve)
router.patch('/:id', auth, requireRole('admin', 'hr'), async (req, res) => {
  try {
    const { status, resolution, assignedTo } = req.body;
    const update = { status, resolution, assignedTo };
    
    if (status === 'resolved') {
      update.resolvedAt = new Date();
    }

    const ticket = await Ticket.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    await logAudit(req, 'TICKET_UPDATED', 'Support', { 
        ticketId: ticket._id, 
        newStatus: status,
        subject: ticket.subject
    });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
