const mongoose = require('mongoose');
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity cannot be less than 1']
    },
    price: {
      type: Number,
      required: true
    },
    size: { type: String },
    color: { type: String }
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: {
      type: [orderItemSchema],
      required: true
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true
    },
    couponCode: {
      type: String,
      default: null
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'abandoned'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid'
    },
    paymentId: {
      type: String,
      default: null
    },
    paymentMethod: {
      type: String,
      enum: ['Razorpay', 'COD', 'Stripe'],
      default: 'COD'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
