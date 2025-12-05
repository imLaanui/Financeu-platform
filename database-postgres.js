const { Pool } = require('pg');

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false // Required for Render's free PostgreSQL
  } : false
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Initialize database tables
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name VARCHAR(255) NOT NULL,
        membership_tier VARCHAR(20) DEFAULT 'free' CHECK(membership_tier IN ('free', 'premium', 'pro')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table ready');

    // Lesson progress table
    await client.query(`
      CREATE TABLE IF NOT EXISTS lesson_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        lesson_id VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT false,
        completed_at TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id, lesson_id)
      )
    `);
    console.log('Lesson progress table ready');

    // Membership subscriptions table (for future payment integration)
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        tier VARCHAR(20) NOT NULL CHECK(tier IN ('free', 'premium', 'pro')),
        status VARCHAR(20) DEFAULT 'active' CHECK(status IN ('active', 'cancelled', 'expired')),
        start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_date TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Subscriptions table ready');

    // Feedback table
    await client.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        feedback_type VARCHAR(50) NOT NULL CHECK(feedback_type IN ('Bug Report', 'Feature Request', 'General Feedback', 'Compliment')),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Feedback table ready');

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error initializing database:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

// Initialize database on startup
initializeDatabase().catch(err => {
  console.error('Failed to initialize database:', err);
});

// Database helper functions (converted to async/await)

// Get user by email
async function getUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

// Get user by ID
async function getUserById(id) {
  const result = await pool.query(
    'SELECT id, email, name, membership_tier, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

// Get all users (admin only)
async function getAllUsers() {
  const result = await pool.query(
    'SELECT id, email, name, membership_tier, created_at FROM users ORDER BY created_at DESC'
  );
  return result.rows;
}

// Create new user
async function createUser(email, hashedPassword, name) {
  const result = await pool.query(
    'INSERT INTO users (email, password, name, membership_tier) VALUES ($1, $2, $3, $4) RETURNING id',
    [email, hashedPassword, name, 'free']
  );
  return result.rows[0].id;
}

// Update user membership tier
async function updateUserTier(userId, tier) {
  await pool.query(
    'UPDATE users SET membership_tier = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [tier, userId]
  );
}

// Mark lesson as completed
async function markLessonComplete(userId, lessonId) {
  await pool.query(
    `INSERT INTO lesson_progress (user_id, lesson_id, completed, completed_at)
     VALUES ($1, $2, true, CURRENT_TIMESTAMP)
     ON CONFLICT(user_id, lesson_id)
     DO UPDATE SET completed = true, completed_at = CURRENT_TIMESTAMP`,
    [userId, lessonId]
  );
}

// Get user's lesson progress
async function getUserProgress(userId) {
  const result = await pool.query(
    'SELECT lesson_id, completed, completed_at FROM lesson_progress WHERE user_id = $1',
    [userId]
  );
  return result.rows;
}

// Get completed lessons count
async function getCompletedLessonsCount(userId) {
  const result = await pool.query(
    'SELECT COUNT(*) as count FROM lesson_progress WHERE user_id = $1 AND completed = true',
    [userId]
  );
  return { count: parseInt(result.rows[0].count) };
}

// Feedback functions

// Create new feedback
async function createFeedback(name, email, feedbackType, message) {
  const result = await pool.query(
    'INSERT INTO feedback (name, email, feedback_type, message) VALUES ($1, $2, $3, $4) RETURNING id',
    [name || null, email || null, feedbackType, message]
  );
  return result.rows[0].id;
}

// Get all feedback
async function getAllFeedback() {
  const result = await pool.query(
    'SELECT id, name, email, feedback_type, message, created_at FROM feedback ORDER BY created_at DESC'
  );
  return result.rows;
}

// Get feedback count
async function getFeedbackCount() {
  const result = await pool.query('SELECT COUNT(*) as count FROM feedback');
  return { count: parseInt(result.rows[0].count) };
}

module.exports = {
  pool,
  getUserByEmail,
  getUserById,
  getAllUsers,
  createUser,
  updateUserTier,
  markLessonComplete,
  getUserProgress,
  getCompletedLessonsCount,
  createFeedback,
  getAllFeedback,
  getFeedbackCount
};
