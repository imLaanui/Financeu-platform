require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const db = require('./database');
const { authenticateToken, requireTier } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration - works for both development and production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // In development, allow localhost
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    // In production, allow requests from the same origin
    // Render deployments will have the request come from the same domain
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Helper function to generate JWT
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

// ==================== AUTH ROUTES ====================

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    db.getUserByEmail(email, async (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      db.createUser(email, hashedPassword, name, function(err) {
        if (err) {
          return res.status(500).json({ error: 'Error creating user' });
        }

        const userId = this.lastID;

        // Get the created user
        db.getUserById(userId, (err, user) => {
          if (err) {
            return res.status(500).json({ error: 'Error retrieving user' });
          }

          // Generate token
          const token = generateToken(user);

          // Set cookie - works for both development and production
          res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'lax', // 'lax' works for same-domain deployment
            secure: process.env.NODE_ENV === 'production' // true in production (HTTPS)
          });

          res.status(201).json({
            message: 'Registration successful',
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              membershipTier: user.membership_tier
            },
            token
          });
        });
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    db.getUserByEmail(email, async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate token
      const token = generateToken(user);

      // Set cookie - works for both development and production
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'lax', // 'lax' works for same-domain deployment
        secure: process.env.NODE_ENV === 'production' // true in production (HTTPS)
      });

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          membershipTier: user.membership_tier
        },
        token
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});

// Get Current User (Check if logged in)
app.get('/api/auth/me', authenticateToken, (req, res) => {
  db.getUserById(req.user.id, (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        membershipTier: user.membership_tier,
        createdAt: user.created_at
      }
    });
  });
});

// ==================== USER PROFILE ROUTES ====================

// Get User Profile
app.get('/api/users/profile', authenticateToken, (req, res) => {
  db.getUserById(req.user.id, (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get progress stats
    db.getCompletedLessonsCount(req.user.id, (err, result) => {
      const completedCount = result ? result.count : 0;

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          membershipTier: user.membership_tier,
          createdAt: user.created_at
        },
        stats: {
          completedLessons: completedCount,
          totalLessons: 5 // Update this if you add more lessons
        }
      });
    });
  });
});

// Update Membership Tier (for testing - in production, this would be protected/payment gateway)
app.put('/api/users/membership', authenticateToken, (req, res) => {
  const { tier } = req.body;

  if (!['free', 'premium', 'pro'].includes(tier)) {
    return res.status(400).json({ error: 'Invalid membership tier' });
  }

  db.updateUserTier(req.user.id, tier, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating membership' });
    }

    res.json({ message: 'Membership updated successfully', tier });
  });
});

// ==================== LESSON PROGRESS ROUTES ====================

// Get User's Lesson Progress
app.get('/api/lessons/progress', authenticateToken, (req, res) => {
  db.getUserProgress(req.user.id, (err, progress) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching progress' });
    }

    res.json({ progress: progress || [] });
  });
});

// Mark Lesson as Completed
app.post('/api/lessons/complete', authenticateToken, (req, res) => {
  const { lessonId } = req.body;

  if (!lessonId) {
    return res.status(400).json({ error: 'Lesson ID is required' });
  }

  db.markLessonComplete(req.user.id, lessonId, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error marking lesson complete' });
    }

    res.json({ message: 'Lesson marked as complete', lessonId });
  });
});

// Get Available Lessons (with tier restrictions)
app.get('/api/lessons', authenticateToken, (req, res) => {
  const lessons = [
    {
      id: 'budgeting-basics',
      title: 'Budgeting Basics',
      description: 'Learn how to track spending and create a realistic budget',
      url: '/budgeting-basics.html',
      requiredTier: 'free',
      icon: '💰'
    },
    {
      id: 'credit-scores',
      title: 'Understanding Credit Scores',
      description: 'Build excellent credit from scratch',
      url: '/credit-scores.html',
      requiredTier: 'free',
      icon: '📊'
    },
    {
      id: 'student-loans',
      title: 'Student Loans Explained',
      description: 'Navigate student debt with smart strategies',
      url: '/student-loans.html',
      requiredTier: 'free',
      icon: '🎓'
    },
    {
      id: 'saving-strategies',
      title: 'Saving Strategies',
      description: 'Build financial security with practical saving techniques',
      url: '/saving-strategies.html',
      requiredTier: 'premium',
      icon: '🏦'
    },
    {
      id: 'investing-101',
      title: 'Investing 101',
      description: 'Start building wealth early with smart investing',
      url: '/investing-101.html',
      requiredTier: 'premium',
      icon: '📈'
    }
  ];

  const userTier = req.user.membershipTier;
  const tierHierarchy = { 'free': 0, 'premium': 1, 'pro': 2 };

  // Mark lessons as accessible based on user's tier
  const lessonsWithAccess = lessons.map(lesson => ({
    ...lesson,
    accessible: tierHierarchy[userTier] >= tierHierarchy[lesson.requiredTier]
  }));

  res.json({ lessons: lessonsWithAccess });
});

// ==================== STATIC PAGE ROUTES ====================

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Dashboard (requires authentication)
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   FinanceU Server Running! 🚀         ║
║                                       ║
║   Port: ${PORT}                       ║
║   Environment: ${process.env.NODE_ENV || 'development'}           ║
║                                       ║
║   Access at: http://localhost:${PORT}  ║
╚═══════════════════════════════════════╝
  `);
});
