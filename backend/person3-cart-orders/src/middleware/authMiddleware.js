const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

// NEED to replace this with Person 1's final auth middleware after integration
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Not authorized, no token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    next(new ApiError(401, 'Not authorized, invalid token'));
  }
};

module.exports = { protect };