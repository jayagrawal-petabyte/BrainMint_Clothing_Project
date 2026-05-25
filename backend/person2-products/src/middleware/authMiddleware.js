const ApiError = require('../utils/ApiError');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication token is required');
  }

  // Person 1 should replace this placeholder with real JWT verification.
  req.user = {
    id: 'temporary-user-id',
    role: req.headers['x-user-role'] || 'user'
  };

  next();
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new ApiError(403, 'Admin access required');
  }

  next();
};

module.exports = {
  protect,
  adminOnly
};
