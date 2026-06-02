const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createOrder);

// Get logged-in user's order history
router.get('/', getUserOrders);

// Alias for frontend compatibility
router.get('/me', getUserOrders);

router.get('/:orderId', getOrderById);

router.put('/:orderId/cancel', cancelOrder);

module.exports = router;