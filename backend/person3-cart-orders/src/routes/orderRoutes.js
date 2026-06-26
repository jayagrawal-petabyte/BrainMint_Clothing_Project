const express = require('express');
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  bulkDeleteOrders
} = require('../controllers/orderController');

const { protect } = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

router.use(protect);

router.post('/', createOrder);

// User order history
router.get('/', getUserOrders);

// Frontend compatibility
router.get('/me', getUserOrders);

// Admin routes
router.delete('/bulk', adminOnly, bulkDeleteOrders);
router.get('/all', adminOnly, getAllOrders);
router.put('/:orderId/status', adminOnly, updateOrderStatus);

// User routes
router.get('/:orderId', getOrderById);
router.put('/:orderId/cancel', cancelOrder);

module.exports = router;