# 🚀 GitHub + Vercel Deployment (Step-by-Step)

## Complete Checklist to Get AXIS Live

---

## Step 1: Create GitHub Repository (2 minutes)

### On GitHub.com:
1. Go to https://github.com/new
2. Fill in details:
   - **Repository name:** `axis-psychotherapy-companion`
   - **Description:** "Sharp, perceptive AI thinking partner for psychotherapy (OpenRouter + Next.js)"
   - **Visibility:** Public (recommended) or Private
   - **Don't** initialize with README (you already have one)
3. Click "Create repository"

### Back in Terminal:
```bash
cd /home/trip/Downloads/axis---psychotherapy-companion

# Add remote and push
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/axis-psychotherapy-companion.git
git push -u origin main
```

✅ **Your code is now on GitHub!**

---

## Step 2: Deploy to Vercel (2 minutes)

### Option A: Vercel Dashboard (Easiest)

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Paste your GitHub URL:
   ```
   https://github.com/YOUR_USERNAME/axis-psychotherapy-companion
   ```
4. Click "Import"
5. **Configure Project:**
   - Framework Preset: `Next.js` (auto-detected)
   - Root Directory: `.` (default)
   - Build Command: `npm run build` (default)
6. Click "Continue"

7. **Add Environment Variables:**
   - Variable Name: `NEXT_PUBLIC_OPENROUTER_API_KEY`
   - Value: Paste your OpenRouter API key from https://openrouter.ai/keys
   - Click "Add"

8. Click "Deploy"
9. **Wait 30-60 seconds...**
10. ✅ Your app is live! You'll see a deployment URL like:
    ```
    https://axis-psychotherapy-companion-abc123.vercel.app
    ```

### Option B: Vercel CLI (If you have it)

```bash
npm install -g vercel
vercel --prod
# Follow prompts, add environment variable when asked
```

---

## Step 3: Test Your Deployment

1. **Visit your Vercel URL**
2. **Test the session:**
   - Fill in Challenge Level (pick any)
   - Type an intention
   - Click "Begin Session"
3. **Chat with AXIS:**
   - Type a message
   - Verify AXIS responds
4. **Test End Session:**
   - Click "End Session" button
   - Select language (EN/ES)
   - Try export options (Print, Markdown, JSON)
5. **Check mobile:**
   - Open on phone (responsive design)

✅ **Everything working? You're done!**

---

## Step 4: Update GitHub on Code Changes

After deployment, here's how to update:

```bash
# Make code changes locally
# Test with: npm run dev

# When ready to push:
git add .
git commit -m "Description of changes"
git push origin main

# Vercel auto-deploys in ~30 seconds
# Check status at: https://vercel.com/dashboard
```

---

## 📋 Pre-Deployment Checklist

- [ ] GitHub account created
- [ ] OpenRouter API key obtained (https://openrouter.ai/keys)
- [ ] Code pushed to GitHub `main` branch
- [ ] Vercel account created (free at vercel.com)
- [ ] Environment variable `NEXT_PUBLIC_OPENROUTER_API_KEY` added to Vercel
- [ ] Deployment completed without errors
- [ ] Live URL tested in browser
- [ ] Session creation tested
- [ ] Chat functionality verified
- [ ] Export options work (print, markdown, JSON)

---

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| **GitHub Repo** | https://github.com/YOUR_USERNAME/axis-psychotherapy-companion |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Live App** | https://axis-psychotherapy-companion-xyz.vercel.app |
| **OpenRouter Keys** | https://openrouter.ai/keys |
| **Firebase Console** | https://console.firebase.google.com |

---

## 🆘 Troubleshooting

### "API Key Missing" Error on Live Site
**Solution:**
1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Verify `NEXT_PUBLIC_OPENROUTER_API_KEY` is set
3. Click "Redeploy" button in Deployments tab
4. Wait 30 seconds and refresh

### "Build Failed" Error
**Solution:**
1. Check Vercel build logs (click on failed deployment)
2. Common issues:
   - Missing `npm install` step (Vercel handles this)
   - TypeScript errors (run `npm run lint` locally to debug)
3. Fix locally and push to GitHub
4. Vercel will auto-redeploy

### Deployment Stuck
**Solution:**
- Cancel deployment in Vercel dashboard
- Push a new commit to GitHub
- New deployment will trigger automatically

---

## 📊 After Going Live

### Monitor Performance
1. **Vercel Dashboard:**
   - Check deployment status
   - Monitor function execution time
   - View error logs if issues occur

2. **Real-world testing:**
   - Try different challenge levels
   - Test in different browsers
   - Check on mobile devices
   - Try export features

### Share Your App
```
Check out AXIS - an AI thinking partner:
https://axis-psychotherapy-companion-xyz.vercel.app
```

---

## 🎉 Success!

Once deployed, you have:
- ✅ Production-ready Next.js app
- ✅ Auto-deploys from GitHub
- ✅ Free HTTPS & CDN
- ✅ OpenRouter API integration
- ✅ Firebase authentication
- ✅ Firestore session storage
- ✅ Custom domain support (optional)

**Your AXIS instance is live and ready to help users think more clearly.** 🧠

---

## Optional: Custom Domain

1. **Buy a domain** at any registrar (Vercel, Namecheap, GoDaddy, etc.)
2. **In Vercel Dashboard:**
   - Project → Settings → Domains
   - Add your domain
   - Follow DNS setup instructions
   - Wait 5-10 minutes for propagation
3. **Access at:** https://youraxisdomain.com

---

## Next Features to Add

Now that you're live, consider:
- [ ] Add session history view
- [ ] Implement response streaming (for faster feedback)
- [ ] Add voice input (speech-to-text)
- [ ] Support more languages
- [ ] Analytics (understand usage patterns)
- [ ] Rate limiting (prevent API abuse)
- [ ] Custom branding/white-label option

---

**Questions?** Check [SETUP.md](SETUP.md) and [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guides.

**You've got this!** 🚀
