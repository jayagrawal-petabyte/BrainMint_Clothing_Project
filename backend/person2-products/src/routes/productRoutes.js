const express = require('express');
const {
  createProduct,
  deleteProduct,
  getBestsellers,
  getPopularSearches,
  getProductForCart,
  getNewArrivals,
  getProductById,
  getProducts,
  getTrendingProducts,
  updateProduct
} = require('../controllers/productController');
const {
  getProductReviews,
  submitProductReview
} = require('../controllers/reviewController');
const { adminOnly, protect } = require('../middleware/authMiddleware');
const {
  attachCloudinaryImages,
  uploadProductImages
} = require('../middleware/productImageUpload');

const router = express.Router();

router.get('/bestsellers', getBestsellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/trending', getTrendingProducts);
router.get('/popular-searches', getPopularSearches);
router.route('/').get(getProducts).post(protect, adminOnly, uploadProductImages, attachCloudinaryImages, createProduct);
router.get('/:id/cart-check', getProductForCart);
router.route('/:id/reviews').get(getProductReviews).post(protect, submitProductReview);
router.route('/:id').get(getProductById).put(protect, adminOnly, uploadProductImages, attachCloudinaryImages, updateProduct).delete(protect, adminOnly, deleteProduct);

module.exports = router;
