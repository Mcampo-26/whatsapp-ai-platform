// backend/src/models/Tenant.js
import mongoose from 'mongoose'; // Reemplaza al require

const TenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  businessEmail: { type: String, required: true, unique: true },
  plan: { type: String, enum: ['free', 'premium', 'enterprise'], default: 'free' },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  whatsappConfig: {
    phoneNumberId: { type: String, default: '' },
    wabaId: { type: String, default: '' },
    accessToken: { type: String, default: '' }
  }
}, { timestamps: true });

export default mongoose.model('Tenant', TenantSchema); // Reemplaza al module.exports