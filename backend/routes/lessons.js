const express = require('express');
const router = express.Router();
const { getProgress, completeLesson, getLessons } = require('../controllers/lessonController');
const { authenticateToken } = require('../middleware/auth');

router.get('/progress', authenticateToken, getProgress);
router.post('/complete', authenticateToken, completeLesson);
router.get('/', authenticateToken, getLessons);

module.exports = router;
