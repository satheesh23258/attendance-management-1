import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  employeeName: { type: String, required: true },
  month: { type: Number, required: true }, // 1-12
  year: { type: Number, required: true },
  baseSalary: { type: Number, required: true },
  bonus: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  expenses: { type: Number, default: 0 }, // Approved expense claims
  netSalary: { type: Number, required: true },
  status: { type: String, enum: ['draft', 'generated', 'paid'], default: 'draft' },
  paidDate: Date,
  transactionId: String,
  payslipUrl: String
}, { timestamps: true });

payrollSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Payroll', payrollSchema);
