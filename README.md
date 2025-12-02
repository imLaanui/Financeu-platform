# FinanceU - Student Finance Learning Platform

A full-stack web application for college students to learn essential finance skills. Built with Node.js, Express, SQLite, and vanilla JavaScript.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Three Membership Tiers**:
  - Free (3 lessons)
  - Premium $9.99/month (5 lessons)
  - Pro $19.99/month (all lessons + premium features)
- **Progress Tracking**: Track completed lessons and see your learning progress
- **Interactive Dashboard**: View stats, membership status, and available lessons
- **5 Finance Lessons**:
  1. Budgeting Basics (Free)
  2. Understanding Credit Scores (Free)
  3. Student Loans Explained (Free)
  4. Saving Strategies (Premium)
  5. Investing 101 (Premium)

## Technology Stack

**Backend:**
- Node.js + Express.js
- SQLite3 database
- JWT authentication
- bcryptjs for password hashing
- Cookie-based sessions

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Responsive design
- Clean, modern UI

## Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- npm (comes with Node.js)

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- sqlite3
- bcryptjs
- jsonwebtoken
- cookie-parser
- cors
- dotenv

### 2. Configure Environment Variables

The `.env` file is already created with default values:

```
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
SESSION_EXPIRY=7d
```

**Important:** Change the `JWT_SECRET` to a random string before deploying to production!

### 3. Start the Server

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

You should see:

```
╔═══════════════════════════════════════╗
║   FinanceU Server Running! 🚀         ║
║                                       ║
║   Port: 3000                          ║
║   Environment: development            ║
║                                       ║
║   Access at: http://localhost:3000    ║
╚═══════════════════════════════════════╝
```

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
my-first-project/
├── server.js                 # Main Express server
├── database.js              # SQLite database setup and queries
├── middleware/
│   └── auth.js              # Authentication middleware
├── package.json             # Project dependencies
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── financeu.db             # SQLite database (created automatically)
│
├── index.html              # Landing page
├── login.html              # Login page
├── signup.html             # Registration page
├── dashboard.html          # User dashboard
├── lessons.html            # Lessons overview
├── budgeting-basics.html   # Lesson 1
├── credit-scores.html      # Lesson 2
├── student-loans.html      # Lesson 3
├── saving-strategies.html  # Lesson 4
├── investing-101.html      # Lesson 5
└── styles.css              # Global styles
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### User Profile

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get user profile + stats | Yes |
| PUT | `/api/users/membership` | Update membership tier | Yes |

### Lessons & Progress

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/lessons` | Get all lessons | Yes |
| GET | `/api/lessons/progress` | Get user's progress | Yes |
| POST | `/api/lessons/complete` | Mark lesson complete | Yes |

## Database Schema

### Users Table
```sql
- id (INTEGER PRIMARY KEY)
- email (TEXT UNIQUE)
- password (TEXT, hashed)
- name (TEXT)
- membership_tier (TEXT: 'free', 'premium', 'pro')
- created_at (DATETIME)
- updated_at (DATETIME)
```

### Lesson Progress Table
```sql
- id (INTEGER PRIMARY KEY)
- user_id (INTEGER, foreign key)
- lesson_id (TEXT)
- completed (BOOLEAN)
- completed_at (DATETIME)
```

### Subscriptions Table
```sql
- id (INTEGER PRIMARY KEY)
- user_id (INTEGER, foreign key)
- tier (TEXT)
- status (TEXT: 'active', 'cancelled', 'expired')
- start_date (DATETIME)
- end_date (DATETIME)
```

## Usage Guide

### For Users

1. **Sign Up**: Click "Login" → "Sign up" and create an account
2. **Browse Lessons**: View all available lessons on the Lessons page
3. **Access Dashboard**: See your progress and stats
4. **Complete Lessons**: Read lessons and mark them complete
5. **Upgrade Membership**: Go to pricing to unlock premium lessons

### For Developers

#### Testing Authentication

```javascript
// Register a new user
fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  })
});
```

#### Changing Membership Tier (for testing)

```javascript
// Upgrade to premium
fetch('http://localhost:3000/api/users/membership', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ tier: 'premium' })
});
```

#### Mark Lesson Complete

```javascript
fetch('http://localhost:3000/api/lessons/complete', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ lessonId: 'budgeting-basics' })
});
```

## Common Issues & Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Or change the port in .env
PORT=3001
```

### Database Issues
```bash
# Delete the database and restart (it will recreate)
rm financeu.db
npm start
```

### CORS Errors
- Make sure you're accessing via `http://localhost:3000`, not `file://`
- Server must be running before opening any pages
- Check browser console for specific errors

### Login Not Working
- Clear browser cookies/cache
- Check server logs for errors
- Verify database was created (look for `financeu.db` file)

## Security Notes

⚠️ **Important for Production:**

1. **Change JWT_SECRET**: Use a long, random string
2. **Use HTTPS**: Never use HTTP in production
3. **Environment Variables**: Never commit `.env` to version control
4. **Password Policy**: Enforce stronger passwords
5. **Rate Limiting**: Add rate limiting to prevent brute force
6. **Input Validation**: Add more robust validation
7. **SQL Injection**: Currently using parameterized queries (safe), but add input sanitization
8. **XSS Protection**: Add Content Security Policy headers

## Future Enhancements

- [ ] Payment integration (Stripe)
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Quiz/assessment feature
- [ ] Certificate of completion
- [ ] Social sharing
- [ ] Admin dashboard
- [ ] Analytics tracking

## Development Commands

```bash
# Install dependencies
npm install

# Start server
npm start

# Start with auto-restart (requires nodemon)
npm run dev

# No test scripts yet (add later)
npm test
```

## Contributing

This is a learning project. Feel free to:
- Add new lessons
- Improve styling
- Add features
- Fix bugs
- Enhance documentation

## License

ISC

## Support

For questions or issues:
- Check the troubleshooting section
- Review server logs in terminal
- Check browser console for frontend errors

---

**Built with ❤️ for college students learning finance**
