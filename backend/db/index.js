// Dual database setup: SQLite for local development, PostgreSQL for production
const isProduction = process.env.NODE_ENV === 'production';
const useSQLite = !isProduction && (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost:5432'));

if (useSQLite) {
  console.log('🔧 Using SQLite for local development');
  module.exports = require('./database-sqlite');
} else {
  console.log('🐘 Using PostgreSQL for production');
  module.exports = require('./database-postgres');
}
