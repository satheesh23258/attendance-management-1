import mongoose from 'mongoose';

const userSettingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  emailNotifications: { type: Boolean, default: true },
  attendanceReminders: { type: Boolean, default: true },
  leaveUpdates: { type: Boolean, default: true },
  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
  privacy: {
    showEmailToTeam: { type: Boolean, default: true },
    showPhoneToTeam: { type: Boolean, default: false }
  },
  // Manager specific
  teamNotifications: { type: Boolean, default: true },
  approvalWorkflow: { type: String, enum: ['manual', 'auto_forward'], default: 'manual' }
}, { timestamps: true });

userSettingsSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('UserSettings', userSettingsSchema);
