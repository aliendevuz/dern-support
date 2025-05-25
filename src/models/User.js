const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ['individual', 'business'], required: true },
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  phone:     { type: String, required: true },
  address:   { type: String, required: true },
  companyName:   { type: String },
  employeeCount: { type: String },
  password:  { type: String, required: true },
  createdAt:     { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
