# Deployment Guide - FinanceU on Render

This guide will walk you through deploying your FinanceU finance learning platform to Render.com.

## Pre-Deployment Checklist ✅

Your project is now **production-ready** with these updates:

- ✅ Server listens on `process.env.PORT`
- ✅ `render.yaml` configuration file created
- ✅ All hardcoded `localhost` URLs removed
- ✅ Environment-aware API URL configuration (`config.js`)
- ✅ Secure cookies for production (HTTPS)
- ✅ CORS configured for production domains
- ✅ `package.json` has proper start script

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

Your SQLite database (`financeu.db`) will persist across deployments, but:
- ⚠️ On free tier, database may be lost if service is deleted
- 💡 For production, consider upgrading to PostgreSQL (Render offers managed PostgreSQL)

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

### Issue: Database not persisting

**Solution:** Check file permissions
- Verify `financeu.db` is in root directory
- Check Render logs for SQLite errors
- Consider migrating to PostgreSQL for production

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

To inspect your SQLite database:

1. Use Render Shell (in dashboard)
2. Or add an admin endpoint (not recommended for production without auth)

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

**SQLite Database:**
1. Regularly download database from Render
2. Store backups securely
3. Consider automated backup solution

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

### Migration to PostgreSQL

For serious production use:

1. Add PostgreSQL database in Render
2. Update `database.js` to use PostgreSQL
3. Install `pg` package: `npm install pg`
4. Migrate data from SQLite to PostgreSQL

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
