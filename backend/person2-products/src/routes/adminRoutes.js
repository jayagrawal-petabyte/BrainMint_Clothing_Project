const express = require('express');
const {
  getAdminDashboard,
  getAdminProductById,
  getAdminProducts
} = require('../controllers/adminController');
const {
  createProduct,
  deleteProduct,
  updateProduct
} = require('../controllers/productController');
const { adminOnly, protect } = require('../middleware/authMiddleware');
const {
  attachCloudinaryImages,
  uploadProductImages
} = require('../middleware/productImageUpload');
const adminPanel = require('../views/adminPanel');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/panel', (req, res) => {
  res.type('html').send(adminPanel);
});
router.get('/dashboard', getAdminDashboard);
router.route('/').get(getAdminProducts).post(uploadProductImages, attachCloudinaryImages, createProduct);
router.route('/:id').get(getAdminProductById).put(uploadProductImages, attachCloudinaryImages, updateProduct).delete(deleteProduct);

module.exports = router;
