const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {

  try {

    // Get token from headers
    const authHeader = req.headers.authorization;

    if(!authHeader){
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const secret = process.env.JWT_SECRET || 'your_jwt_secret';
    const decoded = jwt.verify(
      token,
      secret
    );

    // Store user data in req
    req.user = decoded;

    next();

  } catch(error){

    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });

  }

};

module.exports = authMiddleware;