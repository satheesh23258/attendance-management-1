import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root
dotenv.config({ path: join(__dirname, '..', '.env') });

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import User from './models/User.js';
import Employee from './models/Employee.js';
import Attendance from './models/Attendance.js';
import Service from './models/Service.js';
import Location from './models/Location.js';
import Notification from './models/Notification.js';
import HybridPermission from './models/HybridPermission.js';


import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

import hybridPermissionRoutes from './routes/hybridPermissionRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(join(__dirname, 'uploads')));
// Security headers
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Apply rate limiting to auth endpoints to reduce brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
})

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    database: 'connected',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);

app.use('/api/hybrid-permissions', hybridPermissionRoutes);
import leaveRoutes from './routes/leaveRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
app.use('/api/leaves', leaveRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/audit', auditRoutes);

// Seed database with UI data if empty
const seedDatabase = async () => {
  // Check if employees exist to avoid re-seeding
  const count = await Employee.countDocuments();
  if (count > 0) return;

  const mockEmployees = [
    { name: 'John Admin', email: 'admin@company.com', role: 'admin', department: 'IT', phone: '+1234567890', avatar: 'https://i.pravatar.cc/150?img=1', isActive: true, joinDate: '2022-01-15', employeeId: 'EMP001' },
    { name: 'Sarah HR', email: 'hr@company.com', role: 'hr', department: 'Human Resources', phone: '+1234567891', avatar: 'https://i.pravatar.cc/150?img=5', isActive: true, joinDate: '2022-02-20', employeeId: 'EMP002' },
    { name: 'Mike Employee', email: 'mike@company.com', role: 'employee', department: 'Sales', phone: '+1234567892', avatar: 'https://i.pravatar.cc/150?img=3', isActive: true, joinDate: '2022-03-10', employeeId: 'EMP003' },
    { name: 'Jane Developer', email: 'jane@company.com', role: 'employee', department: 'IT', phone: '+1234567893', avatar: 'https://i.pravatar.cc/150?img=4', isActive: true, joinDate: '2022-04-05', employeeId: 'EMP004' },
  ];

  const created = await Employee.insertMany(mockEmployees);
  const ids = { 1: created[0]._id, 2: created[1]._id, 3: created[2]._id, 4: created[3]._id };

  await Attendance.insertMany([
    { employeeId: ids[3], employeeName: 'Mike Employee', date: '2024-01-25', checkIn: '09:00:00', checkOut: '18:00:00', status: 'present', workingHours: 9, overtime: 0, location: { lat: 40.7128, lng: -74.006, address: 'Office Main Building' } },
    { employeeId: ids[4], employeeName: 'Jane Developer', date: '2024-01-25', checkIn: '08:45:00', checkOut: '17:30:00', status: 'present', workingHours: 8.75, overtime: 0, location: { lat: 40.7128, lng: -74.006, address: 'Office Main Building' } },
    { employeeId: ids[3], employeeName: 'Mike Employee', date: '2024-01-24', checkIn: '09:15:00', checkOut: '18:30:00', status: 'present', workingHours: 9.25, overtime: 0.25, location: { lat: 40.7128, lng: -74.006, address: 'Office Main Building' } },
  ]);

  await Service.insertMany([
    { title: 'Fix Network Issue', description: 'Resolve network connectivity problems in floor 3', priority: 'high', status: 'pending', assignedTo: ids[4], assignedToName: 'Jane Developer', createdBy: ids[1], createdByName: 'John Admin', dueDate: new Date('2024-01-26'), category: 'IT Support', location: { lat: 40.7128, lng: -74.006, address: 'Floor 3, Office Building' } },
    { title: 'Install New Software', description: 'Install accounting software on finance department computers', priority: 'medium', status: 'in_progress', assignedTo: ids[3], assignedToName: 'Mike Employee', createdBy: ids[2], createdByName: 'Sarah HR', dueDate: new Date('2024-01-27'), category: 'IT Support', location: { lat: 40.7128, lng: -74.006, address: 'Finance Department' } },
    { title: 'Office Maintenance', description: 'Repair air conditioning system in conference room', priority: 'low', status: 'completed', assignedTo: ids[3], assignedToName: 'Mike Employee', createdBy: ids[1], createdByName: 'John Admin', completedAt: new Date('2024-01-24T16:30:00'), category: 'Facilities', location: { lat: 40.7128, lng: -74.006, address: 'Conference Room A' } },
  ]);

  await Location.insertMany([
    { employeeId: ids[3], employeeName: 'Mike Employee', latitude: 40.7128, longitude: -74.006, address: 'Office Main Building', isActive: true },
    { employeeId: ids[4], employeeName: 'Jane Developer', latitude: 40.726, longitude: -73.9897, address: 'Client Site - Manhattan Office', isActive: true },
    { employeeId: ids[3], employeeName: 'Mike Employee', latitude: 40.7589, longitude: -73.9851, address: 'Field Location - Times Square', isActive: false },
  ]);

  await Notification.insertMany([
    { title: 'New Service Assigned', message: 'You have been assigned a new service: Fix Network Issue', type: 'service', isRead: false, actionUrl: '/services/1' },
    { title: 'Attendance Reminder', message: "Don't forget to check in today", type: 'attendance', isRead: false, actionUrl: '/attendance' },
    { title: 'Service Completed', message: 'Service "Office Maintenance" has been marked as completed', type: 'service', isRead: true, actionUrl: '/services/3' },
  ]);

  console.log('✓ Seeded: employees, attendance, services, locations, notifications');
};

// Seed users collection for login (admin, hr, employees) with password
const seedUsers = async () => {
  const demoUsers = [
    { name: 'John Admin', email: 'admin@company.com', role: 'admin', status: 'active', employeeId: 'EMP001', department: 'IT', password: 'admin123' },
    { name: 'Sarah HR', email: 'hr@company.com', role: 'hr', status: 'active', employeeId: 'EMP002', department: 'Human Resources', password: 'hr123' },
    { name: 'Mike Employee', email: 'mike@company.com', role: 'employee', status: 'active', employeeId: 'EMP003', department: 'Sales', password: 'employee123' },
    { name: 'Jane Developer', email: 'jane@company.com', role: 'employee', status: 'active', employeeId: 'EMP004', department: 'IT', password: 'employee123' },
  ];

  for (const userData of demoUsers) {
    const existing = await User.findOne({ email: userData.email });
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const { password, ...rest } = userData;

    if (existing) {
      await User.findOneAndUpdate(
        { email: userData.email },
        { $set: { ...rest, password: hashedPassword } },
        { new: true }
      );
    } else {
      await User.create({ ...rest, password: hashedPassword });
    }
  }
  console.log('✓ Seeded users (admin, hr, employees) with hashed passwords');
};

const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();
    await seedUsers();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
