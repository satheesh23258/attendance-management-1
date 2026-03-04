import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['attendance', 'service', 'system', 'general', 'leave', 'user'],
      default: 'general',
    },
    isRead: { type: Boolean, default: false },
    actionUrl: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    targetRole: { type: String, enum: ['admin', 'hr', 'employee', 'all'], default: 'all' },
    importance: { type: String, enum: ['normal', 'high', 'urgent'], default: 'normal' },
  },
  { timestamps: true }
);

notificationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
