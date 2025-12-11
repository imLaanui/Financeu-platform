const pool = require('../config/db');

async function createResetToken(email, code, expiresAt) {
  await pool.query(
    `INSERT INTO reset_tokens (email, code, expires_at, used)
     VALUES ($1, $2, $3, false)`,
    [email, code, expiresAt]
  );
}

async function getResetToken(email, code) {
  const res = await pool.query(
    'SELECT * FROM reset_tokens WHERE email = $1 AND code = $2 AND used = false AND expires_at > NOW()',
    [email, code]
  );
  return res.rows[0];
}

async function markTokenUsed(id) {
  await pool.query('UPDATE reset_tokens SET used = true WHERE id = $1', [id]);
}

module.exports = { createResetToken, getResetToken, markTokenUsed };
