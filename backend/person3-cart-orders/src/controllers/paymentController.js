const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Product = require('../../person2-products/src/models/Product');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getRazorpayInstance = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
const createPaymentOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    throw new ApiError(400, 'Order ID is required');
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.user.toString() !== req.user.id.toString()) {
    throw new ApiError(403, 'Not authorized to pay for this order');
  }

  if (order.paymentStatus === 'paid') {
    throw new ApiError(400, 'Order is already paid');
  }

  const razorpay = getRazorpayInstance();
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(order.totalPrice * 100),
    currency: 'INR',
    receipt: `receipt_${orderId}`
  });

  const payment = await Payment.create({
    order: orderId,
    user: req.user.id,
    razorpayOrderId: razorpayOrder.id,
    amount: order.totalPrice,
    currency: 'INR',
    status: 'created'
  });

  res.status(201).json({
    success: true,
    message: 'Payment order created',
    data: {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      paymentId: payment._id
    }
  });
});

// @desc    Verify Razorpay payment signature
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } =
    req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId) {
    throw new ApiError(400, 'All payment verification fields are required');
  }

  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    throw new ApiError(400, 'Payment verification failed, invalid signature');
  }

  const payment = await Payment.findOne({ razorpayOrderId });

  if (!payment) {
    throw new ApiError(404, 'Payment record not found');
  }

  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  payment.status = 'paid';
  await payment.save();

  const order = await Order.findById(orderId);
  
  // Decrease stock now that Razorpay payment is successful
  for (const item of order.items) {
    // We already verified there was sufficient stock during createOrder,
    // but another order could theoretically have taken it.
    await Product.decreaseStockForOrder(
      item.product || item.productId,
      item.quantity
    );
  }

  order.paymentStatus = 'paid';
  order.paymentId = razorpayPaymentId;
  order.status = 'confirmed';
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Payment verified successfully',
    data: {
      orderId: order._id,
      paymentStatus: order.paymentStatus,
      orderStatus: order.status
    }
  });
});

// @desc    Get payment details by order ID
// @route   GET /api/payments/:orderId
// @access  Private
const getPaymentByOrder = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({ order: req.params.orderId });

  if (!payment) {
    throw new ApiError(404, 'Payment not found for this order');
  }

  if (payment.user.toString() !== req.user.id.toString()) {
    throw new ApiError(403, 'Not authorized to view this payment');
  }

  res.status(200).json({
    success: true,
    message: 'Payment details fetched successfully',
    data: payment
  });
});

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getPaymentByOrder
};