const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'your_jwt_secret';
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    secret,
    {
      expiresIn: "7d"
    }
  );
};

module.exports = generateToken;