const Cart = require('../models/Cart');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
    'name price discountPrice images inventory.stock isActive'
  );

  if (!cart) {
    return res.status(200).json({
      success: true,
      message: 'Cart is empty',
      data: { items: [], totalPrice: 0 }
    });
  }

  res.status(200).json({
    success: true,
    message: 'Cart fetched successfully',
    data: cart
  });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, price } = req.body;

  if (!productId || !quantity || !price) {
    throw new ApiError(400, 'productId, quantity and price are required');
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, quantity, price }],
      totalPrice: quantity * price
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, price });
    }

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    await cart.save();
  }

  res.status(200).json({
    success: true,
    message: 'Item added to cart',
    data: cart
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (!quantity || quantity < 1) {
    throw new ApiError(400, 'Valid quantity is required');
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!item) {
    throw new ApiError(404, 'Item not found in cart');
  }

  item.quantity = quantity;
  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Cart item updated',
    data: cart
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Item removed from cart',
    data: cart
  });
});

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Cart cleared',
    data: cart
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};