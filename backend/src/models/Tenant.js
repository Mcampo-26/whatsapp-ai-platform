const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  businessEmail: { type: String, required: true, unique: true },
  plan: { type: String, enum: ['Free', 'VIP', 'Business'], default: 'Free' },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  whatsappConfig: {
    phoneNumberId: { type: String, default: '' },
    wabaId: { type: String, default: '' }, // WhatsApp Business Account ID
    accessToken: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Tenant', TenantSchema);