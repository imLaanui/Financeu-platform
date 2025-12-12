const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      membershipTier: user.membership_tier
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.SESSION_EXPIRY || '7d' }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
}

module.exports = { generateToken, verifyToken };
