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

const parseJsonValue = (value) => {
  if (typeof value !== 'string') return value;

  const trimmed = value.trim();
  if (!trimmed || !['[', '{'].includes(trimmed[0])) return value;

  try {
    return JSON.parse(trimmed);
  } catch (error) {
    return value;
  }
};

const toImageInputs = (value) => {
  const parsed = parseJsonValue(value);

  if (!parsed) return [];
  if (Array.isArray(parsed)) return parsed;
  if (typeof parsed === 'object') return [parsed];

  return toArray(parsed);
};

const isHttpImageUrl = (value) => {
  try {
    const parsed = new URL(String(value).trim());
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch (error) {
    return false;
  }
};

const buildPublicIdFromUrl = (url) => {
  try {
    const parsed = new URL(url);
    const pathName = parsed.pathname.split('/').filter(Boolean).pop() || parsed.hostname;
    const slug = pathName
      .replace(/\.[a-z0-9]+$/i, '')
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();

    return slug ? `products/${slug}` : undefined;
  } catch (error) {
    return undefined;
  }
};

const normalizeImageInput = (image, fallbackAlt) => {
  if (typeof image === 'string') {
    const url = image.trim();
    if (!isHttpImageUrl(url)) return undefined;
    return {
      url,
      public_id: buildPublicIdFromUrl(url),
      alt: fallbackAlt
    };
  }

  if (!image || typeof image !== 'object') return undefined;

  const url = firstDefined(image.url, image.imageUrl, image.imageURL, image.link, image.href);
  if (!url || !isHttpImageUrl(url)) return undefined;

  return {
    url: String(url).trim(),
    public_id: image.public_id || image.publicId || buildPublicIdFromUrl(url),
    alt: firstDefined(image.alt, image.title, fallbackAlt)
  };
};

const normalizeProductImagesPayload = (body) => {
  const nextBody = { ...body };
  const directImageUrls = [
    ...toArray(firstDefined(body.imageUrl, body.imageURL, body.imageLink, body.image)),
    ...toArray(firstDefined(body.imageUrls, body.imageURLs, body.imageLinks))
  ];
  const providedImages = toImageInputs(body.images);
  const imageInputs = [...providedImages, ...directImageUrls];

  if (imageInputs.length === 0) {
    return nextBody;
  }

  const fallbackAlt = firstDefined(body.imageAlt, body.alt, body.name);
  const normalizedImages = imageInputs
    .map((image) => normalizeImageInput(image, fallbackAlt))
    .filter(Boolean);

  if (normalizedImages.length === 0) {
    throw new ApiError(400, 'At least one valid http or https image URL is required');
  }

  nextBody.images = normalizedImages;
  delete nextBody.imageUrl;
  delete nextBody.imageURL;
  delete nextBody.imageUrls;
  delete nextBody.imageURLs;
  delete nextBody.imageLink;
  delete nextBody.imageLinks;
  delete nextBody.image;
  delete nextBody.imageAlt;
  delete nextBody.alt;

  return nextBody;
};

const toBoolean = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;

  const normalized = String(value).trim().toLowerCase();
  if (['true', '1', 'yes'].includes(normalized)) return true;
  if (['false', '0', 'no'].includes(normalized)) return false;

  return undefined;
};

const toPositiveNumber = (value, fallback, max) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(Math.floor(parsed), max);
};

const toPrice = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
};

const toDiscountPercent = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return undefined;
  return Math.min(Math.floor(parsed), 90);
};

const firstDefined = (...values) => values.find((value) => value !== undefined);

const sortMap = {
  newest: '-createdAt',
  latest: '-createdAt',
  oldest: 'createdAt',
  'price-low': 'price',
  price_low: 'price',
  lowtohigh: 'price',
  price_asc: 'price',
  'price-high': '-price',
  price_high: '-price',
  hightolow: '-price',
  price_desc: '-price',
  rating: '-ratings.average',
  ratings: '-ratings.average',
  bestseller: '-inventory.sold',
  bestselling: '-inventory.sold',
  name: 'name',
  'name-desc': '-name',
  featured: '-isFeatured'
};

const allowedSortFields = new Set([
  'createdAt',
  'price',
  'discountPrice',
  'ratings.average',
  'inventory.sold',
  'name',
  'isFeatured'
]);

const discountRanges = [10, 20, 30, 40, 50, 60, 70, 80, 90];

const resolveSort = (sort) => {
  if (!sort) return '-createdAt';
  const normalizedSort = String(sort).trim();
  if (sortMap[normalizedSort]) return sortMap[normalizedSort];
  if (sortMap[normalizedSort.toLowerCase()]) return sortMap[normalizedSort.toLowerCase()];

  const directionless = normalizedSort.startsWith('-') ? normalizedSort.slice(1) : normalizedSort;
  return allowedSortFields.has(directionless) ? normalizedSort : '-createdAt';
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

const resolveCategoryFilter = async (categoryValue) => {
  const categoriesToMatch = toArray(categoryValue);
  if (categoriesToMatch.length === 0) return undefined;

  const categoryIds = categoriesToMatch.filter((category) => mongoose.Types.ObjectId.isValid(category));
  const categoryNames = categoriesToMatch.filter((category) => !mongoose.Types.ObjectId.isValid(category));

  if (categoryNames.length > 0) {
    const categoryRegexes = categoryNames.map((category) => new RegExp(`^${escapeRegex(category)}$`, 'i'));
    const categories = await Category.find({
      $or: [
        { name: { $in: categoryRegexes } },
        { slug: { $in: categoryRegexes } }
      ]
    }).select('_id');

    categoryIds.push(...categories.map((item) => item._id));
  }

  return categoryIds.length > 0 ? { $in: categoryIds } : { $in: [] };
};

const buildProductQuery = async (queryParams) => {
  const query = {};
  const categoryValue = firstDefined(queryParams.category, queryParams.categorySlug, queryParams.categories);
  const brandList = toArray(firstDefined(queryParams.brand, queryParams.brands));
  const sizeList = toArray(firstDefined(queryParams.size, queryParams.sizes));
  const colorList = toArray(firstDefined(queryParams.color, queryParams.colors));
  const minPrice = toPrice(queryParams.minPrice);
  const maxPrice = toPrice(queryParams.maxPrice);
  const minDiscount = toDiscountPercent(firstDefined(
    queryParams.minDiscount,
    queryParams.discountPercent,
    queryParams.discount
  ));
  const isFeatured = toBoolean(firstDefined(queryParams.isFeatured, queryParams.featured));
  const isBestseller = toBoolean(firstDefined(queryParams.isBestseller, queryParams.bestseller));
  const inStock = toBoolean(queryParams.inStock);

  if (queryParams.isActive === 'all' || queryParams.isActive === '') {
    // Return both active and inactive
  } else if (queryParams.isActive !== undefined) {
    query.isActive = toBoolean(queryParams.isActive);
  } else {
    query.isActive = true;
  }

  if (categoryValue) query.category = await resolveCategoryFilter(categoryValue);
  if (brandList.length > 0) query.brand = { $in: brandList.map((brand) => new RegExp(`^${escapeRegex(brand)}$`, 'i')) };
  if (sizeList.length > 0) query.sizes = { $in: sizeList };
  if (colorList.length > 0) query.colors = { $in: colorList };
  if (isFeatured !== undefined) query.isFeatured = isFeatured;
  if (isBestseller !== undefined) query.isBestseller = isBestseller;

  const search = (queryParams.search || queryParams.q || '').trim();
  if (search) {
    query.$text = { $search: search };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = minPrice;
    if (maxPrice !== undefined) query.price.$lte = maxPrice;
  }

  if (minDiscount !== undefined) {
    query.$expr = {
      $and: [
        { $gt: ['$price', 0] },
        { $gt: ['$discountPrice', 0] },
        {
          $gte: [
            {
              $multiply: [
                {
                  $divide: [
                    { $subtract: ['$price', '$discountPrice'] },
                    '$price'
                  ]
                },
                100
              ]
            },
            minDiscount
          ]
        }
      ]
    };
  }

  if (inStock === true) {
    query['inventory.stock'] = { $gt: 0 };
  } else if (inStock === false) {
    query['inventory.stock'] = { $lte: 0 };
  }

  return query;
};

const getCatalogFilters = async (baseQuery) => {
  const [categories, brands, sizes, colors, priceRange] = await Promise.all([
    Category.find({ isActive: true }).sort({ name: 1 }).select('name slug description image isActive'),
    Product.distinct('brand', baseQuery),
    Product.distinct('sizes', baseQuery),
    Product.distinct('colors', baseQuery),
    Product.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: null,
          min: { $min: '$price' },
          max: { $max: '$price' }
        }
      }
    ])
  ]);

  return {
    categories,
    brands: brands.filter(Boolean).sort(),
    sizes: sizes.filter(Boolean).sort(),
    colors: colors.filter(Boolean).sort(),
    priceRange: priceRange[0] || { min: 0, max: 0 },
    discountRanges,
    sortOptions: Object.keys(sortMap)
  };
};

const getProducts = asyncHandler(async (req, res) => {
  const page = toPositiveNumber(req.query.page, 1, Number.MAX_SAFE_INTEGER);
  const limit = toPositiveNumber(req.query.limit, 12, 100);
  const skip = (page - 1) * limit;
  const sort = resolveSort(req.query.sort);
  const query = await buildProductQuery(req.query);

  const [products, total, filters] = await Promise.all([
    Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .collation({ locale: 'en', strength: 2 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments(query),
    getCatalogFilters({ isActive: true })
  ]);
  const pages = Math.ceil(total / limit);

  res.json({
    success: true,
    message: 'Products fetched successfully',
    data: {
      products: products.map(formatProductForFrontend),
      pagination: {
        page,
        limit,
        pages,
        total,
        count: products.length,
        hasNextPage: page < pages,
        hasPrevPage: page > 1
      },
      sort,
      filters
    }
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (!product.isActive) {
    let isAdmin = false;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded && (decoded.role === 'admin' || decoded.isAdmin)) {
          isAdmin = true;
        }
      } catch (_) {}
    }

    if (!isAdmin) {
      throw new ApiError(404, 'Product not found');
    }
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
  const payload = normalizeProductImagesPayload(req.body);
  if (!payload.inventory || typeof payload.inventory !== 'object') {
    payload.inventory = {
      sku: `SKU-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      stock: 0
    };
  } else if (!payload.inventory.sku) {
    payload.inventory.sku = `SKU-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }

  const product = await Product.create(payload);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: formatProductForFrontend(product)
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const existingProduct = await Product.findById(req.params.id);
  if (!existingProduct) {
    throw new ApiError(404, 'Product not found');
  }

  const payload = normalizeProductImagesPayload(req.body);

  if (payload.inventory && typeof payload.inventory === 'object') {
    payload.inventory = {
      sku: payload.inventory.sku || existingProduct.inventory?.sku || `SKU-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      stock: payload.inventory.stock !== undefined ? Number(payload.inventory.stock) : (existingProduct.inventory?.stock ?? 0),
      lowStockThreshold: payload.inventory.lowStockThreshold !== undefined ? Number(payload.inventory.lowStockThreshold) : (existingProduct.inventory?.lowStockThreshold ?? 5),
      sold: payload.inventory.sold !== undefined ? Number(payload.inventory.sold) : (existingProduct.inventory?.sold ?? 0)
    };
  }

  const product = await Product.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  });

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

const getTrendingProducts = asyncHandler(async (req, res) => {
  const limit = toPositiveNumber(req.query.limit, 10, 50);
  const products = await Product.find({
    isActive: true,
    'inventory.stock': { $gt: 0 }
  })
    .populate('category', 'name slug')
    .sort('-isBestseller -isFeatured -inventory.sold -ratings.average -createdAt')
    .limit(limit);

  res.json({
    success: true,
    message: 'Trending products fetched successfully',
    data: {
      count: products.length,
      products: products.map(formatProductForFrontend)
    }
  });
});

const getPopularSearches = asyncHandler(async (req, res) => {
  const [categories, brands, topProducts] = await Promise.all([
    Category.find({ isActive: true }).sort({ name: 1 }).limit(8).select('name slug'),
    Product.distinct('brand', { isActive: true }),
    Product.find({ isActive: true })
      .sort('-inventory.sold -ratings.average')
      .limit(6)
      .select('name slug')
  ]);

  const popularSearches = [
    ...categories.map((category) => ({
      label: category.name,
      type: 'category',
      value: category.slug
    })),
    ...brands.filter(Boolean).sort().slice(0, 6).map((brand) => ({
      label: brand,
      type: 'brand',
      value: brand
    })),
    ...topProducts.map((product) => ({
      label: product.name,
      type: 'product',
      value: product.slug
    }))
  ];

  res.json({
    success: true,
    message: 'Popular searches fetched successfully',
    data: {
      count: popularSearches.length,
      popularSearches
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
  getNewArrivals,
  getTrendingProducts,
  getPopularSearches,
  _private: {
    buildProductQuery,
    resolveSort,
    normalizeProductImagesPayload,
    toImageInputs,
    toArray,
    toBoolean,
    toDiscountPercent,
    toPrice
  }
};
