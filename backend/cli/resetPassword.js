const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const readline = require('readline');
const path = require('path');

const dbPath = path.join(__dirname, '../financeu.db'); // adjust path
const db = new sqlite3.Database(dbPath);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function resetPassword() {
  try {
    console.log('\n🔐 Password Reset Tool\n');

    const email = await question('Enter user email: ');
    const newPassword = await question('Enter new password: ');

    if (newPassword.length < 6) {
      console.log('❌ Password must be at least 6 characters');
      rl.close();
      db.close();
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    db.run(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email],
      function(err) {
        if (err) {
          console.error('❌ Error updating password:', err.message);
        } else if (this.changes === 0) {
          console.log('❌ User not found');
        } else {
          console.log('✅ Password updated successfully!');
        }
        rl.close();
        db.close();
      }
    );
  } catch (error) {
    console.error('Error:', error);
    rl.close();
    db.close();
  }
}

resetPassword();
