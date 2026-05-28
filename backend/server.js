require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Import all routes
const authRoutes = require('./person1-auth/src/routes/authRoutes');
const productRoutes = require('./person2-products/src/routes/productRoutes');
const categoryRoutes = require('./person2-products/src/routes/categoryRoutes');
const cartRoutes = require('./person3-cart-orders/src/routes/cartRoutes');
const wishlistRoutes = require('./person3-cart-orders/src/routes/wishlistRoutes');
const orderRoutes = require('./person3-cart-orders/src/routes/orderRoutes');
const checkoutRoutes = require('./person3-cart-orders/src/routes/checkoutRoutes');
const paymentRoutes = require('./person3-cart-orders/src/routes/paymentRoutes');

// Import all models so mongoose registers them
require('./person1-auth/src/models/User');
require('./person1-auth/src/models/Roles');
require('./person2-products/src/models/Product');
require('./person2-products/src/models/Category');

const { errorHandler } = require('./person3-cart-orders/src/middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'BrainMint backend is running' });
});

// Mount all routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/payments', paymentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`BrainMint backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });