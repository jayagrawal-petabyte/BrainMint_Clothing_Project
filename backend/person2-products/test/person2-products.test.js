const assert = require('assert');

process.env.NODE_ENV = 'test';

const { categories, products } = require('../src/seed/seedProducts');
const app = require('../src/app');
const adminRoutes = require('../src/routes/adminRoutes');

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

console.log('Person 2 product seed and admin route tests passed.');
