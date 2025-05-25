const mongoose = require("mongoose");

const adminRefreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('AdminRefreshToken', adminRefreshTokenSchema);
