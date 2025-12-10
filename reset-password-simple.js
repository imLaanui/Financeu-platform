// Quick password reset script - non-interactive
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'financeu.db');
const db = new sqlite3.Database(dbPath);

// Get email and password from command line args
const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.log('Usage: node reset-password-simple.js <email> <new-password>');
  process.exit(1);
}

if (newPassword.length < 6) {
  console.log('❌ Password must be at least 6 characters');
  process.exit(1);
}

async function resetPassword() {
  try {
    console.log('\n🔐 Resetting password for:', email);

    // Hash the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('✓ Password hashed');

    // Update in database
    db.run(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email],
      function(err) {
        if (err) {
          console.error('❌ Error updating password:', err.message);
        } else if (this.changes === 0) {
          console.log('❌ User not found with email:', email);
        } else {
          console.log('✅ Password updated successfully!');
          console.log(`\nYou can now log in with:`);
          console.log(`Email: ${email}`);
          console.log(`Password: ${newPassword}`);
        }
        db.close();
      }
    );
  } catch (error) {
    console.error('Error:', error);
    db.close();
    process.exit(1);
  }
}

resetPassword();
