const assert = require('assert');

process.env.NODE_ENV = 'test';

const { categories, products } = require('../src/seed/seedProducts');
const app = require('../src/app');
const adminRoutes = require('../src/routes/adminRoutes');
const { _private: productControllerPrivate } = require('../src/controllers/productController');

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

(async () => {
  const catalogQuery = await productControllerPrivate.buildProductQuery({
    q: 'hoodie',
    brands: 'UrbanWear,BrainMint',
    sizes: 'M,L',
    colors: '#000000,#FFFFFF',
    featured: 'true',
    minPrice: '500',
    maxPrice: '3000',
    inStock: 'true'
  });

  assert.strictEqual(catalogQuery.isActive, true, 'public catalog should default to active products');
  assert.deepStrictEqual(catalogQuery.sizes, { $in: ['M', 'L'] }, 'catalog should support comma-separated sizes');
  assert.deepStrictEqual(catalogQuery.colors, { $in: ['#000000', '#FFFFFF'] }, 'catalog should support comma-separated colors');
  assert.deepStrictEqual(catalogQuery.price, { $gte: 500, $lte: 3000 }, 'catalog should support price range');
  assert.deepStrictEqual(catalogQuery['inventory.stock'], { $gt: 0 }, 'catalog should support in-stock filtering');
  assert.strictEqual(catalogQuery.isFeatured, true, 'catalog should support featured alias');
  assert.deepStrictEqual(catalogQuery.$text, { $search: 'hoodie' }, 'catalog should support q search alias');

  assert.strictEqual(productControllerPrivate.resolveSort('price-low'), 'price', 'price-low sort should map to ascending price');
  assert.strictEqual(productControllerPrivate.resolveSort('price-high'), '-price', 'price-high sort should map to descending price');
  assert.strictEqual(productControllerPrivate.resolveSort('rating'), '-ratings.average', 'rating sort should map to ratings.average');
  assert.strictEqual(productControllerPrivate.resolveSort('unknown-field'), '-createdAt', 'unknown sort should fall back safely');

  console.log('Person 2 product seed, admin route, and catalog query tests passed.');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
