const pool = require('../config/db');

async function createFeedback(name, email, type, message) {
  const res = await pool.query(
    'INSERT INTO feedback (name, email, type, message) VALUES ($1, $2, $3, $4) RETURNING id',
    [name, email, type, message]
  );
  return res.rows[0].id;
}

async function getAllFeedback() {
  const res = await pool.query('SELECT * FROM feedback ORDER BY created_at DESC');
  return res.rows;
}

async function getFeedbackCount() {
  const res = await pool.query('SELECT COUNT(*) FROM feedback');
  return res.rows[0];
}

async function deleteFeedback(id) {
  await pool.query('DELETE FROM feedback WHERE id = $1', [id]);
}

module.exports = { createFeedback, getAllFeedback, getFeedbackCount, deleteFeedback };
