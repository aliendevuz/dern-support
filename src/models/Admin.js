const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  role: { type: String, enum: ['super-admin', 'manager', 'technician'], required: true },
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  pinCode:   { type: String},
  kpi: { // faqat technician uchun
    totalCompleted: { type: Number, default: 0 },
    avgCompletionTime: { type: Number, default: 0 }, // in minutes
  },
  assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Request' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', adminSchema);
