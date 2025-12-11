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

    // Feedback table
    db.run(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        feedback_type TEXT NOT NULL CHECK(feedback_type IN ('Bug Report', 'Feature Request', 'General Feedback', 'Compliment')),
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating feedback table:', err.message);
      } else {
        console.log('Feedback table ready');
      }
    });

    // Password reset tokens table
    db.run(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        token TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        used BOOLEAN DEFAULT 0
      )
    `, (err) => {
      if (err) {
        console.error('Error creating password_reset_tokens table:', err.message);
      } else {
        console.log('Password reset tokens table ready');
      }
    });
  });
}

// Convert callback-based functions to async/await for consistency with PostgreSQL

// Get user by email (case-insensitive)
async function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email], (err, row) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
}

// Get user by ID
async function getUserById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT id, email, name, membership_tier, created_at FROM users WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
}

// Get all users (admin only)
async function getAllUsers() {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, email, name, membership_tier, created_at FROM users ORDER BY created_at DESC', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

// Create new user
async function createUser(email, hashedPassword, name) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (email, password, name, membership_tier) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, 'free'],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

// Update user membership tier
async function updateUserTier(userId, tier) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET membership_tier = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [tier, userId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

// Update user password (case-insensitive email lookup)
async function updateUserPassword(email, hashedPassword) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE LOWER(email) = LOWER(?)',
      [hashedPassword, email],
      function(err) {
        if (err) reject(err);
        else if (this.changes === 0) reject(new Error('User not found'));
        else resolve();
      }
    );
  });
}

// Mark lesson as completed
async function markLessonComplete(userId, lessonId) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO lesson_progress (user_id, lesson_id, completed, completed_at)
       VALUES (?, ?, 1, CURRENT_TIMESTAMP)
       ON CONFLICT(user_id, lesson_id)
       DO UPDATE SET completed = 1, completed_at = CURRENT_TIMESTAMP`,
      [userId, lessonId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

// Get user's lesson progress
async function getUserProgress(userId) {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT lesson_id, completed, completed_at FROM lesson_progress WHERE user_id = ?',
      [userId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

// Get completed lessons count
async function getCompletedLessonsCount(userId) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT COUNT(*) as count FROM lesson_progress WHERE user_id = ? AND completed = 1',
      [userId],
      (err, row) => {
        if (err) reject(err);
        else resolve({ count: row ? row.count : 0 });
      }
    );
  });
}

// Feedback functions

// Create new feedback
async function createFeedback(name, email, feedbackType, message) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO feedback (name, email, feedback_type, message) VALUES (?, ?, ?, ?)',
      [name || null, email || null, feedbackType, message],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

// Get all feedback
async function getAllFeedback() {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT id, name, email, feedback_type, message, created_at FROM feedback ORDER BY created_at DESC',
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

// Get feedback count
async function getFeedbackCount() {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT COUNT(*) as count FROM feedback',
      [],
      (err, row) => {
        if (err) reject(err);
        else resolve({ count: row ? row.count : 0 });
      }
    );
  });
}

// Delete feedback
async function deleteFeedback(id) {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM feedback WHERE id = ?',
      [id],
      function(err) {
        if (err) reject(err);
        else if (this.changes === 0) reject(new Error('Feedback not found'));
        else resolve();
      }
    );
  });
}

// Password reset token functions

// Create reset token
async function createResetToken(email, token, expiresAt) {
  return new Promise((resolve, reject) => {
    // First, invalidate any existing tokens for this email
    db.run(
      'UPDATE password_reset_tokens SET used = 1 WHERE LOWER(email) = LOWER(?) AND used = 0',
      [email],
      (err) => {
        if (err) {
          reject(err);
          return;
        }

        // Then create new token
        db.run(
          'INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)',
          [email, token, expiresAt],
          function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
          }
        );
      }
    );
  });
}

// Get valid reset token
async function getResetToken(email, token) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM password_reset_tokens
       WHERE LOWER(email) = LOWER(?)
       AND token = ?
       AND used = 0
       AND expires_at > datetime('now')
       ORDER BY created_at DESC
       LIMIT 1`,
      [email, token],
      (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
      }
    );
  });
}

// Get any reset token (including expired/used) for better error messages
async function getAnyResetToken(email, token) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM password_reset_tokens
       WHERE LOWER(email) = LOWER(?)
       AND token = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [email, token],
      (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
      }
    );
  });
}

// Mark token as used
async function markTokenUsed(id) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE password_reset_tokens SET used = 1 WHERE id = ?',
      [id],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

// Clean up expired tokens (optional maintenance)
async function cleanupExpiredTokens() {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM password_reset_tokens WHERE expires_at < datetime('now') OR used = 1",
      [],
      function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
}

module.exports = {
  db,
  getUserByEmail,
  getUserById,
  getAllUsers,
  createUser,
  updateUserTier,
  updateUserPassword,
  markLessonComplete,
  getUserProgress,
  getCompletedLessonsCount,
  createFeedback,
  getAllFeedback,
  getFeedbackCount,
  deleteFeedback,
  createResetToken,
  getResetToken,
  getAnyResetToken,
  markTokenUsed,
  cleanupExpiredTokens
};
