// Script to reset user lesson progress in database
// Usage: node reset-user-progress.js <email>

const db = require('./database');

async function resetUserProgress(email) {
    try {
        console.log(`\n🔄 Resetting lesson progress for user: ${email}\n`);

        // Get user
        const user = await db.getUserByEmail(email);
        if (!user) {
            console.error(`❌ User not found: ${email}`);
            process.exit(1);
        }

        console.log(`✅ Found user: ${user.name} (ID: ${user.id})`);

        // Get current progress
        const currentProgress = await db.getUserProgress(user.id);
        console.log(`\n📊 Current progress: ${currentProgress.length} records`);

        if (currentProgress.length > 0) {
            console.log('\nCurrent completed lessons:');
            currentProgress.forEach(p => {
                if (p.completed) {
                    console.log(`  - ${p.lesson_id} (completed: ${p.completed_at})`);
                }
            });
        }

        // Ask for confirmation
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question('\n⚠️  Are you sure you want to DELETE ALL lesson progress for this user? (yes/no): ', async (answer) => {
            if (answer.toLowerCase() === 'yes') {
                // Delete all progress for this user
                const result = await deleteAllProgress(user.id);
                console.log(`\n✅ Successfully deleted ${result.changes || result} progress records`);
                console.log('✅ User can now start fresh with clean progress\n');
            } else {
                console.log('\n❌ Reset cancelled\n');
            }

            readline.close();
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Helper function to delete all progress
async function deleteAllProgress(userId) {
    // Check if using SQLite or Postgres
    const dbType = process.env.DATABASE_TYPE || 'sqlite';

    if (dbType === 'postgres') {
        const { pool } = require('./database-postgres');
        const result = await pool.query(
            'DELETE FROM lesson_progress WHERE user_id = $1',
            [userId]
        );
        return result.rowCount;
    } else {
        // SQLite
        const sqlite3 = require('sqlite3').verbose();
        const path = require('path');
        const dbPath = path.join(__dirname, 'database.sqlite');
        const sqliteDb = new sqlite3.Database(dbPath);

        return new Promise((resolve, reject) => {
            sqliteDb.run(
                'DELETE FROM lesson_progress WHERE user_id = ?',
                [userId],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                    sqliteDb.close();
                }
            );
        });
    }
}

// Get email from command line
const email = process.argv[2];

if (!email) {
    console.error('\n❌ Usage: node reset-user-progress.js <email>\n');
    console.error('Example: node reset-user-progress.js user@example.com\n');
    process.exit(1);
}

// Run the reset
resetUserProgress(email);
