import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    lat: Number,
    lng: Number,
    address: String,
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    employeeName: { type: String, required: true },
    date: { type: String, required: true },
    checkIn: { type: String, default: '' },
    checkOut: { type: String, default: '' },
    status: {
      type: String,
      enum: ['present', 'late', 'absent', 'leave', 'half-day'],
      default: 'present',
    },
    workingHours: { type: Number, default: 0 },
    overtime: { type: Number, default: 0 },
    location: locationSchema,
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

attendanceSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
