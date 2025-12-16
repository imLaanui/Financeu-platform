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
      // Check if this is an HTML page request or API request
      if (req.accepts('html')) {
        return res.redirect('/login?error=authentication_required');
      }
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!allowedTiers.includes(req.user.membershipTier)) {
      // Check if this is an HTML page request or API request
      if (req.accepts('html')) {
        // Redirect to upgrade page or show access denied page
        return res.status(403).send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Upgrade Required - FinanceU</title>
              <link rel="stylesheet" href="/styles.css">
              <style>
                  .upgrade-container {
                      max-width: 600px;
                      margin: 100px auto;
                      padding: 40px;
                      background: white;
                      border-radius: 16px;
                      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                      text-align: center;
                  }
                  .upgrade-icon {
                      font-size: 72px;
                      margin-bottom: 20px;
                  }
                  .upgrade-container h1 {
                      color: #0A1A2F;
                      margin-bottom: 15px;
                  }
                  .upgrade-container p {
                      color: #6B7280;
                      font-size: 18px;
                      line-height: 1.6;
                      margin-bottom: 30px;
                  }
                  .tier-badge {
                      display: inline-block;
                      padding: 8px 16px;
                      background: linear-gradient(135deg, #f59e0b, #f97316);
                      color: white;
                      border-radius: 20px;
                      font-weight: 700;
                      text-transform: uppercase;
                      letter-spacing: 1px;
                      margin-bottom: 30px;
                  }
                  .btn-group {
                      display: flex;
                      gap: 15px;
                      justify-content: center;
                      flex-wrap: wrap;
                  }
                  .btn {
                      padding: 14px 28px;
                      border-radius: 8px;
                      font-weight: 700;
                      text-decoration: none;
                      transition: all 0.2s;
                      font-size: 16px;
                  }
                  .btn-primary {
                      background: linear-gradient(135deg, #f59e0b, #f97316);
                      color: white;
                  }
                  .btn-primary:hover {
                      transform: scale(1.05);
                      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
                  }
                  .btn-secondary {
                      background: #F3F4F6;
                      color: #0A1A2F;
                  }
                  .btn-secondary:hover {
                      background: #E5E7EB;
                  }
              </style>
          </head>
          <body>
              <nav class="navbar">
                  <div class="container">
                      <div class="nav-wrapper">
                          <div class="logo"><a href="/" style="color: inherit; text-decoration: none;">Finance<span class="logo-accent">U</span></a></div>
                      </div>
                  </div>
              </nav>
              <div class="upgrade-container">
                  <div class="upgrade-icon">🔒</div>
                  <h1>Upgrade Required</h1>
                  <div class="tier-badge">PRO / PREMIUM</div>
                  <p>This content is available exclusively for Pro and Premium members. Upgrade your membership to unlock advanced lessons and features!</p>
                  <div class="btn-group">
                      <a href="/dashboard" class="btn btn-secondary">Back to Dashboard</a>
                      <a href="mailto:support@financeu.com?subject=Upgrade%20Request" class="btn btn-primary">Contact to Upgrade</a>
                  </div>
              </div>
          </body>
          </html>
        `);
      }
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
