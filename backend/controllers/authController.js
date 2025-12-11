const bcrypt = require('bcryptjs');
const { getUserByEmail, getUserById, createUser, updateUserPassword } = require('../models/userModel');
const { createResetToken, getResetToken, markTokenUsed } = require('../models/resetTokenModel');
const { generateToken } = require('../utils/jwt');

async function register(req, res) { /* move logic from server.js */ }
async function login(req, res) { /* move logic from server.js */ }
async function logout(req, res) { res.clearCookie('token'); res.json({ message: 'Logout successful' }); }
async function forgotPassword(req, res) { /* logic from server.js */ }
async function resetPassword(req, res) { /* logic from server.js */ }
async function getCurrentUser(req, res) { /* logic from server.js */ }

module.exports = { register, login, logout, forgotPassword, resetPassword, getCurrentUser };
