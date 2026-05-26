const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['customer', 'ai', 'agent'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ChatSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  customerPhone: { type: String, required: true },
  customerName: { type: String, default: '' },
  status: { type: String, enum: ['open', 'closed', 'bot_active'], default: 'bot_active' },
  messages: [MessageSchema] // Array de mensajes anidados
}, { timestamps: true });

// Índice compuesto para que buscar un chat por teléfono de un cliente de X tienda sea instantáneo
ChatSchema.index({ tenantId: 1, customerPhone: 1 }, { unique: true });

module.exports = mongoose.model('Chat', ChatSchema);