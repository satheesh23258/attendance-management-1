import express from 'express';
import Payroll from '../models/Payroll.js';
import Employee from '../models/Employee.js';
import Expense from '../models/Expense.js';
import { auth, requireRole } from '../middleware/auth.js';
import { logAudit } from '../utils/auditLogger.js';

const router = express.Router();

// 💰 Get all payrolls for HR/Admin
router.get('/all', auth, requireRole('admin', 'hr'), async (req, res) => {
  try {
    const { year, month } = req.query;
    const query = {};
    if (year) query.year = parseInt(year);
    if (month) query.month = parseInt(month);

    const payrolls = await Payroll.find(query).sort({ year: -1, month: -1 });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 💰 Get my payroll (Employee)
router.get('/my', auth, async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    if (!employee) return res.status(404).json({ message: 'Employee profile not found' });
    
    const payrolls = await Payroll.find({ employeeId: employee._id }).sort({ year: -1, month: -1 });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 💰 Generate payroll for a month
router.post('/generate', auth, requireRole('admin', 'hr'), async (req, res) => {
  try {
    const { month, year } = req.body;
    if (!month || !year) return res.status(400).json({ message: 'Month and Year required' });

    const employees = await Employee.find({ status: 'active' });
    const generated = [];

    for (const emp of employees) {
      // Check if already exists
      const existing = await Payroll.findOne({ employeeId: emp._id, month, year });
      if (existing) continue;

      // Sum approved expenses for this month
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);
      
      const approvedExpenses = await Expense.find({
        employeeId: emp._id,
        status: 'approved',
        date: { $gte: startOfMonth, $lte: endOfMonth }
      });
      const totalExpenses = approvedExpenses.reduce((sum, e) => sum + e.amount, 0);

      const baseSalary = emp.salary || 0;
      const netSalary = baseSalary + totalExpenses;

      const payroll = new Payroll({
        employeeId: emp._id,
        employeeName: emp.name,
        month,
        year,
        baseSalary,
        expenses: totalExpenses,
        netSalary,
        status: 'draft'
      });

      await payroll.save();
      generated.push(payroll);
    }

    await logAudit(req, 'PAYROLL_GENERATED', 'Payroll', { month, year, employeeCount: generated.length });
    res.status(201).json({ message: `Successfully generated ${generated.length} payroll entries`, counts: generated.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 💰 Update payroll status to paid
router.patch('/status/:id', auth, requireRole('admin', 'hr'), async (req, res) => {
  try {
    const { status, transactionId } = req.body;
    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        transactionId, 
        paidDate: status === 'paid' ? new Date() : undefined 
      },
      { new: true }
    );
    
    if (!payroll) return res.status(404).json({ message: 'Payroll not found' });

    await logAudit(req, 'PAYROLL_STATUS_UPDATE', 'Payroll', { 
        payrollId: payroll._id, 
        newStatus: status,
        employee: payroll.employeeName
    });

    res.json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
