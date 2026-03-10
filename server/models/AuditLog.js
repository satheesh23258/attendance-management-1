import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  userRole: String,
  action: { type: String, required: true }, // e.g., 'UPDATE_EMPLOYEE', 'APPROVE_LEAVE'
  module: { type: String, required: true }, // e.g., 'Employee', 'Leave', 'Attendance'
  details: { type: mongoose.Schema.Types.Mixed }, // JSON of changes or description
  ipAddress: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

auditLogSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('AuditLog', auditLogSchema);
