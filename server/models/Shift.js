import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  employeeName: { type: String, required: true },
  title: { type: String, default: 'Regular Shift' },
  startTime: { type: String, required: true }, // HH:mm
  endTime: { type: String, required: true }, // HH:mm
  date: { type: Date, required: true },
  color: { type: String, default: '#6366f1' }, // Indigo default
  isHoliday: { type: Boolean, default: false },
  notes: String
}, { timestamps: true });

shiftSchema.index({ employeeId: 1, date: 1 }, { unique: true });

shiftSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Shift', shiftSchema);
