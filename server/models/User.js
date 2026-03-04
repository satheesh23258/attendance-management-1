import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'active',
    },
    employeeId: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    // OTP fields for phone verification and password reset
    otpHash: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    otpPurpose: {
      type: String,
      enum: ['verify_phone', 'reset_password'],
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },
    branchName: {
      type: String,
      trim: true,
    },
    hybridPermissions: {
      hasAccess: {
        type: Boolean,
        default: false,
      },
      roles: [{
        type: String,
        enum: ['admin', 'hr', 'employee'],
      }],
      granterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    password: {
      type: String,
      minlength: 6,
      select: false, // Don't include in queries by default
    },
  },
  {
    timestamps: true,
  }
);

userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);

export default User;
