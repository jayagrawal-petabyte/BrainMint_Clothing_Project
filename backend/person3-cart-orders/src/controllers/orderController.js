const mongoose = require('mongoose');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, couponCode, discountAmount } = req.body;

  if (!shippingAddress) {
    throw new ApiError(400, 'Shipping address is required');
  }

  const cart = await Cart.findOne({ user: req.user.id }).populate(
    'items.product'
  );

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Cart is empty, cannot place order');
  }

  // Build order snapshot using Person 2's decreaseStockForOrder helper
  const orderItems = [];

  for (const item of cart.items) {
    const updated = await Product.decreaseStockForOrder(
      item.product._id,
      item.quantity
    );

    if (!updated) {
      throw new ApiError(
        400,
        `Product "${item.product.name}" is unavailable or has insufficient stock`
      );
    }

    orderItems.push({
      product: item.product._id,
      name: item.product.name,
      price: item.product.discountPrice || item.product.price,
      discountPrice: item.product.discountPrice || null,
      image: item.product.images[0]?.url || null,
      quantity: item.quantity,
      size: item.size,
      color: item.color
    });
  }

  const totalPrice = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Apply discountAmount from request (validated by frontend) to final price
  const finalTotalPrice = Math.max(0, totalPrice - (discountAmount || 0));

  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    couponCode: couponCode || null,
    discountAmount: discountAmount || 0,
    totalPrice: finalTotalPrice,
    status: 'pending',
    paymentStatus: 'unpaid'
  });

  // Increment coupon usage count if applied
  if (couponCode) {
    try {
      await Coupon.findOneAndUpdate(
        { code: couponCode.trim().toUpperCase() },
        { $inc: { usedCount: 1 } }
      );
    } catch (err) {
      console.error('Failed to increment coupon usedCount:', err);
    }
  }

  // Clear cart after order creation
  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: order
  });
});

// @desc    Get all orders of logged in user
// @route   GET /api/orders
// @access  Private
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .populate('items.product', 'name images')
    .sort({
      createdAt: -1
    });

  res.status(200).json({
    success: true,
    message: 'Orders fetched successfully',
    data: orders
  });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders/all
// @access  Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: 'All orders fetched successfully',
    data: orders
  });
});

// @desc    Get single order by ID
// @route   GET /api/orders/:orderId
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId)
    .populate('items.product', 'name images');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.user.toString() !== req.user.id.toString()) {
    throw new ApiError(403, 'Not authorized to view this order');
  }

  res.status(200).json({
    success: true,
    message: 'Order fetched successfully',
    data: order
  });
});

// @desc    Cancel order
// @route   PUT /api/orders/:orderId/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.user.toString() !== req.user.id.toString()) {
    throw new ApiError(403, 'Not authorized to cancel this order');
  }

  if (['shipped', 'delivered'].includes(order.status)) {
    throw new ApiError(400, 'Cannot cancel an order that is already shipped or delivered');
  }

  order.status = 'cancelled';
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    data: order
  });
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:orderId/status
// @access  Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const allowedStatuses = [
    'pending',
    'confirmed',
    'shipped',
    'delivered',
    'cancelled'
  ];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, 'Invalid order status');
  }

  const order = await Order.findById(req.params.orderId);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  order.status = status;

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    data: order
  });
});

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus
};