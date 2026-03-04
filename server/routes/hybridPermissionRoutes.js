import express from 'express';
import jwt from 'jsonwebtoken';
import HybridPermission from '../models/HybridPermission.js';
import Employee from '../models/Employee.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Middleware to check if user is admin
const adminOnly = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Grant hybrid permission to employee (Admin only)
router.post('/grant', adminOnly, async (req, res) => {
  try {
    const { employeeId, permissions, notes } = req.body;

    // Validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if employee already has active hybrid permission
    const existingPermission = await HybridPermission.findActiveByEmployee(employeeId);
    if (existingPermission) {
      return res.status(400).json({ message: 'Employee already has active hybrid permission' });
    }

    // Get admin info
    const adminUser = await User.findById(req.user.id);
    const adminEmployee = await Employee.findOne({ email: adminUser.email });

    // Create hybrid permission
    const hybridPermission = new HybridPermission({
      employeeId,
      employeeName: employee.name,
      employeeEmail: employee.email,
      grantedBy: adminEmployee._id,
      grantedByName: adminEmployee.name,
      permissions: {
        canAccessHR: permissions.canAccessHR ?? true,
        canAccessEmployee: permissions.canAccessEmployee ?? true,
        canViewReports: permissions.canViewReports ?? true,
        canManageAttendance: permissions.canManageAttendance ?? false,
        canManageLeaves: permissions.canManageLeaves ?? true,
        ...permissions
      },
      notes
    });

    await hybridPermission.save();

    res.status(201).json({
      message: 'Hybrid permission granted successfully',
      permission: hybridPermission
    });
  } catch (error) {
    console.error('Error granting hybrid permission:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Revoke hybrid permission (Admin only)
router.patch('/revoke/:permissionId', adminOnly, async (req, res) => {
  try {
    const { permissionId } = req.params;

    const permission = await HybridPermission.findById(permissionId);
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    permission.status = 'revoked';
    await permission.save();

    res.json({ message: 'Hybrid permission revoked successfully' });
  } catch (error) {
    console.error('Error revoking hybrid permission:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all hybrid permissions (Admin only)
router.get('/all', adminOnly, async (req, res) => {
  try {
    const permissions = await HybridPermission.find()
      .populate('employeeId', 'name email employeeId department')
      .populate('grantedBy', 'name email employeeId')
      .sort({ createdAt: -1 });

    res.json(permissions);
  } catch (error) {
    console.error('Error fetching hybrid permissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if user has hybrid permission
router.get('/check/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    const permission = await HybridPermission.findActiveByEmployee(employeeId);
    
    if (!permission) {
      return res.json({ hasHybridPermission: false });
    }

    // Update access tracking
    await permission.updateAccess();

    res.json({
      hasHybridPermission: true,
      permission: {
        permissions: permission.permissions,
        expiresAt: permission.expiresAt,
        grantedBy: permission.grantedByName
      }
    });
  } catch (error) {
    console.error('Error checking hybrid permission:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get employees eligible for hybrid permission (Admin only)
router.get('/eligible-employees', adminOnly, async (req, res) => {
  try {
    const employees = await Employee.find({ 
      role: 'employee',
      isActive: true 
    }).select('name email employeeId department');

    // Get employees who already have hybrid permissions
    const existingPermissions = await HybridPermission.find({
      status: 'active',
      expiresAt: { $gt: new Date() }
    }).select('employeeId');

    const employeeIdsWithPermissions = existingPermissions.map(p => p.employeeId);

    // Filter out employees who already have permissions
    const eligibleEmployees = employees.filter(
      emp => !employeeIdsWithPermissions.includes(emp._id)
    );

    res.json(eligibleEmployees);
  } catch (error) {
    console.error('Error fetching eligible employees:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get employee's hybrid permission details
router.get('/my-permission', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const employee = await Employee.findOne({ email: user.email });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const permission = await HybridPermission.findActiveByEmployee(employee._id);
    
    if (!permission) {
      return res.json({ hasHybridPermission: false });
    }

    res.json({
      hasHybridPermission: true,
      permission: {
        permissions: permission.permissions,
        expiresAt: permission.expiresAt,
        grantedBy: permission.grantedByName,
        grantedAt: permission.grantedAt,
        accessCount: permission.accessCount,
        lastAccessed: permission.lastAccessed
      }
    });
  } catch (error) {
    console.error('Error fetching hybrid permission:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
