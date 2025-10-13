// server/middleware/auth.middleware.js

const jwt = require('jsonwebtoken');

// GUARD 1: Checks if the user is logged in at all
const verifyToken = (req, res, next) => {
  // Get token from the Authorization header
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Add the user payload (which includes id and role) to the request object
    req.user = decoded.user;
    next(); // Move on to the next piece of middleware or the final controller
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// GUARD 2: Checks if the logged-in user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next(); // User is an admin, proceed
    } else {
      res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};

module.exports = { verifyToken, isAdmin };