const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : String(value).split(',').map((item) => item.trim()).filter(Boolean);
};

const formatProductForFrontend = (product) => {
  const productObject = typeof product.toObject === 'function' ? product.toObject() : product;
  const populatedCategory = productObject.category && typeof productObject.category === 'object'
    ? productObject.category
    : null;

  return {
    ...productObject,
    category: populatedCategory ? populatedCategory.name : productObject.category,
    categoryId: populatedCategory ? populatedCategory._id : productObject.category,
    sizes: productObject.sizes || [],
    colors: productObject.colors || [],
    images: productObject.images || []
  };
};

const resolveCategoryFilter = async (category) => {
  if (!category) return undefined;

  if (mongoose.Types.ObjectId.isValid(category)) {
    return category;
  }

  const categoryRegex = new RegExp(`^${escapeRegex(category)}$`, 'i');
  const categories = await Category.find({
    $or: [
      { name: categoryRegex },
      { slug: categoryRegex }
    ]
  }).select('_id');

  return categories.length > 0 ? { $in: categories.map((item) => item._id) } : null;
};

const buildProductQuery = async (queryParams) => {
  const query = {};

  if (queryParams.category) query.category = await resolveCategoryFilter(queryParams.category);
  if (queryParams.brand) query.brand = new RegExp(escapeRegex(queryParams.brand), 'i');
  if (queryParams.size) query.sizes = { $in: toArray(queryParams.size) };
  if (queryParams.color) query.colors = { $in: toArray(queryParams.color) };
  if (queryParams.isFeatured) query.isFeatured = queryParams.isFeatured === 'true';
  if (queryParams.isBestseller) query.isBestseller = queryParams.isBestseller === 'true';
  if (queryParams.isActive) query.isActive = queryParams.isActive === 'true';

  if (queryParams.search) {
    query.$text = { $search: queryParams.search };
  }

  if (queryParams.minPrice || queryParams.maxPrice) {
    query.price = {};
    if (queryParams.minPrice) query.price.$gte = Number(queryParams.minPrice);
    if (queryParams.maxPrice) query.price.$lte = Number(queryParams.maxPrice);
  }

  if (queryParams.inStock === 'true') {
    query['inventory.stock'] = { $gt: 0 };
  }

  return query;
};

const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const sort = req.query.sort || '-createdAt';
  const query = await buildProductQuery(req.query);

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(query)
  ]);

  res.json({
    success: true,
    message: 'Products fetched successfully',
    data: {
      products: products.map(formatProductForFrontend),
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
        count: products.length
      }
    }
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.json({
    success: true,
    message: 'Product fetched successfully',
    data: formatProductForFrontend(product)
  });
});

const getProductForCart = asyncHandler(async (req, res) => {
  const quantity = Math.max(Number(req.query.quantity) || 1, 1);
  const product = await Product.findAvailableForCart(req.params.id, quantity);

  if (!product) {
    throw new ApiError(400, 'Product is inactive or does not have enough stock');
  }

  res.json({
    success: true,
    message: 'Product is available for cart',
    data: {
      ...formatProductForFrontend(product),
      orderSnapshot: product.toOrderSnapshot()
    }
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: formatProductForFrontend(product)
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: formatProductForFrontend(product)
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.json({
    success: true,
    message: 'Product deleted successfully',
    data: {}
  });
});

const getBestsellers = asyncHandler(async (req, res) => {
  const products = await Product.find({
    isActive: true,
    isBestseller: true,
    'inventory.stock': { $gt: 0 }
  })
    .populate('category', 'name slug')
    .sort('-inventory.sold -ratings.average')
    .limit(Number(req.query.limit) || 10);

  res.json({
    success: true,
    message: 'Bestseller products fetched successfully',
    data: {
      count: products.length,
      products: products.map(formatProductForFrontend)
    }
  });
});

const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find({
    isActive: true,
    'inventory.stock': { $gt: 0 }
  })
    .populate('category', 'name slug')
    .sort('-createdAt')
    .limit(Number(req.query.limit) || 10);

  res.json({
    success: true,
    message: 'New arrival products fetched successfully',
    data: {
      count: products.length,
      products: products.map(formatProductForFrontend)
    }
  });
});

module.exports = {
  getProducts,
  getProductById,
  getProductForCart,
  createProduct,
  updateProduct,
  deleteProduct,
  getBestsellers,
  getNewArrivals
};
