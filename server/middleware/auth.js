import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Attach authenticated user (from JWT) to req.user
export const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      console.warn(`[AUTH] No token provided for ${req.method} ${req.url}`);
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(
      token,
      process.env.VITE_JWT_SECRET || process.env.JWT_SECRET || 'demo-secret-key'
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      console.warn(`[AUTH] User not found for ID: ${decoded.id}`);
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(`[AUTH] Token verification failed for ${req.method} ${req.url}:`, err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Require one of the given roles (admin / hr / employee)
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

