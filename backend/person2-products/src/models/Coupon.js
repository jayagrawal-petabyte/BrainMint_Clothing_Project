const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      trim: true,
      uppercase: true,
      unique: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
      default: 'percentage'
    },
    discountValue: {
      type: Number,
      required: true,
      min: [0, 'Discount value cannot be negative']
    },
    minimumOrderAmount: {
      type: Number,
      min: [0, 'Minimum order amount cannot be negative'],
      default: 0
    },
    maxDiscountAmount: {
      type: Number,
      min: [0, 'Maximum discount amount cannot be negative'],
      default: null
    },
    usageLimit: {
      type: Number,
      min: [0, 'Usage limit cannot be negative'],
      default: null
    },
    usedCount: {
      type: Number,
      min: [0, 'Used count cannot be negative'],
      default: 0
    },
    validFrom: {
      type: Date,
      default: Date.now
    },
    validUntil: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

couponSchema.pre('validate', function normalizeCode(next) {
  if (this.code) this.code = this.code.trim().toUpperCase();
  next();
});

couponSchema.virtual('isExpired').get(function isExpired() {
  return Boolean(this.validUntil && this.validUntil < new Date());
});

module.exports = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
