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
  },
  {
    name: 'Shirt',
    slug: 'shirt',
    description: 'Casual and smart shirts for everyday styling.'
  },
  {
    name: 'Jacket',
    slug: 'jacket',
    description: 'Layering jackets for streetwear and travel.'
  },
  {
    name: 'Joggers',
    slug: 'joggers',
    description: 'Comfort-first joggers for active days.'
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
      lowStockThreshold: 5,
      sold: 72
    },
    ratings: {
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
      lowStockThreshold: 8,
      sold: 31
    },
    ratings: {
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
      lowStockThreshold: 5,
      sold: 46
    },
    ratings: {
      average: 4.2,
      count: 67
    },
    isFeatured: false,
    isBestseller: true,
    isActive: true
  },
  {
    name: 'Graphic Street T-Shirt',
    slug: 'graphic-street-t-shirt',
    description: 'Premium cotton tee with a bold front graphic print.',
    brand: 'BrainMint',
    categorySlug: 't-shirt',
    price: 1299,
    discountPrice: 899,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#111827', '#F97316'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1',
        alt: 'Graphic Street T-Shirt'
      }
    ],
    inventory: {
      sku: 'TS-202',
      stock: 36,
      lowStockThreshold: 6,
      sold: 58
    },
    ratings: {
      average: 4.6,
      count: 94
    },
    isFeatured: true,
    isBestseller: true,
    isActive: true
  },
  {
    name: 'Linen Resort Shirt',
    slug: 'linen-resort-shirt',
    description: 'Lightweight linen-blend shirt for warm-weather outfits.',
    brand: 'Coastline',
    categorySlug: 'shirt',
    price: 2199,
    discountPrice: 1699,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#F8FAFC', '#60A5FA', '#22C55E'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
        alt: 'Linen Resort Shirt'
      }
    ],
    inventory: {
      sku: 'SH-401',
      stock: 24,
      lowStockThreshold: 5,
      sold: 22
    },
    ratings: {
      average: 4.4,
      count: 51
    },
    isFeatured: false,
    isBestseller: false,
    isActive: true
  },
  {
    name: 'Oxford Button Down Shirt',
    slug: 'oxford-button-down-shirt',
    description: 'Crisp oxford shirt with a structured collar and soft handfeel.',
    brand: 'NorthForm',
    categorySlug: 'shirt',
    price: 2399,
    discountPrice: 1899,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['#FFFFFF', '#93C5FD'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf',
        alt: 'Oxford Button Down Shirt'
      }
    ],
    inventory: {
      sku: 'SH-402',
      stock: 18,
      lowStockThreshold: 5,
      sold: 17
    },
    ratings: {
      average: 4.1,
      count: 39
    },
    isFeatured: false,
    isBestseller: false,
    isActive: true
  },
  {
    name: 'Lightweight Bomber Jacket',
    slug: 'lightweight-bomber-jacket',
    description: 'Transitional bomber jacket with rib trims and utility pockets.',
    brand: 'UrbanWear',
    categorySlug: 'jacket',
    price: 3999,
    discountPrice: 3299,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#0F172A', '#16A34A'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923',
        alt: 'Lightweight Bomber Jacket'
      }
    ],
    inventory: {
      sku: 'JK-501',
      stock: 14,
      lowStockThreshold: 4,
      sold: 41
    },
    ratings: {
      average: 4.7,
      count: 73
    },
    isFeatured: true,
    isBestseller: true,
    isActive: true
  },
  {
    name: 'Denim Trucker Jacket',
    slug: 'denim-trucker-jacket',
    description: 'Classic washed denim jacket with metal button closure.',
    brand: 'DenimCo',
    categorySlug: 'jacket',
    price: 3599,
    discountPrice: 2899,
    sizes: ['M', 'L', 'XL'],
    colors: ['#1D4ED8', '#111827'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234',
        alt: 'Denim Trucker Jacket'
      }
    ],
    inventory: {
      sku: 'JK-502',
      stock: 9,
      lowStockThreshold: 4,
      sold: 19
    },
    ratings: {
      average: 4.2,
      count: 44
    },
    isFeatured: false,
    isBestseller: false,
    isActive: true
  },
  {
    name: 'Performance Joggers',
    slug: 'performance-joggers',
    description: 'Tapered joggers with stretch fabric and secure zipper pockets.',
    brand: 'MoveLab',
    categorySlug: 'joggers',
    price: 1999,
    discountPrice: 1499,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#111827', '#64748B'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea',
        alt: 'Performance Joggers'
      }
    ],
    inventory: {
      sku: 'JG-601',
      stock: 28,
      lowStockThreshold: 6,
      sold: 33
    },
    ratings: {
      average: 4.5,
      count: 62
    },
    isFeatured: true,
    isBestseller: false,
    isActive: true
  },
  {
    name: 'Fleece Lounge Joggers',
    slug: 'fleece-lounge-joggers',
    description: 'Soft fleece joggers with a relaxed fit for daily comfort.',
    brand: 'BrainMint',
    categorySlug: 'joggers',
    price: 1799,
    discountPrice: 1299,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#94A3B8', '#000000', '#7C3AED'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
        alt: 'Fleece Lounge Joggers'
      }
    ],
    inventory: {
      sku: 'JG-602',
      stock: 3,
      lowStockThreshold: 5,
      sold: 9
    },
    ratings: {
      average: 4.0,
      count: 26
    },
    isFeatured: false,
    isBestseller: false,
    isActive: true
  },
  {
    name: 'Relaxed Cargo Jeans',
    slug: 'relaxed-cargo-jeans',
    description: 'Relaxed denim cargos with roomy pockets and durable stitching.',
    brand: 'DenimCo',
    categorySlug: 'jeans',
    price: 3299,
    discountPrice: 2699,
    sizes: ['30', '32', '34', '36', '38'],
    colors: ['#334155', '#1E3A8A'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a',
        alt: 'Relaxed Cargo Jeans'
      }
    ],
    inventory: {
      sku: 'JN-302',
      stock: 16,
      lowStockThreshold: 5,
      sold: 21
    },
    ratings: {
      average: 4.3,
      count: 47
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

if (require.main === module) {
  seedProducts()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
}

module.exports = {
  categories,
  products,
  seedProducts
};
