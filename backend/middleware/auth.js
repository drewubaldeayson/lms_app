// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Failed to authenticate token' });
    }
    req.userData = decoded; // Save decoded token data to request
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = auth;