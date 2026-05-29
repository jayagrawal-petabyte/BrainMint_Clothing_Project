const express = require('express');
const {
  createProduct,
  deleteProduct,
  getBestsellers,
  getProductForCart,
  getNewArrivals,
  getProductById,
  getProducts,
  updateProduct
} = require('../controllers/productController');
const { adminOnly, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/bestsellers', getBestsellers);
router.get('/new-arrivals', getNewArrivals);
router.route('/').get(getProducts).post(protect, adminOnly, createProduct);
router.get('/:id/cart-check', getProductForCart);
router.route('/:id').get(getProductById).put(protect, adminOnly, updateProduct).delete(protect, adminOnly, deleteProduct);

module.exports = router;
