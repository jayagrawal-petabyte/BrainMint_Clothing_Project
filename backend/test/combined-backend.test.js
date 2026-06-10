const assert = require('assert');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const app = require('../app');
const { connectDatabase } = require('../server');

const mountedRoutes = app._router.stack
  .filter((layer) => layer.regexp)
  .map((layer) => layer.regexp.toString());

const expectedRoutePrefixes = [
  'api\\/auth',
  'api\\/contact',
  'api\\/products',
  'api\\/categories',
  'api\\/admin\\/products',
  'api\\/admin\\/coupons',
  'api\\/coupons',
  'api\\/discounts',
  'api\\/admin\\/analytics',
  'api\\/newsletter',
  'api\\/cart',
  'api\\/wishlist',
  'api\\/orders',
  'api\\/checkout',
  'api\\/payments'
];

expectedRoutePrefixes.forEach((prefix) => {
  assert(
    mountedRoutes.some((route) => route.includes(prefix)),
    `combined backend should mount /${prefix.replace(/\\\//g, '/')}`
  );
});

assert(
  app._router.stack.some((layer) => layer.route && layer.route.path === '/health'),
  'combined backend should expose /health'
);

(async () => {
  const originalMongoUri = process.env.MONGO_URI;
  delete process.env.MONGO_URI;

  await assert.rejects(
    connectDatabase(),
    /MONGO_URI is missing/,
    'database startup should explain when MONGO_URI is missing'
  );

  process.env.MONGO_URI = originalMongoUri;

  console.log('Combined backend routing and database config smoke test passed.');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
