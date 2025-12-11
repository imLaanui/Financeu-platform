const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Example tier-based access
function requireTier(tier) {
  return (req, res, next) => {
    const tiers = ['free', 'premium', 'pro'];
    if (tiers.indexOf(req.user.membershipTier) < tiers.indexOf(tier)) {
      return res.status(403).json({ error: 'Upgrade your membership to access this content' });
    }
    next();
  };
}

module.exports = { authenticateToken, requireTier };
