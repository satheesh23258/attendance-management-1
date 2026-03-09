import express from 'express';
import Employee from '../models/Employee.js';
import Expense from '../models/Expense.js';
import Notification from '../models/Notification.js';
import { auth, requireRole } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import csv from 'csv-parser';
import fs from 'fs';
import PDFDocument from 'pdfkit';

const router = express.Router();

// Setup Multer for document and image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// 🛠️ Feature 1: Document Management (E-Dossier)
router.post('/:id/documents', auth, requireRole('admin', 'hr'), upload.single('document'), async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const { type, expiryDate } = req.body;
    employee.documents.push({
      type,
      fileUrl: `/uploads/${req.file.filename}`,
      expiryDate: expiryDate ? new Date(expiryDate) : null
    });
    await employee.save();
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🛠️ Feature 2: Payroll - Get Payslip
router.get('/:id/payroll/:month/payslip', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    
    // Auth check: only self, admin or HR
    if (req.user.role === 'employee' && req.user.email !== employee.email) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const { month } = req.params;
    const payroll = employee.payroll.find(p => p.month === month);
    if (!payroll) return res.status(404).json({ message: 'Payroll for this month not found' });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=payslip-${month}.pdf`);
    doc.pipe(res);

    doc.fontSize(25).text('SALARY SLIP', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Employee Name: ${employee.name}`);
    doc.text(`Employee ID: ${employee.employeeId}`);
    doc.text(`Month: ${month}`);
    doc.moveDown();
    doc.text(`Base Salary: $${payroll.baseSalary}`);
    doc.text(`Allowances: $${payroll.allowances}`);
    doc.text(`Deductions: $${payroll.deductions}`);
    doc.moveDown();
    doc.fontSize(18).text(`Net Salary: $${payroll.netSalary}`, { underline: true });
    
    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🛠️ Feature 2: Expense Claims
router.post('/expenses', auth, upload.single('receipt'), async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    const expense = await Expense.create({
      ...req.body,
      employeeId: employee._id,
      employeeName: employee.name,
      receiptUrl: req.file ? `/uploads/${req.file.filename}` : null
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🛠️ Feature 4: Performance Management (Update Review)
router.post('/:id/performance', auth, requireRole('admin', 'hr'), async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    employee.performance.push(req.body);
    await employee.save();
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🛠️ Feature 5: Inventory & Asset Management (Assign Asset)
router.post('/:id/assets', auth, requireRole('admin', 'hr'), async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);
      employee.assets.push(req.body);
      await employee.save();
      res.json(employee);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

// 🛠️ Bulk Technical Improvement: CSV Import Template
router.get('/import-template', auth, requireRole('admin', 'hr'), (req, res) => {
  const csvTemplate = 'name,email,employeeId,department,phone,role,isRemote,officeLat,officeLng,officeRadius\nJohn Doe,john@example.com,EMP001,IT,1234567890,employee,false,40.7128,-74.006,100';
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=employee_template.csv');
  res.status(200).send(csvTemplate);
});

// 🛠️ Bulk Technical Improvement: CSV Import
router.post('/bulk-import', auth, requireRole('admin', 'hr'), upload.single('csv'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  
  const employees = [];
  const errors = [];
  let rowCount = 0;

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
        rowCount++;
        // Basic validation or transformation
        if (!data.email || !data.name || !data.employeeId) {
            errors.push(`Row ${rowCount}: Missing required fields (name, email, or employeeId)`);
        } else {
            employees.push({
                ...data,
                isRemote: data.isRemote === 'true',
                officeLocation: {
                    lat: parseFloat(data.officeLat) || 40.7128,
                    lng: parseFloat(data.officeLng) || -74.006,
                    radius: parseInt(data.officeRadius) || 100
                }
            });
        }
    })
    .on('end', async () => {
      try {
        if (employees.length > 0) {
            await Employee.insertMany(employees, { ordered: false });
        }
        fs.unlinkSync(req.file.path);
        res.json({ 
            message: `Successfully imported ${employees.length} employees`,
            failedCount: errors.length,
            errors: errors.slice(0, 10) // Return first 10 errors
        });
      } catch (error) {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ 
            message: 'Bulk import partially failed. Some records might have duplicate emails or IDs.',
            error: error.message 
        });
      }
    });
});

// Get current logged in employee details
router.get('/me', auth, async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    if (!employee) return res.status(404).json({ message: 'Employee profile not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Original Routes (Standard CRUD)
router.get('/', auth, async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, requireRole('admin', 'hr'), async (req, res) => {
    try {
      const employee = await Employee.create(req.body);
      res.status(201).json(employee);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

router.put('/:id', auth, requireRole('admin', 'hr'), async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', auth, requireRole('admin', 'hr'), async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
