const express = require('express');
const { getSalesDashboard, getAllOrders } = require('../controllers/analyticsController');
const { adminOnly, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard', getSalesDashboard);
router.get('/sales', getSalesDashboard);
router.get('/orders', getAllOrders);

module.exports = router;
