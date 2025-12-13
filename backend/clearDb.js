const { db } = require('./db/database-sqlite');

console.log('Starting database cleanup...');

db.serialize(() => {
  const tables = [
    'password_reset_tokens',
    'lesson_progress',
    'subscriptions',
    'feedback',
    'users'
  ];

  let completed = 0;

  tables.forEach((table) => {
    db.run(`DELETE FROM ${table}`, (err) => {
      if (err) {
        console.error(`Error clearing ${table}:`, err);
      } else {
        console.log(`✓ ${table} cleared`);
      }
     
      completed++;

      // Once all tables are cleared, vacuum and close
      if (completed === tables.length) {
        db.run('VACUUM', (err) => {
          if (err) {
            console.error('Error running VACUUM:', err);
          } else {
            console.log('✓ Database vacuumed');
          }

          db.close((err) => {
            if (err) {
              console.error('Error closing database:', err);
            } else {
              console.log('✓ Database connection closed');
              console.log('\n🎉 Database cleared successfully!');
            }
          });
        });
      }
    });
  });
});
