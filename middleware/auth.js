const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  // Get token from cookie or Authorization header
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user info to request
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
}

// Middleware to check membership tier
function requireTier(allowedTiers) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!allowedTiers.includes(req.user.membershipTier)) {
      return res.status(403).json({
        error: 'Access denied. Upgrade your membership to access this content.',
        requiredTier: allowedTiers
      });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  requireTier
};
