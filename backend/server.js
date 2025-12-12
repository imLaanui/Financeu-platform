require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const { router: authRoutes } = require('./routes/auth');
const userRoutes = require('./routes/users');
const lessonRoutes = require('./routes/lessons');
const feedbackRoutes = require('./routes/feedback');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname));

// Clean URL handling for old HTML pages
app.use((req, res, next) => {
  if (req.path.startsWith('/api/') || path.extname(req.path) !== '') return next();
  const htmlPath = path.join(__dirname, req.path + '.html');
  if (fs.existsSync(htmlPath)) return res.sendFile(htmlPath);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/feedback', feedbackRoutes);

// Home page fallback
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));

// 404 & error handling
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: 'Server error' }); });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
