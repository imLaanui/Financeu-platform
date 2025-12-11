const express = require('express');
const router = express.Router();
const { getProfile, updateMembership } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

router.get('/profile', authenticateToken, getProfile);
router.put('/membership', authenticateToken, updateMembership);

module.exports = router;
