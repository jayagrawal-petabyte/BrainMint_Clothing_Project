const Cart = require('../models/Cart');
const Product = require('../../person2-products/src/models/Product');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Checkout - validate cart and prepare order summary
// @route   POST /api/checkout
// @access  Private
const checkout = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;

  if (
    !shippingAddress ||
    !shippingAddress.fullName ||
    !shippingAddress.address ||
    !shippingAddress.city ||
    !shippingAddress.state ||
    !shippingAddress.pincode ||
    !shippingAddress.phone
  ) {
    throw new ApiError(400, 'Complete shipping address is required');
  }

  const cart = await Cart.findOne({ user: req.user.id }).populate(
    'items.product',
    'name price discountPrice images inventory.stock isActive'
  );

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Cart is empty, cannot proceed to checkout');
  }

  // Validate each item using Person 2's findAvailableForCart helper
  const validatedItems = [];
  let totalPrice = 0;

  for (const item of cart.items) {
    const product = await Product.findAvailableForCart(
      item.product._id,
      item.quantity
    );

    if (!product) {
      throw new ApiError(
        400,
        `Product "${item.product.name}" is unavailable or has insufficient stock. Please update your cart.`
      );
    }

    const effectivePrice = product.discountPrice || product.price;

    validatedItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url || null,
      quantity: item.quantity,
      price: effectivePrice
    });

    totalPrice += effectivePrice * item.quantity;
  }

  res.status(200).json({
    success: true,
    message: 'Checkout summary ready. Proceed to payment.',
    data: {
      items: validatedItems,
      shippingAddress,
      totalPrice,
      totalItems: validatedItems.length
    }
  });
});

module.exports = { checkout };