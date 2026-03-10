import express from 'express';
import Expense from '../models/Expense.js';
import Employee from '../models/Employee.js';
import { auth, requireRole } from '../middleware/auth.js';
import { logAudit } from '../utils/auditLogger.js';

const router = express.Router();

// 💸 Feature 1: Get all expenses (HR/Admin)
router.get('/all', auth, requireRole('admin', 'hr'), async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 💸 Feature 2: Get my expenses (Employee)
router.get('/my', auth, async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    if (!employee) return res.status(404).json({ message: 'Employee profile not found' });
    
    const expenses = await Expense.find({ employeeId: employee._id }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 💸 Feature 3: Submit new expense
router.post('/submit', auth, async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    if (!employee) return res.status(404).json({ message: 'Employee profile not found' });

    const { title, amount, category, date, receiptUrl, remark } = req.body;
    
    const newExpense = new Expense({
      employeeId: employee._id,
      employeeName: employee.name,
      title,
      amount,
      category,
      date,
      receiptUrl,
      remark
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 💸 Feature 4: Update expense status (Admin/HR)
router.patch('/status/:id', auth, requireRole('admin', 'hr'), async (req, res) => {
  try {
    const { status, remark } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { status, remark },
      { new: true }
    );

    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    
    // Log the action
    await logAudit(req, 'EXPENSE_STATUS_UPDATE', 'Expenses', {
      expenseId: expense._id,
      newStatus: status,
      employeeName: expense.employeeName
    });

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
