const bcrypt = require('bcryptjs');
const { createUser, getUserByEmail } = require('../models/userModel');
const { generateToken } = require('../utils/jwt');

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in DB
    const user = await createUser({ name, email, password: hashedPassword });

    // Generate JWT
    const token = generateToken({ id: user.id });

    // Set cookie (optional)
    res.cookie('token', token, { httpOnly: true });

    // Respond
    res.status(201).json({ user: { id: user.id }, token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

const login = async (req, res) => res.status(501).json({ error: 'Not implemented' });
const logout = async (req, res) => res.status(501).json({ error: 'Not implemented' });
const forgotPassword = async (req, res) => res.status(501).json({ error: 'Not implemented' });
const resetPassword = async (req, res) => res.status(501).json({ error: 'Not implemented' });
const getCurrentUser = async (req, res) => res.status(501).json({ error: 'Not implemented' });

module.exports = { register, login, logout, forgotPassword, resetPassword, getCurrentUser };


