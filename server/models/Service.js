import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  address: String,
}, { _id: false });

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending',
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    assignedToName: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    createdByName: { type: String, default: '' },
    dueDate: { type: Date },
    completedAt: { type: Date },
    category: { type: String, default: '' },
    location: locationSchema,
  },
  { timestamps: true }
);

serviceSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Service = mongoose.model('Service', serviceSchema);
export default Service;
