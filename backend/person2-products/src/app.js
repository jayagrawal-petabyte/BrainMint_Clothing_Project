require('dotenv').config();

const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const adminRoutes = require('./routes/adminRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const couponRoutes = require('./routes/couponRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const productRoutes = require('./routes/productRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Person 2 product backend is running',
    data: {}
  });
});

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin/products', adminRoutes);
app.use('/api/admin/coupons', couponRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/discounts', couponRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/newsletter', newsletterRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
