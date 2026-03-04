import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import HybridPermission from '../models/HybridPermission.js';

// Check if user has hybrid permission
export const requireHybridAccess = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(
      token,
      process.env.VITE_JWT_SECRET || process.env.JWT_SECRET || 'demo-secret-key'
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Get employee record
    const employee = await Employee.findOne({ email: user.email });
    if (!employee) {
      return res.status(404).json({ message: 'Employee record not found' });
    }

    // Check if user has active hybrid permission
    const hybridPermission = await HybridPermission.findActiveByEmployee(employee._id);
    
    if (!hybridPermission) {
      return res.status(403).json({ message: 'Hybrid access required' });
    }

    // Update access tracking
    await hybridPermission.updateAccess();

    // Attach user and hybrid permission to request
    req.user = user;
    req.employee = employee;
    req.hybridPermission = hybridPermission;

    next();
  } catch (err) {
    console.error('Hybrid auth error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Check if user has specific hybrid permission
export const requireHybridPermission = (permission) => async (req, res, next) => {
  try {
    // First check if user has hybrid access
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(
      token,
      process.env.VITE_JWT_SECRET || process.env.JWT_SECRET || 'demo-secret-key'
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const employee = await Employee.findOne({ email: user.email });
    if (!employee) {
      return res.status(404).json({ message: 'Employee record not found' });
    }

    const hybridPermission = await HybridPermission.findActiveByEmployee(employee._id);
    
    if (!hybridPermission) {
      return res.status(403).json({ message: 'Hybrid access required' });
    }

    // Check specific permission
    if (!hybridPermission.permissions[permission]) {
      return res.status(403).json({ message: `Insufficient permissions: ${permission} required` });
    }

    // Update access tracking
    await hybridPermission.updateAccess();

    req.user = user;
    req.employee = employee;
    req.hybridPermission = hybridPermission;

    next();
  } catch (err) {
    console.error('Hybrid permission check error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Allow access if user is HR OR has hybrid permission with specific access
export const allowHRorHybrid = (permission = 'canAccessHR') => async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(
      token,
      process.env.VITE_JWT_SECRET || process.env.JWT_SECRET || 'demo-secret-key'
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Allow if user is HR
    if (user.role === 'hr') {
      req.user = user;
      return next();
    }

    // Check hybrid permission
    const employee = await Employee.findOne({ email: user.email });
    if (!employee) {
      return res.status(404).json({ message: 'Employee record not found' });
    }

    const hybridPermission = await HybridPermission.findActiveByEmployee(employee._id);
    
    if (!hybridPermission || !hybridPermission.permissions[permission]) {
      return res.status(403).json({ message: 'HR access or hybrid permission required' });
    }

    // Update access tracking
    await hybridPermission.updateAccess();

    req.user = user;
    req.employee = employee;
    req.hybridPermission = hybridPermission;

    next();
  } catch (err) {
    console.error('HR or Hybrid auth error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
