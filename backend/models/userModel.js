const { db } = require('../db/database-sqlite');

async function createUser({ name, email, password }) {
  const sql = `
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)
    RETURNING id, name, email
  `;

  return new Promise((resolve, reject) => {
    db.get(sql, [name, email, password], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

async function getUserByEmail(email) {
  const sql = `SELECT * FROM users WHERE email = ?`;
  return new Promise((resolve, reject) => {
    db.get(sql, [email], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

module.exports = { createUser, getUserByEmail };
