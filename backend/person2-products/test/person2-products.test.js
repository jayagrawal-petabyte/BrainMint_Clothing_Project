const assert = require('assert');

process.env.NODE_ENV = 'test';

const { categories, products } = require('../src/seed/seedProducts');
const app = require('../src/app');
const adminRoutes = require('../src/routes/adminRoutes');
const analyticsRoutes = require('../src/routes/analyticsRoutes');
const couponRoutes = require('../src/routes/couponRoutes');
const newsletterRoutes = require('../src/routes/newsletterRoutes');
const productRoutes = require('../src/routes/productRoutes');
const { _private: productControllerPrivate } = require('../src/controllers/productController');
const { protect } = require('../src/middleware/authMiddleware');

const flattenRoutes = (router, prefix = '') => {
  const routes = [];

  router.stack.forEach((layer) => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).sort();
      routes.push({ path: `${prefix}${layer.route.path}`, methods });
    }
  });

  return routes;
};

const appRoutes = app._router.stack
  .filter((layer) => layer.regexp)
  .map((layer) => layer.regexp.toString());

const adminRouteList = flattenRoutes(adminRoutes);
const analyticsRouteList = flattenRoutes(analyticsRoutes);
const couponRouteList = flattenRoutes(couponRoutes);
const newsletterRouteList = flattenRoutes(newsletterRoutes);
const productRouteList = flattenRoutes(productRoutes);

assert(categories.length >= 6, 'seed should include at least 6 product categories');
assert(products.length >= 10, 'seed should include at least 10 products');
assert(products.some((product) => product.inventory.stock <= product.inventory.lowStockThreshold), 'seed should include a low-stock product');
assert(products.every((product) => product.categorySlug), 'each seed product must map to a category slug');
assert(products.every((product) => product.images.length > 0), 'each seed product should include an image for frontend display');
assert(products.every((product) => product.images.every((image) => image.public_id)), 'each seed image should include public_id');
assert(products.every((product) => product.inventory && Number.isFinite(product.inventory.sold)), 'each seed product should use inventory.sold');
assert(products.every((product) => product.ratings && Number.isFinite(product.ratings.average)), 'each seed product should use ratings');
assert(!products.some((product) => Object.prototype.hasOwnProperty.call(product, 'soldCount')), 'seed products should not use soldCount');
assert(!products.some((product) => Object.prototype.hasOwnProperty.call(product, 'rating')), 'seed products should not use rating');

assert(
  appRoutes.some((route) => route.includes('api\\/admin\\/products')),
  'app should mount admin product routes'
);
assert(
  appRoutes.some((route) => route.includes('api\\/admin\\/coupons')),
  'app should mount admin coupon routes'
);
assert(
  appRoutes.some((route) => route.includes('api\\/admin\\/analytics')),
  'app should mount admin analytics routes'
);
assert(
  appRoutes.some((route) => route.includes('api\\/newsletter')),
  'app should mount newsletter routes'
);
assert(
  adminRouteList.some((route) => route.path === '/panel' && route.methods.includes('get')),
  'admin panel route should be registered'
);
assert(
  adminRouteList.some((route) => route.path === '/dashboard' && route.methods.includes('get')),
  'admin dashboard route should be registered'
);
assert(
  adminRouteList.some((route) => route.path === '/' && route.methods.includes('post')),
  'admin create product route should be registered'
);
assert(
  adminRouteList.some((route) => route.path === '/:id' && route.methods.includes('put') && route.methods.includes('delete')),
  'admin update/delete product routes should be registered'
);
assert(
  couponRouteList.some((route) => route.path === '/' && route.methods.includes('get') && route.methods.includes('post')),
  'admin coupon list/create routes should be registered'
);
assert(
  couponRouteList.some((route) => route.path === '/:id' && route.methods.includes('put') && route.methods.includes('delete')),
  'admin coupon update/delete routes should be registered'
);
assert(
  couponRouteList.some((route) => route.path === '/validate' && route.methods.includes('post')),
  'coupon validation route should be registered'
);
assert(
  analyticsRouteList.some((route) => route.path === '/dashboard' && route.methods.includes('get')),
  'admin sales analytics dashboard route should be registered'
);
assert(
  newsletterRouteList.some((route) => route.path === '/subscribe' && route.methods.includes('post')),
  'newsletter subscribe route should be registered'
);
assert(
  productRouteList.some((route) => route.path === '/:id/reviews' && route.methods.includes('get') && route.methods.includes('post')),
  'product review fetch/submit routes should be registered'
);

let blockedWithoutToken = false;
try {
  protect({ headers: {} }, {}, () => {});
} catch (error) {
  blockedWithoutToken = error.statusCode === 401;
}
assert(blockedWithoutToken, 'protected routes should require an authentication token');

const adminRequest = {
  headers: {
    authorization: 'Bearer test-token',
    'x-user-role': 'admin',
    'x-user-id': 'admin-test-id'
  }
};
protect(adminRequest, {}, () => {});
assert.deepStrictEqual(
  adminRequest.user,
  { id: 'admin-test-id', role: 'admin' },
  'test mode should support temporary admin headers for isolated module tests'
);

(async () => {
  const catalogQuery = await productControllerPrivate.buildProductQuery({
    q: 'hoodie',
    brands: 'UrbanWear,BrainMint',
    sizes: 'M,L',
    colors: '#000000,#FFFFFF',
    featured: 'true',
    minPrice: '500',
    maxPrice: '3000',
    minDiscount: '20',
    inStock: 'true'
  });

  assert.strictEqual(catalogQuery.isActive, true, 'public catalog should default to active products');
  assert.deepStrictEqual(catalogQuery.sizes, { $in: ['M', 'L'] }, 'catalog should support comma-separated sizes');
  assert.deepStrictEqual(catalogQuery.colors, { $in: ['#000000', '#FFFFFF'] }, 'catalog should support comma-separated colors');
  assert.deepStrictEqual(catalogQuery.price, { $gte: 500, $lte: 3000 }, 'catalog should support price range');
  assert(catalogQuery.$expr, 'catalog should support discount percentage filtering');
  assert.deepStrictEqual(catalogQuery['inventory.stock'], { $gt: 0 }, 'catalog should support in-stock filtering');
  assert.strictEqual(catalogQuery.isFeatured, true, 'catalog should support featured alias');
  assert.deepStrictEqual(catalogQuery.$text, { $search: 'hoodie' }, 'catalog should support q search alias');

  assert.strictEqual(productControllerPrivate.toDiscountPercent('90'), 90, 'discount slabs should support 90 percent');
  assert.strictEqual(productControllerPrivate.toDiscountPercent('120'), 90, 'discount slabs should cap at 90 percent');
  assert.strictEqual(productControllerPrivate.resolveSort('price-low'), 'price', 'price-low sort should map to ascending price');
  assert.strictEqual(productControllerPrivate.resolveSort('price-high'), '-price', 'price-high sort should map to descending price');
  assert.strictEqual(productControllerPrivate.resolveSort('rating'), '-ratings.average', 'rating sort should map to ratings.average');
  assert.strictEqual(productControllerPrivate.resolveSort('unknown-field'), '-createdAt', 'unknown sort should fall back safely');

  const imageUrlPayload = productControllerPrivate.normalizeProductImagesPayload({
    name: 'URL Image Product',
    imageUrl: 'https://cdn.example.com/products/url-image-shirt.jpg',
    imageAlt: 'URL image shirt'
  });
  assert.deepStrictEqual(
    imageUrlPayload.images,
    [
      {
        url: 'https://cdn.example.com/products/url-image-shirt.jpg',
        public_id: 'products/url-image-shirt',
        alt: 'URL image shirt'
      }
    ],
    'admin create/update should normalize imageUrl into product images'
  );
  assert.strictEqual(imageUrlPayload.imageUrl, undefined, 'normalized payload should remove imageUrl helper field');

  const imageArrayPayload = productControllerPrivate.normalizeProductImagesPayload({
    name: 'Multi URL Product',
    images: ['https://cdn.example.com/one.png', { link: 'https://cdn.example.com/two.webp', title: 'Second image' }]
  });
  assert.strictEqual(imageArrayPayload.images.length, 2, 'image URL arrays should be accepted');
  assert.strictEqual(imageArrayPayload.images[0].url, 'https://cdn.example.com/one.png', 'string image entries should map to url');
  assert.strictEqual(imageArrayPayload.images[1].alt, 'Second image', 'object image link entries should preserve alt text');

  let blockedInvalidImageUrl = false;
  try {
    productControllerPrivate.normalizeProductImagesPayload({
      imageUrl: 'not-a-valid-image-url'
    });
  } catch (error) {
    blockedInvalidImageUrl = error.statusCode === 400;
  }
  assert(blockedInvalidImageUrl, 'invalid image URL uploads should return a validation error');

  console.log('Person 2 product seed, admin route, and catalog query tests passed.');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
