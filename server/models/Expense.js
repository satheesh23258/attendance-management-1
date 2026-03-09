import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  employeeName: { type: String, required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, enum: ['Travel', 'Food', 'Internet', 'Office Supplies', 'Other'], required: true },
  date: { type: Date, required: true },
  receiptUrl: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  remark: String
}, { timestamps: true });

expenseSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Expense', expenseSchema);
