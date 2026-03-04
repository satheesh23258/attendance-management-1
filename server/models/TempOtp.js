import mongoose from 'mongoose';

const tempOtpSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
    unique: true
  },
  otpHash: {
    type: String,
    required: true
  },
  expires: {
    type: Date,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Auto-delete expired OTPs after a while, though Mongoose ttl index is good
tempOtpSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

const TempOtp = mongoose.model('TempOtp', tempOtpSchema);
export default TempOtp;
