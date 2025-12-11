const pool = require('../config/db');

async function getUserByEmail(email) {
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
}

async function getUserById(id) {
  const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return res.rows[0];
}

async function createUser(email, password, name) {
  const res = await pool.query(
    'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id',
    [email, password, name]
  );
  return res.rows[0].id;
}

async function updateUserPassword(email, hashedPassword) {
  await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);
}

async function updateUserTier(userId, tier) {
  await pool.query('UPDATE users SET membership_tier = $1 WHERE id = $2', [tier, userId]);
}

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
  updateUserPassword,
  updateUserTier
};
