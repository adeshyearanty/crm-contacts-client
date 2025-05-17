import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  company: { type: String },
  jobTitle: { type: String },
  tags: [{ type: String }],
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zipCode: { type: String }
  },
  socialMedia: {
    linkedin: { type: String },
    twitter: { type: String },
    facebook: { type: String }
  },
  notes: { type: String },
  status: {
    type: String,
    enum: ['active', 'inactive', 'lead', 'customer', 'prospect'],
    default: 'lead'
  },
  source: { type: String },
  lastContactedDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export default mongoose.models.Contact ?? mongoose.model('Contact', contactSchema); 