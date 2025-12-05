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
    const existingUser = await db.getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = await db.createUser(email, hashedPassword, name);

    // Get the created user
    const user = await db.getUserById(userId);

    if (!user) {
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
    const user = await db.getUserByEmail(email);

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
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.getUserById(req.user.id);

    if (!user) {
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
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== USER PROFILE ROUTES ====================

// Get User Profile
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = await db.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get progress stats
    const result = await db.getCompletedLessonsCount(req.user.id);
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
        totalLessons: 0 // No lessons available yet
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Membership Tier (for testing - in production, this would be protected/payment gateway)
app.put('/api/users/membership', authenticateToken, async (req, res) => {
  try {
    const { tier } = req.body;

    if (!['free', 'premium', 'pro'].includes(tier)) {
      return res.status(400).json({ error: 'Invalid membership tier' });
    }

    await db.updateUserTier(req.user.id, tier);

    res.json({ message: 'Membership updated successfully', tier });
  } catch (error) {
    console.error('Update membership error:', error);
    res.status(500).json({ error: 'Error updating membership' });
  }
});

// ==================== LESSON PROGRESS ROUTES ====================

// Get User's Lesson Progress
app.get('/api/lessons/progress', authenticateToken, async (req, res) => {
  try {
    const progress = await db.getUserProgress(req.user.id);

    res.json({ progress: progress || [] });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Error fetching progress' });
  }
});

// Mark Lesson as Completed
app.post('/api/lessons/complete', authenticateToken, async (req, res) => {
  try {
    const { lessonId } = req.body;

    if (!lessonId) {
      return res.status(400).json({ error: 'Lesson ID is required' });
    }

    await db.markLessonComplete(req.user.id, lessonId);

    res.json({ message: 'Lesson marked as complete', lessonId });
  } catch (error) {
    console.error('Mark lesson complete error:', error);
    res.status(500).json({ error: 'Error marking lesson complete' });
  }
});

// Get Available Lessons (with tier restrictions)
app.get('/api/lessons', authenticateToken, (req, res) => {
  // No lessons available yet - will be populated as content is created
  const lessons = [];

  const userTier = req.user.membershipTier;
  const tierHierarchy = { 'free': 0, 'premium': 1, 'pro': 2 };

  // Mark lessons as accessible based on user's tier
  const lessonsWithAccess = lessons.map(lesson => ({
    ...lesson,
    accessible: tierHierarchy[userTier] >= tierHierarchy[lesson.requiredTier]
  }));

  res.json({ lessons: lessonsWithAccess });
});

// ==================== FEEDBACK ROUTES ====================

// Submit Feedback (public - no authentication required)
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, feedbackType, message } = req.body;

    // Validation
    if (!feedbackType || !message) {
      return res.status(400).json({ error: 'Feedback type and message are required' });
    }

    if (!['Bug Report', 'Feature Request', 'General Feedback', 'Compliment'].includes(feedbackType)) {
      return res.status(400).json({ error: 'Invalid feedback type' });
    }

    if (message.length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters' });
    }

    // Create feedback
    const feedbackId = await db.createFeedback(name, email, feedbackType, message);

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedbackId
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ error: 'Error submitting feedback' });
  }
});

// Admin: Get all feedback (requires admin authentication)
app.get('/api/admin/feedback', async (req, res) => {
  try {
    // Simple admin authentication check
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username !== 'admin' || password !== 'financeu2025') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const feedback = await db.getAllFeedback();
    const feedbackCount = await db.getFeedbackCount();

    res.json({
      feedback,
      total: feedbackCount.count
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ error: 'Error retrieving feedback' });
  }
});

// Admin: Get all users (requires admin authentication)
app.get('/api/admin/users', async (req, res) => {
  try {
    // Simple admin authentication check
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username !== 'admin' || password !== 'financeu2025') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const users = await db.getAllUsers();

    res.json({
      users,
      total: users.length
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Error retrieving users' });
  }
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
