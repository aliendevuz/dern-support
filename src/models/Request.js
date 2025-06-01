const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['individual', 'business'], required: true },
  issueDescription: { type: String, required: true },
  preferredMethod: { type: String, enum: ['drop-off', 'courier', 'on-site'], required: true },
  status: { type: String, enum: ['pending', 'in-process', 'done'], default: 'pending' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, // technician
  usedInventories: [{
    inventory: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
    quantity: { type: Number, default: 1 }
  }],
  priceQuote: { type: Number },
  submittedAt: { type: Date, default: Date.now },
  assignedAt: { type: Date },
  completedAt: { type: Date }
});

module.exports = mongoose.model('Request', requestSchema);
