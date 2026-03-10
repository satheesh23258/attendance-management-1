import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  serialNumber: { type: String, unique: true },
  category: { type: String, enum: ['Laptop', 'Mobile', 'Tablet', 'Furniture', 'Vehicle', 'Access Card', 'Other'], required: true },
  model: String,
  manufacturer: String,
  purchaseDate: Date,
  warrantyExpiry: Date,
  status: { type: String, enum: ['available', 'assigned', 'maintenance', 'retired'], default: 'available' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  assignedDate: Date,
  condition: { type: String, enum: ['new', 'good', 'fair', 'damaged'], default: 'new' },
  location: String,
  qrCode: String, // SVG or Base64 string
  notes: String
}, { timestamps: true });

assetSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Asset', assetSchema);
