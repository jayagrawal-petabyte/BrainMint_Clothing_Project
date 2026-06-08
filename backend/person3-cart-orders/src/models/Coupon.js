const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true },
  usedCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
