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
const adminPanel = require('../views/adminPanel');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/panel', (req, res) => {
  res.type('html').send(adminPanel);
});
router.get('/dashboard', getAdminDashboard);
router.route('/').get(getAdminProducts).post(createProduct);
router.route('/:id').get(getAdminProductById).put(updateProduct).delete(deleteProduct);

module.exports = router;
