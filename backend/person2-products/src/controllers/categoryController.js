const Category = require('../models/Category');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });

  res.json({
    success: true,
    count: categories.length,
    data: categories
  });
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  res.json({
    success: true,
    message: 'Category updated successfully',
    data: category
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const productCount = await Product.countDocuments({ category: req.params.id });

  if (productCount > 0) {
    throw new ApiError(400, 'Cannot delete category while products are assigned to it');
  }

  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  res.json({
    success: true,
    message: 'Category deleted successfully'
  });
});

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
