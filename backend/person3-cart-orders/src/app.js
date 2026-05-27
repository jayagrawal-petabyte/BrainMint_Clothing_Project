const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Person 3 service is running' });
});

app.use(errorHandler);

module.exports = app;