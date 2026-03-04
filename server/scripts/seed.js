import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import Service from '../models/Service.js';
import Location from '../models/Location.js';
import Notification from '../models/Notification.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const mockEmployees = [
  { name: 'John Admin', email: 'admin@company.com', role: 'admin', department: 'IT', phone: '+1234567890', avatar: 'https://i.pravatar.cc/150?img=1', isActive: true, joinDate: '2022-01-15', employeeId: 'EMP001' },
  { name: 'Sarah HR', email: 'hr@company.com', role: 'hr', department: 'Human Resources', phone: '+1234567891', avatar: 'https://i.pravatar.cc/150?img=5', isActive: true, joinDate: '2022-02-20', employeeId: 'EMP002' },
  { name: 'Mike Employee', email: 'mike@company.com', role: 'employee', department: 'Sales', phone: '+1234567892', avatar: 'https://i.pravatar.cc/150?img=3', isActive: true, joinDate: '2022-03-10', employeeId: 'EMP003' },
  { name: 'Jane Developer', email: 'jane@company.com', role: 'employee', department: 'IT', phone: '+1234567893', avatar: 'https://i.pravatar.cc/150?img=4', isActive: true, joinDate: '2022-04-05', employeeId: 'EMP004' },
];

const seed = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI not found in .env');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log('MongoDB connected for seeding');

  // Check if already seeded
  const employeeCount = await Employee.countDocuments();
  if (employeeCount > 0) {
    console.log('Database already seeded. Skipping.');
    await mongoose.disconnect();
    process.exit(0);
  }

  // Create employees
  const createdEmployees = await Employee.insertMany(mockEmployees);
  const idMap = {
    1: createdEmployees[0]._id,
    2: createdEmployees[1]._id,
    3: createdEmployees[2]._id,
    4: createdEmployees[3]._id,
  };

  // Create attendance
  await Attendance.insertMany([
    { employeeId: idMap[3], employeeName: 'Mike Employee', date: '2024-01-25', checkIn: '09:00:00', checkOut: '18:00:00', status: 'present', workingHours: 9, overtime: 0, location: { lat: 40.7128, lng: -74.006, address: 'Office Main Building' } },
    { employeeId: idMap[4], employeeName: 'Jane Developer', date: '2024-01-25', checkIn: '08:45:00', checkOut: '17:30:00', status: 'present', workingHours: 8.75, overtime: 0, location: { lat: 40.7128, lng: -74.006, address: 'Office Main Building' } },
    { employeeId: idMap[3], employeeName: 'Mike Employee', date: '2024-01-24', checkIn: '09:15:00', checkOut: '18:30:00', status: 'present', workingHours: 9.25, overtime: 0.25, location: { lat: 40.7128, lng: -74.006, address: 'Office Main Building' } },
  ]);

  // Create services
  await Service.insertMany([
    { title: 'Fix Network Issue', description: 'Resolve network connectivity problems in floor 3', priority: 'high', status: 'pending', assignedTo: idMap[4], assignedToName: 'Jane Developer', createdBy: idMap[1], createdByName: 'John Admin', dueDate: new Date('2024-01-26'), category: 'IT Support', location: { lat: 40.7128, lng: -74.006, address: 'Floor 3, Office Building' } },
    { title: 'Install New Software', description: 'Install accounting software on finance department computers', priority: 'medium', status: 'in_progress', assignedTo: idMap[3], assignedToName: 'Mike Employee', createdBy: idMap[2], createdByName: 'Sarah HR', dueDate: new Date('2024-01-27'), category: 'IT Support', location: { lat: 40.7128, lng: -74.006, address: 'Finance Department' } },
    { title: 'Office Maintenance', description: 'Repair air conditioning system in conference room', priority: 'low', status: 'completed', assignedTo: idMap[3], assignedToName: 'Mike Employee', createdBy: idMap[1], createdByName: 'John Admin', completedAt: new Date('2024-01-24T16:30:00'), category: 'Facilities', location: { lat: 40.7128, lng: -74.006, address: 'Conference Room A' } },
  ]);

  // Create locations
  await Location.insertMany([
    { employeeId: idMap[3], employeeName: 'Mike Employee', latitude: 40.7128, longitude: -74.006, address: 'Office Main Building', isActive: true },
    { employeeId: idMap[4], employeeName: 'Jane Developer', latitude: 40.726, longitude: -73.9897, address: 'Client Site - Manhattan Office', isActive: true },
    { employeeId: idMap[3], employeeName: 'Mike Employee', latitude: 40.7589, longitude: -73.9851, address: 'Field Location - Times Square', isActive: false },
  ]);

  // Create notifications
  await Notification.insertMany([
    { title: 'New Service Assigned', message: 'You have been assigned a new service: Fix Network Issue', type: 'service', isRead: false, actionUrl: '/services/1' },
    { title: 'Attendance Reminder', message: "Don't forget to check in today", type: 'attendance', isRead: false, actionUrl: '/attendance' },
    { title: 'Service Completed', message: 'Service "Office Maintenance" has been marked as completed', type: 'service', isRead: true, actionUrl: '/services/3' },
  ]);

  console.log('✓ Seeded employees (admin, hr, employees)');
  console.log('✓ Seeded attendance records');
  console.log('✓ Seeded services');
  console.log('✓ Seeded locations');
  console.log('✓ Seeded notifications');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
