const express = require('express');
const router = express.Router();
const { submitFeedback, adminGetFeedback, adminDeleteFeedback } = require('../controllers/feedbackController');

router.post('/', submitFeedback);
router.get('/admin', adminGetFeedback);
router.delete('/admin/:id', adminDeleteFeedback);

module.exports = router;
