const express = require('express');
const router = express.Router();
const { register, login, logout, forgotPassword, resetPassword, getCurrentUser } = require('../controllers/authController');
const { verifyToken } = require('../utils/jwt');

// Middleware
function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authenticateToken, getCurrentUser);

// Export both router and middleware
module.exports = { router, authenticateToken };
