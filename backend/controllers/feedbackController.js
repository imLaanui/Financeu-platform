// Import from db/index.js which exports all database functions
const { createFeedback, getAllFeedback, getFeedbackCount, deleteFeedback } = require('../db');

async function submitFeedback(req, res) {
  try {
    const { name, email, feedbackType, message } = req.body;

    // Validation
    if (!feedbackType || !message) {
      return res.status(400).json({ error: 'Feedback type and message are required' });
    }

    if (message.length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters long' });
    }

    // Create feedback
    const feedbackId = await createFeedback(name, email, feedbackType, message);

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedbackId
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
}

async function adminGetFeedback(req, res) {
  try {
    const feedback = await getAllFeedback();
    const count = await getFeedbackCount();

    res.json({
      feedback,
      total: count
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
}

async function adminDeleteFeedback(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Feedback ID is required' });
    }

    await deleteFeedback(id);

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
}

module.exports = { submitFeedback, adminGetFeedback, adminDeleteFeedback };
