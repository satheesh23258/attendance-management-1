import mongoose from 'mongoose';

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
  },
  { timestamps: true }
);

// Transform _id to id for frontend compatibility
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
