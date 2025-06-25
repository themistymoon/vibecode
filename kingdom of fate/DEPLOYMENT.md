# 🚀 Deployment Guide

This guide covers multiple free deployment options for Kingdoms of Fate.

## 🌟 Recommended: Vercel + Convex

### Step 1: Prepare Your Repository
1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

### Step 2: Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Vercel auto-detects Vite configuration
5. Add environment variable:
   - `VITE_CONVEX_URL`: Get this from your Convex dashboard
6. Click "Deploy"
7. Your app will be live at `https://your-app-name.vercel.app`

### Step 3: Deploy Backend to Convex
1. In your project directory:
   ```bash
   npx convex deploy --prod
   ```
2. This creates a production Convex deployment
3. Update your Vercel environment variable with the new production URL

## 🔧 Alternative: Netlify + Convex

### Step 1: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables:
   - `VITE_CONVEX_URL`: Your Convex production URL
6. Deploy!

### Step 2: Deploy Convex Backend
```bash
npx convex deploy --prod
```

## 📱 GitHub Pages (Static Only)

**Note**: GitHub Pages only hosts static sites, so you'll still need Convex for the backend.

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to package.json scripts:
   ```json
   "homepage": "https://yourusername.github.io/kingdoms-of-fate",
   "scripts": {
     "predeploy": "npm run build",
     "deploy-gh": "gh-pages -d dist"
   }
   ```

3. Deploy:
   ```bash
   npm run deploy-gh
   ```

## 🔑 Environment Variables Setup

### For Vercel:
1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add: `VITE_CONVEX_URL` with your Convex production URL

### For Netlify:
1. Go to your Netlify site dashboard
2. Site settings → Environment variables
3. Add: `VITE_CONVEX_URL` with your Convex production URL

### For Convex (Optional Performance Boost):
1. Go to your Convex dashboard
2. Settings → Environment Variables
3. Add (optional):
   - `OPENAI_API_KEY`: Your OpenAI API key for better performance
   - `RESEND_API_KEY`: For email features (if needed)

## 🌐 Custom Domain (Optional)

### Vercel:
1. Go to your project dashboard
2. Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions

### Netlify:
1. Go to your site dashboard
2. Domain settings → Add custom domain
3. Follow DNS configuration instructions

## 📊 Monitoring & Analytics

### Vercel Analytics:
- Automatically included in Vercel deployments
- View in your Vercel dashboard

### Convex Monitoring:
- View function logs in Convex dashboard
- Monitor database usage and performance

## 🔄 Continuous Deployment

Both Vercel and Netlify support automatic deployments:

1. **Automatic**: Every push to main branch triggers deployment
2. **Manual**: Deploy only when you want via dashboard
3. **Preview**: Pull requests get preview deployments

## 💰 Cost Breakdown (Free Tiers)

### Vercel Free Tier:
- ✅ 100GB bandwidth/month
- ✅ Unlimited personal projects
- ✅ Custom domains
- ✅ SSL certificates

### Netlify Free Tier:
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Custom domains
- ✅ SSL certificates

### Convex Free Tier:
- ✅ 1M function calls/month
- ✅ 8GB database storage
- ✅ Real-time subscriptions
- ✅ Built-in authentication

## 🚨 Production Checklist

Before deploying to production:

- [ ] Test the game thoroughly in development
- [ ] Set up production Convex deployment
- [ ] Configure environment variables
- [ ] Test with production API endpoints
- [ ] Verify all features work (save/load, combat, etc.)
- [ ] Check mobile responsiveness
- [ ] Test audio playback on different browsers
- [ ] Monitor initial deployment for errors

## 🆘 Deployment Troubleshooting

### Build Fails:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment Variables Not Working:
- Ensure variables start with `VITE_` for frontend
- Redeploy after adding environment variables
- Check variable names match exactly

### Convex Connection Issues:
- Verify `VITE_CONVEX_URL` is correct
- Ensure Convex deployment is active
- Check network connectivity

### Audio Not Playing:
- Browsers require user interaction before playing audio
- Ensure audio files are in `public/sounds/` directory
- Check file formats are supported (MP3 recommended)

## 📞 Getting Help

If you encounter deployment issues:

1. Check the deployment logs in your hosting platform
2. Verify all environment variables are set correctly
3. Test locally with production environment variables
4. Check Convex dashboard for backend errors
5. Open an issue on GitHub with detailed error information

---

**Your epic adventure awaits deployment!** 🏰✨
