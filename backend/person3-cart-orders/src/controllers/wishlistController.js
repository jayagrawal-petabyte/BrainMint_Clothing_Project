const Wishlist = require('../models/Wishlist');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user.id }).populate(
    'products',
    'name price discountPrice images inventory.stock isActive'
  );

  if (!wishlist) {
    return res.status(200).json({
      success: true,
      message: 'Wishlist is empty',
      data: { products: [] }
    });
  }

  res.status(200).json({
    success: true,
    message: 'Wishlist fetched successfully',
    data: wishlist
  });
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const productId = req.params.productId || req.body.productId;

  if (!productId) {
    throw new ApiError(400, 'productId is required');
  }

  let wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user.id,
      products: [productId]
    });
  } else {
    const alreadyExists = wishlist.products.find(
      (id) => id.toString() === productId
    );

    if (alreadyExists) {
      throw new ApiError(400, 'Product already in wishlist');
    }

    wishlist.products.push(productId);
    await wishlist.save();
  }

  res.status(200).json({
    success: true,
    message: 'Product added to wishlist',
    data: wishlist
  });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    throw new ApiError(404, 'Wishlist not found');
  }

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId
  );

  await wishlist.save();

  res.status(200).json({
    success: true,
    message: 'Product removed from wishlist',
    data: wishlist
  });
});

// @desc    Clear entire wishlist
// @route   DELETE /api/wishlist
// @access  Private
const clearWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    throw new ApiError(404, 'Wishlist not found');
  }

  wishlist.products = [];
  await wishlist.save();

  res.status(200).json({
    success: true,
    message: 'Wishlist cleared',
    data: wishlist
  });
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
};