require('dotenv').config();

const connectDB = require('../config/db');
const Category = require('../models/Category');
const Product = require('../models/Product');

const categories = [
  {
    name: 'Hoodie',
    slug: 'hoodie',
    description: 'Comfortable hoodies for casual wear.'
  },
  {
    name: 'T-Shirt',
    slug: 't-shirt',
    description: 'Everyday t-shirts in multiple fits and colors.'
  },
  {
    name: 'Jeans',
    slug: 'jeans',
    description: 'Denim jeans for daily styling.'
  }
];

const products = [
  {
    name: 'Oversized Hoodie',
    slug: 'oversized-hoodie',
    description: 'Soft oversized hoodie with a relaxed streetwear fit.',
    brand: 'UrbanWear',
    categorySlug: 'hoodie',
    price: 2499,
    discountPrice: 1999,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000000', '#FFFFFF', '#808080'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
        alt: 'Oversized Hoodie'
      }
    ],
    inventory: {
      sku: 'HD-101',
      stock: 20,
      lowStockThreshold: 5
    },
    rating: {
      average: 4.5,
      count: 120
    },
    isFeatured: true,
    isBestseller: true,
    isActive: true
  },
  {
    name: 'Classic Cotton T-Shirt',
    slug: 'classic-cotton-t-shirt',
    description: 'Breathable cotton t-shirt for everyday wear.',
    brand: 'UrbanWear',
    categorySlug: 't-shirt',
    price: 999,
    discountPrice: 699,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#000000', '#FFFFFF', '#1E90FF'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        alt: 'Classic Cotton T-Shirt'
      }
    ],
    inventory: {
      sku: 'TS-201',
      stock: 45,
      lowStockThreshold: 8
    },
    rating: {
      average: 4.3,
      count: 84
    },
    isFeatured: true,
    isBestseller: false,
    isActive: true
  },
  {
    name: 'Slim Fit Denim Jeans',
    slug: 'slim-fit-denim-jeans',
    description: 'Stretch denim jeans with a clean slim fit.',
    brand: 'DenimCo',
    categorySlug: 'jeans',
    price: 2999,
    discountPrice: 2399,
    sizes: ['30', '32', '34', '36'],
    colors: ['#1F3A5F', '#000000'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
        alt: 'Slim Fit Denim Jeans'
      }
    ],
    inventory: {
      sku: 'JN-301',
      stock: 30,
      lowStockThreshold: 5
    },
    rating: {
      average: 4.2,
      count: 67
    },
    isFeatured: false,
    isBestseller: true,
    isActive: true
  }
];

const seedProducts = async () => {
  await connectDB();

  const categoryMap = {};

  for (const category of categories) {
    const savedCategory = await Category.findOneAndUpdate(
      { slug: category.slug },
      category,
      { new: true, upsert: true, runValidators: true }
    );

    categoryMap[category.slug] = savedCategory._id;
  }

  for (const product of products) {
    const { categorySlug, ...productData } = product;

    await Product.findOneAndUpdate(
      { 'inventory.sku': product.inventory.sku },
      {
        ...productData,
        category: categoryMap[categorySlug]
      },
      { new: true, upsert: true, runValidators: true }
    );
  }

  console.log(`Seeded ${categories.length} categories and ${products.length} products`);
};

seedProducts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
