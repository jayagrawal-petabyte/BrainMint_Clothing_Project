const mongoose = require('mongoose');
const Product = require('../models/Product');
const Review = require('../models/Review');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const recalculateProductRating = async (productId) => {
  const summary = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: '$product',
        average: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  const ratings = summary[0]
    ? { average: Math.round(summary[0].average * 10) / 10, count: summary[0].count }
    : { average: 0, count: 0 };

  await Product.findByIdAndUpdate(productId, { ratings });
};

const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.id })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    message: 'Product reviews fetched successfully',
    data: {
      count: reviews.length,
      reviews
    }
  });
});

const submitProductReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const userId = req.user.id || req.user._id;
  const review = await Review.findOneAndUpdate(
    { product: req.params.id, user: userId },
    {
      product: req.params.id,
      user: userId,
      rating: req.body.rating,
      title: req.body.title,
      comment: req.body.comment
    },
    {
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      upsert: true
    }
  );

  await recalculateProductRating(req.params.id);

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully',
    data: review
  });
});

module.exports = {
  getProductReviews,
  submitProductReview
};
