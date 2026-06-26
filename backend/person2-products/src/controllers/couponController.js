const Coupon = require('../models/Coupon');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const normalizeCode = (code) => String(code || '').trim().toUpperCase();

const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    message: 'Coupons fetched successfully',
    data: coupons
  });
});

const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create({
    ...req.body,
    code: normalizeCode(req.body.code)
  });

  res.status(201).json({
    success: true,
    message: 'Coupon created successfully',
    data: coupon
  });
});

const getCouponById = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    throw new ApiError(404, 'Coupon not found');
  }

  res.json({
    success: true,
    message: 'Coupon fetched successfully',
    data: coupon
  });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.code) payload.code = normalizeCode(payload.code);

  const coupon = await Coupon.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  });

  if (!coupon) {
    throw new ApiError(404, 'Coupon not found');
  }

  res.json({
    success: true,
    message: 'Coupon updated successfully',
    data: coupon
  });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);

  if (!coupon) {
    throw new ApiError(404, 'Coupon not found');
  }

  res.json({
    success: true,
    message: 'Coupon deleted successfully',
    data: {}
  });
});

const validateCoupon = asyncHandler(async (req, res) => {
  const code = normalizeCode(req.params.code || req.body.code);
  const orderAmount = Number(req.body.orderAmount || req.query.orderAmount || 0);

  const coupon = await Coupon.findOne({ code, isActive: true });

  if (!coupon) {
    throw new ApiError(404, 'Coupon is not valid');
  }

  if (coupon.validUntil && coupon.validUntil < new Date()) {
    throw new ApiError(400, 'Coupon has expired');
  }

  if (coupon.minimumOrderAmount > orderAmount) {
    throw new ApiError(400, `Minimum order amount is ${coupon.minimumOrderAmount}`);
  }

  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    throw new ApiError(400, 'Coupon usage limit reached');
  }

  const rawDiscount = coupon.discountType === 'percentage'
    ? (orderAmount * coupon.discountValue) / 100
    : coupon.discountValue;
  const discountAmount = coupon.maxDiscountAmount
    ? Math.min(rawDiscount, coupon.maxDiscountAmount)
    : rawDiscount;

  res.json({
    success: true,
    message: 'Coupon validated successfully',
    data: {
      coupon,
      discountAmount: Math.min(discountAmount, orderAmount),
      finalAmount: Math.max(orderAmount - discountAmount, 0)
    }
  });
});

module.exports = {
  createCoupon,
  deleteCoupon,
  getCouponById,
  getCoupons,
  updateCoupon,
  validateCoupon
};
