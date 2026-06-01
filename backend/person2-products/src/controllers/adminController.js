const Category = require('../models/Category');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const buildAdminProductQuery = (queryParams) => {
  const query = {};

  if (queryParams.category) query.category = queryParams.category;
  if (queryParams.isActive !== undefined) query.isActive = queryParams.isActive === 'true';
  if (queryParams.search) query.$text = { $search: queryParams.search };
  if (queryParams.lowStock === 'true') {
    query.$expr = { $lte: ['$inventory.stock', '$inventory.lowStockThreshold'] };
  }

  return query;
};

const getAdminDashboard = asyncHandler(async (req, res) => {
  const [
    totalProducts,
    activeProducts,
    inactiveProducts,
    totalCategories,
    lowStockProducts,
    outOfStockProducts,
    featuredProducts,
    bestsellerProducts,
    inventorySummary,
    latestProducts
  ] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ isActive: false }),
    Category.countDocuments(),
    Product.countDocuments({ $expr: { $lte: ['$inventory.stock', '$inventory.lowStockThreshold'] } }),
    Product.countDocuments({ 'inventory.stock': 0 }),
    Product.countDocuments({ isFeatured: true }),
    Product.countDocuments({ isBestseller: true }),
    Product.aggregate([
      {
        $group: {
          _id: null,
          totalStock: { $sum: '$inventory.stock' },
          totalSold: { $sum: '$inventory.sold' },
          averagePrice: { $avg: '$price' }
        }
      }
    ]),
    Product.find()
      .populate('category', 'name slug')
      .sort('-createdAt')
      .limit(5)
      .select('name slug price discountPrice inventory isActive category createdAt')
  ]);

  const inventory = inventorySummary[0] || { totalStock: 0, totalSold: 0, averagePrice: 0 };

  res.json({
    success: true,
    message: 'Admin product dashboard fetched successfully',
    data: {
      stats: {
        totalProducts,
        activeProducts,
        inactiveProducts,
        totalCategories,
        lowStockProducts,
        outOfStockProducts,
        featuredProducts,
        bestsellerProducts,
        totalStock: inventory.totalStock || 0,
        totalSold: inventory.totalSold || 0,
        averagePrice: Math.round(inventory.averagePrice || 0)
      },
      latestProducts
    }
  });
});

const getAdminProducts = asyncHandler(async (req, res) => {
  const page = Math.max(toNumber(req.query.page, 1), 1);
  const limit = Math.min(Math.max(toNumber(req.query.limit, 20), 1), 100);
  const skip = (page - 1) * limit;
  const sort = req.query.sort || '-createdAt';
  const query = buildAdminProductQuery(req.query);

  const [products, total, categories] = await Promise.all([
    Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(query),
    Category.find().sort({ name: 1 }).select('name slug isActive')
  ]);

  res.json({
    success: true,
    message: 'Admin products fetched successfully',
    data: {
      products,
      categories,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
        count: products.length
      }
    }
  });
});

const getAdminProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.json({
    success: true,
    message: 'Admin product fetched successfully',
    data: product
  });
});

module.exports = {
  getAdminDashboard,
  getAdminProductById,
  getAdminProducts
};
