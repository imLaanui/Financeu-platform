const { createFeedback, getAllFeedback, getFeedbackCount, deleteFeedback } = require('../models/feedbackModel');

async function submitFeedback(req, res) { /* logic from server.js */ }
async function adminGetFeedback(req, res) { /* logic from server.js */ }
async function adminDeleteFeedback(req, res) { /* logic from server.js */ }

module.exports = { submitFeedback, adminGetFeedback, adminDeleteFeedback };
