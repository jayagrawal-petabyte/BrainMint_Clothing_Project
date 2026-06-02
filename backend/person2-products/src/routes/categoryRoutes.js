const express = require('express');
const {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory
} = require('../controllers/categoryController');
const { adminOnly, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getCategories).post(protect, adminOnly, createCategory);
router.route('/:id').put(protect, adminOnly, updateCategory).delete(protect, adminOnly, deleteCategory);

module.exports = router;
