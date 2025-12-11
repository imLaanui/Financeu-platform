const pool = require('../config/db');

async function getUserProgress(userId) {
  const res = await pool.query('SELECT * FROM lesson_progress WHERE user_id = $1', [userId]);
  return res.rows;
}

async function markLessonComplete(userId, lessonId) {
  await pool.query(
    `INSERT INTO lesson_progress (user_id, lesson_id, completed, completed_at)
     VALUES ($1, $2, true, NOW())
     ON CONFLICT (user_id, lesson_id) DO UPDATE SET completed = true, completed_at = NOW()`,
    [userId, lessonId]
  );
}

async function getCompletedLessonsCount(userId) {
  const res = await pool.query(
    'SELECT COUNT(*) FROM lesson_progress WHERE user_id = $1 AND completed = true',
    [userId]
  );
  return res.rows[0];
}

module.exports = { getUserProgress, markLessonComplete, getCompletedLessonsCount };
