const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create/connect to SQLite database
const dbPath = path.join(__dirname, 'financeu.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        membership_tier TEXT DEFAULT 'free' CHECK(membership_tier IN ('free', 'premium', 'pro')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
      } else {
        console.log('Users table ready');
      }
    });

    // Lesson progress table
    db.run(`
      CREATE TABLE IF NOT EXISTS lesson_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        lesson_id TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0,
        completed_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id, lesson_id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating lesson_progress table:', err.message);
      } else {
        console.log('Lesson progress table ready');
      }
    });

    // Membership subscriptions table (for future payment integration)
    db.run(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        tier TEXT NOT NULL CHECK(tier IN ('free', 'premium', 'pro')),
        status TEXT DEFAULT 'active' CHECK(status IN ('active', 'cancelled', 'expired')),
        start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        end_date DATETIME,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `, (err) => {
      if (err) {
        console.error('Error creating subscriptions table:', err.message);
      } else {
        console.log('Subscriptions table ready');
      }
    });
  });
}

// Database helper functions

// Get user by email
function getUserByEmail(email, callback) {
  db.get('SELECT * FROM users WHERE email = ?', [email], callback);
}

// Get user by ID
function getUserById(id, callback) {
  db.get('SELECT id, email, name, membership_tier, created_at FROM users WHERE id = ?', [id], callback);
}

// Create new user
function createUser(email, hashedPassword, name, callback) {
  db.run(
    'INSERT INTO users (email, password, name, membership_tier) VALUES (?, ?, ?, ?)',
    [email, hashedPassword, name, 'free'],
    callback
  );
}

// Update user membership tier
function updateUserTier(userId, tier, callback) {
  db.run(
    'UPDATE users SET membership_tier = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [tier, userId],
    callback
  );
}

// Mark lesson as completed
function markLessonComplete(userId, lessonId, callback) {
  db.run(
    `INSERT INTO lesson_progress (user_id, lesson_id, completed, completed_at)
     VALUES (?, ?, 1, CURRENT_TIMESTAMP)
     ON CONFLICT(user_id, lesson_id)
     DO UPDATE SET completed = 1, completed_at = CURRENT_TIMESTAMP`,
    [userId, lessonId],
    callback
  );
}

// Get user's lesson progress
function getUserProgress(userId, callback) {
  db.all(
    'SELECT lesson_id, completed, completed_at FROM lesson_progress WHERE user_id = ?',
    [userId],
    callback
  );
}

// Get completed lessons count
function getCompletedLessonsCount(userId, callback) {
  db.get(
    'SELECT COUNT(*) as count FROM lesson_progress WHERE user_id = ? AND completed = 1',
    [userId],
    callback
  );
}

module.exports = {
  db,
  getUserByEmail,
  getUserById,
  createUser,
  updateUserTier,
  markLessonComplete,
  getUserProgress,
  getCompletedLessonsCount
};
