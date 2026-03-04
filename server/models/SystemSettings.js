import mongoose from 'mongoose';

const systemSettingsSchema = new mongoose.Schema({
  // Global company settings
  company: {
    name: { type: String, default: 'My Company' },
    address: { type: String, default: '' },
    timezone: { type: String, default: 'UTC' }
  },
  attendance: {
    workStartTime: { type: String, default: '09:00' },
    workEndTime: { type: String, default: '17:00' },
    lateMarkAfterMinutes: { type: Number, default: 15 },
    enableManualAttendance: { type: Boolean, default: false }
  },
  leave: {
    defaultLeaveTypes: [{
      name: { type: String, required: true },
      daysPerYear: { type: Number, required: true },
      paid: { type: Boolean, default: true }
    }],
    holidays: [{
      date: { type: String, required: true }, // YYYY-MM-DD
      name: { type: String, required: true }
    }]
  },
  announcements: {
    enableSystemAlerts: { type: Boolean, default: true },
    currentAnnouncement: { type: String, default: '' }
  }
}, { timestamps: true });

// Should only be one document for system settings
systemSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      leave: {
        defaultLeaveTypes: [
          { name: 'Sick Leave', daysPerYear: 10, paid: true },
          { name: 'Casual Leave', daysPerYear: 12, paid: true },
          { name: 'Earned Leave', daysPerYear: 15, paid: true }
        ],
        holidays: []
      }
    });
  }
  return settings;
};

export default mongoose.model('SystemSettings', systemSettingsSchema);
