const { db } = require('../db/database-sqlite');

// CREATE USER
async function createUser({ name, email, password }) {
  const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

  return new Promise((resolve, reject) => {
    db.run(sql, [name, email, password], function (err) {
      if (err) return reject(err);
      // 'this.lastID' is the ID of the inserted row
      db.get('SELECT id, name, email FROM users WHERE id = ?', [this.lastID], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  });
}

// GET USER BY EMAIL
async function getUserByEmail(email) {
  const sql = `SELECT * FROM users WHERE email = ?`;
  return new Promise((resolve, reject) => {
    db.get(sql, [email], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

// GET USER BY ID
async function getUserById(id) {
  const sql = `
    SELECT
      id,
      name,
      email,
      membership_tier AS membershipTier,
      created_at AS createdAt
    FROM users
    WHERE id = ?
  `;
  return new Promise((resolve, reject) => {
    db.get(sql, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}


// UPDATE USER PASSWORD
async function updateUserPassword(email, hashedPassword) {
  const sql = `UPDATE users SET password = ? WHERE email = ?`;
  return new Promise((resolve, reject) => {
    db.run(sql, [hashedPassword, email], function (err) {
      if (err) return reject(err);
      resolve(this.changes); // number of rows updated
    });
  });
}

module.exports = { createUser, getUserByEmail, getUserById, updateUserPassword };
