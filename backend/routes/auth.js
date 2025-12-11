const express = require('express');
const router = express.Router();
const { register, login, logout, forgotPassword, resetPassword, getCurrentUser } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authenticateToken, getCurrentUser);

module.exports = router;
