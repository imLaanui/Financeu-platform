const { db } = require('./db/database-sqlite');

db.serialize(() => {
  const tables = [
    'users',
    'lesson_progress',
    'subscriptions',
    'feedback',
    'password_reset_tokens'
  ];

  tables.forEach((table) => {
    db.run(`DELETE FROM ${table}`, (err) => {
      if (err) {
        console.error(`Error clearing ${table}:`, err);
      } else {
        console.log(`${table} cleared`);
      }
    });
  });

  db.run('VACUUM', (err) => {
    if (err) console.error('Error running VACUUM:', err);
    else console.log('Database vacuumed');
  });
});

db.close(() => {
  console.log('Database connection closed');
});
