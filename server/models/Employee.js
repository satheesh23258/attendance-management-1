import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Passport', 'PAN', 'Aadhar', 'Contract', 'NDA', 'Other'],
    required: true
  },
  fileUrl: { type: String, required: true },
  expiryDate: { type: Date },
  status: { type: String, enum: ['active', 'expired', 'pending'], default: 'active' }
}, { timestamps: true });

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Laptop', 'Mobile', 'Monitor', 'Other'], required: true },
  serialNumber: { type: String, unique: true },
  assignedDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['assigned', 'returned', 'damaged'], default: 'assigned' }
}, { timestamps: true });

const performanceSchema = new mongoose.Schema({
  period: { type: String, required: true }, // e.g., "Q1 2024"
  kpis: [{
    title: String,
    target: String,
    achievement: String,
    rating: { type: Number, min: 1, max: 5 }
  }],
  selfAppraisal: String,
  managerFeedback: String,
  overallRating: { type: Number, min: 1, max: 5 },
  status: { type: String, enum: ['draft', 'submitted', 'reviewed'], default: 'draft' }
}, { timestamps: true });

const payrollSchema = new mongoose.Schema({
  month: { type: String, required: true }, // YYYY-MM
  baseSalary: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  payslipUrl: String
}, { timestamps: true });

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'hr', 'employee'],
      default: 'employee',
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: ['IT', 'Human Resources', 'Sales', 'Marketing', 'Finance', 'Operations', 'Customer Support', 'Management', 'Recruitment', 'Training & Development', 'Compensation & Benefits', 'Engineering'],
    },
    phone: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    joinDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
    },
    // Enhanced Features Data
    documents: [documentSchema],
    assets: [assetSchema],
    performance: [performanceSchema],
    payroll: [payrollSchema],
    isRemote: { type: Boolean, default: false },
    officeLocation: {
        lat: { type: Number, default: 40.7128 },
        lng: { type: Number, default: -74.006 },
        radius: { type: Number, default: 100 } // meters
    }
  },
  { timestamps: true }
);

employeeSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
