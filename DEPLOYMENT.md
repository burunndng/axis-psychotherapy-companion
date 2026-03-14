# AXIS Deployment Guide

## Quick Start (5 minutes)

### 1. Create GitHub Repository

```bash
# Create new repo on GitHub (https://github.com/new)
# Name: `axis-psychotherapy-companion`
# Description: "Sharp, perceptive AI thinking partner for psychotherapy"
# Public/Private: Your choice

# Then run:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/axis-psychotherapy-companion.git
git push -u origin main
```

### 2. Deploy to Vercel

**Option A: Via Vercel Dashboard (Recommended)**
1. Go to [vercel.com](https://vercel.com/new)
2. Click "Import Project"
3. Paste your GitHub repo URL
4. Select project root directory (default is fine)
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_OPENROUTER_API_KEY = your_key_from_openrouter.ai
   ```
6. Click "Deploy"
7. **Done!** Your app is live in 30 seconds

**Option B: Via Vercel CLI**
```bash
npm install -g vercel
vercel --prod
# Follow prompts and add env variables when asked
```

---

## Environment Variables

Create `.env.local` (not committed to git):

```bash
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
```

Get your key from: https://openrouter.ai/keys

---

## Production Checklist

### Pre-Deployment
- [ ] OpenRouter API key obtained and added to Vercel dashboard
- [ ] Firebase config verified (firebase-applet-config.json)
- [ ] All dependencies installed: `npm install`
- [ ] Local build succeeds: `npm run build`
- [ ] Linting passes: `npm run lint`

### Post-Deployment
- [ ] Visit your Vercel URL and test session setup
- [ ] Test chat functionality with a sample message
- [ ] Test "End Session" button and export options (print, markdown, JSON)
- [ ] Test language switcher (EN/ES)
- [ ] Verify Firebase Firestore is saving sessions
- [ ] Check mobile responsiveness

### Monitoring
- Visit Vercel dashboard to check:
  - Deployment logs (if build fails)
  - Function duration (OpenRouter API calls)
  - Error rate (runtime issues)

---

## Architecture Overview

```
AXIS Psychotherapy Companion
├── Frontend: Next.js 15 + React 19 + TypeScript
├── Styling: Tailwind CSS + Motion animations
├── AI: OpenRouter API (Grok 4.1 Flash)
├── Auth/DB: Firebase + Firestore
├── Design System: Alchemical Void (dark, contemplative)
└── Features:
    ├── 5 challenge levels (default, gentle, balanced, intense, socratic)
    ├── Bilingual UI (EN/ES)
    ├── Session export (Print, Markdown, JSON)
    ├── Real-time chat with markdown rendering
    └── Firestore session history
```

---

## Updating Code

After Vercel is deployed:

```bash
# Make changes locally
git add .
git commit -m "Describe your changes"
git push origin main

# Vercel automatically deploys in ~30 seconds
# Check dashboard for status
```

---

## Custom Domain (Optional)

1. In Vercel dashboard, go to your project → Settings → Domains
2. Add your domain (e.g., axis.yourname.com)
3. Follow DNS setup instructions
4. Takes 5-10 minutes to propagate

---

## Troubleshooting

### "API Key Missing" Error
- Check `.env.local` exists locally
- In Vercel dashboard, verify `NEXT_PUBLIC_OPENROUTER_API_KEY` is set
- Redeploy after adding/updating env vars

### Build Fails
- Check build logs in Vercel dashboard
- Run `npm run build` locally to debug
- Ensure all dependencies installed: `npm install`

### Firebase Auth Not Working
- Verify `firebase-applet-config.json` is correct
- Check Firestore security rules in `firestore.rules`
- Test with authenticated user

### Session Export Not Downloading
- Check browser console for errors (F12)
- Verify modern browser (Chrome, Firefox, Safari, Edge)
- Clear browser cache and try again

---

## Performance Tips

- OpenRouter API calls are optimized with temperature 0.8
- Max tokens set to 2000 for response quality
- Markdown rendering is efficient with `react-markdown`
- Session exports use Blob downloads (no server needed)

---

## Security Notes

- OpenRouter API key is never exposed in client code (uses Bearer header)
- Firebase auth handles user identification
- Session data saved to Firestore with user ID scoping
- No passwords stored (Firebase handles auth)
- All HTTPS in production

---

## Support & Feedback

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console (F12)
3. Test locally with `npm run dev`
4. Check OpenRouter API status

---

**Deployed with ❤️ using Vercel + Next.js + OpenRouter**
