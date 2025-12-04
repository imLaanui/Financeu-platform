# Deployment Guide - FinanceU on Render

This guide will walk you through deploying your FinanceU finance learning platform to Render.com with PostgreSQL.

## Pre-Deployment Checklist ✅

Your project is now **production-ready** with these updates:

- ✅ Server listens on `process.env.PORT`
- ✅ `render.yaml` configuration file created
- ✅ All hardcoded `localhost` URLs removed
- ✅ Environment-aware API URL configuration (`config.js`)
- ✅ Secure cookies for production (HTTPS)
- ✅ CORS configured for production domains
- ✅ `package.json` has proper start script
- ✅ **Migrated from SQLite to PostgreSQL for persistent storage**

## 🗄️ PostgreSQL Setup (REQUIRED)

**Important:** The app now uses PostgreSQL instead of SQLite for persistent data storage on Render.

### Step 1: Create PostgreSQL Database on Render

1. Go to your [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** and select **"PostgreSQL"**
3. Configure your database:
   - **Name**: `financeu-db` (or any name you prefer)
   - **Database**: `financeu`
   - **User**: (auto-generated)
   - **Region**: Choose the **same region** as your web service
   - **PostgreSQL Version**: 14 or higher
   - **Plan**: **Free** (or paid for production)
4. Click **"Create Database"**
5. Wait for provisioning (1-2 minutes)

### Step 2: Get Database Connection String

After creation, you'll see two connection strings:
- **Internal Database URL**: Use this for your Render web service (faster, recommended)
- **External Database URL**: Use this for local development

Copy the **Internal Database URL** - it looks like:
```
postgresql://username:password@dpg-xxxxx-a.oregon-postgres.render.com/financeu_xxxx
```

### Step 3: Add DATABASE_URL to Your Web Service

**Before deploying your web service**, you need to add the database connection:

1. When creating your web service (or in existing service settings)
2. Go to **"Environment"** tab
3. Add this environment variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the "Internal Database URL" from PostgreSQL
4. Add other required variables:
   - `NODE_ENV=production`
   - `JWT_SECRET=your-secure-random-string` (generate with command below)
   - `SESSION_EXPIRY=7d`

**Generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

5. Click **"Save Changes"**

### Step 4: Database Tables Auto-Creation

The database tables (`users`, `lesson_progress`, `subscriptions`) will be created automatically when your app first connects to PostgreSQL. No manual SQL needed!

## Deployment Steps

### 1. Create a GitHub Repository

First, push your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - FinanceU ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/financeu.git
git branch -M main
git push -u origin main
```

### 2. Sign Up for Render

1. Go to https://render.com
2. Click **"Get Started"** or **"Sign Up"**
3. Sign up with your GitHub account (easiest option)
4. Authorize Render to access your repositories

### 3. Deploy Your Application

#### Option A: Using render.yaml (Recommended - Automatic)

1. In Render dashboard, click **"New +"** → **"Blueprint"**
2. Connect your GitHub repository
3. Render will automatically detect `render.yaml`
4. Click **"Apply"**
5. Your app will deploy automatically!

#### Option B: Manual Deployment

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:

   **Basic Settings:**
   - Name: `financeu-backend` (or any name you prefer)
   - Region: Choose closest to your users
   - Branch: `main`
   - Root Directory: Leave blank
   - Runtime: **Node**

   **Build & Deploy:**
   - Build Command: `npm install`
   - Start Command: `npm start`

   **Plan:**
   - Select **Free** (for testing) or **Starter** (for production)

4. Click **"Advanced"** and add Environment Variables:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `[generate a long random string]`
   - `SESSION_EXPIRY` = `7d`

   **To generate a secure JWT_SECRET:**
   ```bash
   # Run in terminal
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

5. Click **"Create Web Service"**

### 4. Wait for Deployment

- First deployment takes 2-5 minutes
- Watch the logs in real-time
- You'll see: "FinanceU Server Running! 🚀"
- Your app will be available at: `https://financeu-backend.onrender.com`

### 5. Test Your Deployed App

1. Visit your Render URL: `https://your-app-name.onrender.com`
2. You should see your FinanceU landing page
3. Try signing up and logging in
4. Check the dashboard and lessons

## Important Notes

### Free Tier Limitations

Render's free tier:
- ✅ Great for testing and small projects
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ First request after spin-down takes 30-60 seconds
- ⚠️ 750 hours/month free (enough for one app running 24/7)

**Upgrade to Starter ($7/month) for:**
- No spin-down
- Faster performance
- Custom domains
- More resources

### Database Persistence

Your PostgreSQL database provides persistent storage:
- ✅ Data persists across deployments and restarts
- ✅ Separate from web service (more reliable)
- ⚠️ Free tier: 1 GB storage, shared resources
- 💡 For production, upgrade to a paid PostgreSQL plan for better performance and backups

### Environment Variables

**CRITICAL:** Your `JWT_SECRET` in production should be:
- Long (64+ characters)
- Random
- Never committed to Git
- Different from development

Generate one:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Custom Domain (Optional)

To use your own domain:

1. In Render dashboard, go to your service
2. Click **"Settings"** → **"Custom Domain"**
3. Add your domain (e.g., `www.financeu.com`)
4. Follow DNS instructions to point your domain to Render
5. Render automatically provides free SSL certificate

## Troubleshooting

### Issue: "Application failed to respond"

**Solution:** Check logs in Render dashboard
- Look for error messages
- Verify all environment variables are set
- Ensure `PORT` is not hardcoded

### Issue: Can't log in after deployment

**Solution:** Check cookies
- Open browser DevTools → Application → Cookies
- Verify cookies are being set with `Secure` flag
- Try in incognito mode to clear old cookies

### Issue: API requests failing

**Solution:** Check CORS settings
- Verify `config.js` is loaded in all HTML files
- Check browser console for CORS errors
- Ensure credentials are included in fetch requests

### Issue: Database connection errors

**Solution:** Verify PostgreSQL connection
- Check that DATABASE_URL environment variable is set correctly
- Verify PostgreSQL database is running (check Render dashboard)
- Look for connection errors in server logs
- Ensure SSL is enabled (automatic on Render)

## Monitoring Your App

### View Logs

In Render dashboard:
1. Click on your service
2. Go to **"Logs"** tab
3. See real-time server logs

### Monitor Uptime

Render provides:
- Automatic health checks
- Deploy notifications
- Performance metrics (on paid plans)

### Check Database

To inspect your PostgreSQL database:

1. Use the Render dashboard to view database metrics
2. Connect via psql using the External Database URL:
   ```bash
   psql "postgresql://username:password@host:port/database"
   ```
3. Or use a PostgreSQL client like pgAdmin or DBeaver

## Updating Your App

### Automatic Deploys

By default, Render auto-deploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update feature X"
git push

# Render automatically deploys!
```

### Manual Deploys

In Render dashboard:
1. Go to your service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

## Production Best Practices

### Security Checklist

- ✅ Use strong JWT_SECRET (64+ random characters)
- ✅ Enable HTTPS (automatic on Render)
- ✅ Use environment variables for secrets
- ✅ Never commit `.env` to Git
- ✅ Implement rate limiting (future enhancement)
- ✅ Validate all user input
- ✅ Keep dependencies updated

### Performance Optimization

```bash
# Add to package.json for production optimization
"scripts": {
  "start": "NODE_ENV=production node server.js",
  "build": "npm install --production"
}
```

### Backup Strategy

**PostgreSQL Database:**
1. Render's paid plans include automatic daily backups
2. Free tier: manually export data periodically using pg_dump
3. Consider third-party backup services for critical data

```bash
# Manual backup command (using External Database URL)
pg_dump "postgresql://username:password@host:port/database" > backup.sql
```

**Code:**
- Always in Git/GitHub ✅
- Use branches for features
- Tag releases

## Scaling Your App

### When to Upgrade

Upgrade from free tier when:
- You have regular users (avoid spin-down delay)
- You need better performance
- You want custom domain
- Database grows large

### Database Scaling

For serious production use, consider:

1. Upgrading to a paid PostgreSQL plan for better performance
2. Setting up automated backups
3. Enabling connection pooling (already configured)
4. Monitoring query performance

## Payment Integration (Future)

To add real payment processing:

1. **Stripe Integration:**
   - Sign up for Stripe
   - Add `stripe` package
   - Create webhook endpoints
   - Handle subscription events

2. **Environment Variables:**
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`

3. **Update Membership Flow:**
   - Replace manual tier updates
   - Add payment pages
   - Handle subscription webhooks

## Support & Resources

- **Render Documentation:** https://render.com/docs
- **Render Community:** https://community.render.com
- **Your App Logs:** Available in Render dashboard
- **Status Page:** https://status.render.com

## Quick Reference

### Your App URLs

- **Production:** `https://your-app-name.onrender.com`
- **API Base:** `https://your-app-name.onrender.com/api`
- **Dashboard:** `https://your-app-name.onrender.com/dashboard`

### Key Commands

```bash
# Local development
npm install
npm start

# Deploy to production
git add .
git commit -m "Your message"
git push

# View logs (in Render dashboard)
# Check environment variables (in Render settings)
```

---

## 🚀 You're Ready to Deploy!

Your FinanceU app is fully configured for production deployment on Render. Just follow the steps above and you'll be live in minutes!

**Questions?** Check the troubleshooting section or Render's documentation.

**Good luck with your deployment!** 🎉
