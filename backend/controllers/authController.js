const bcrypt = require('bcryptjs');
const { createUser, getUserByEmail, updateUserPassword, getUserById } = require('../models/userModel');
const { createResetToken, getResetToken, markTokenUsed } = require('../models/resetTokenModel');
const { generateToken, verifyToken } = require('../utils/jwt');

// REGISTER
async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const existingUser = await getUserByEmail(email);
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, password: hashedPassword });
    const token = generateToken({ id: user.id });

    res.cookie('token', token, { httpOnly: true });
    res.status(201).json({ user: { id: user.id }, token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// LOGIN
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const token = generateToken(user); // pass full user object
    res.cookie('token', token, { httpOnly: true });
    res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// LOGOUT
async function logout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
}

// FORGOT PASSWORD
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.status(400).json({ error: 'No account found with that email' });

    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString(); // 1 hour

    await createResetToken(email, token, expiresAt);

    // TODO: send email with reset link (example: `${frontendURL}/reset-password?token=${token}&email=${email}`)
    console.log(`Reset link for ${email}: http://localhost:5173/reset-password?token=${token}&email=${email}`);

    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// RESET PASSWORD
async function resetPassword(req, res) {
  try {
    const { email, token, newPassword } = req.body;
    const resetToken = await getResetToken(email, token);
    if (!resetToken) return res.status(400).json({ error: 'Invalid or expired token' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(email, hashedPassword);
    await markTokenUsed(resetToken.id);

    res.json({ message: 'Password has been reset' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// GET CURRENT USER
async function getCurrentUser(req, res) {
  try {
    const userId = req.user.id; // set by authenticateToken
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ user });
  } catch (err) {
    console.error('Get current user error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { register, login, logout, forgotPassword, resetPassword, getCurrentUser };
