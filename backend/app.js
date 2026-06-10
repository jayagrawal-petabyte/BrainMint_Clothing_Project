require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./person1-auth/src/routes/authRoutes');
const contactRoutes = require('./person1-auth/src/routes/contactRoutes');
const productRoutes = require('./person2-products/src/routes/productRoutes');
const categoryRoutes = require('./person2-products/src/routes/categoryRoutes');
const adminProductRoutes = require('./person2-products/src/routes/adminRoutes');
const couponRoutes = require('./person2-products/src/routes/couponRoutes');
const analyticsRoutes = require('./person2-products/src/routes/analyticsRoutes');
const newsletterRoutes = require('./person2-products/src/routes/newsletterRoutes');
const cartRoutes = require('./person3-cart-orders/src/routes/cartRoutes');
const wishlistRoutes = require('./person3-cart-orders/src/routes/wishlistRoutes');
const orderRoutes = require('./person3-cart-orders/src/routes/orderRoutes');
const checkoutRoutes = require('./person3-cart-orders/src/routes/checkoutRoutes');
const paymentRoutes = require('./person3-cart-orders/src/routes/paymentRoutes');

require('./person1-auth/src/models/User');
require('./person1-auth/src/models/PendingUser');
require('./person1-auth/src/models/Contact');
require('./person2-products/src/models/Category');
require('./person2-products/src/models/Product');
require('./person2-products/src/models/Coupon');
require('./person2-products/src/models/Review');
require('./person2-products/src/models/NewsletterSubscriber');
require('./person3-cart-orders/src/models/Cart');
require('./person3-cart-orders/src/models/Wishlist');
require('./person3-cart-orders/src/models/Order');
require('./person3-cart-orders/src/models/Payment');

const { errorHandler } = require('./person3-cart-orders/src/middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'BrainMint backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/coupons', couponRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/discounts', couponRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/payments', paymentRoutes);

app.use(errorHandler);

module.exports = app;
