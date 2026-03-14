# Firebase Configuration Fix

## Error: `auth/unauthorized-domain`

This error occurs when Firebase doesn't recognize your deployed app's domain.

---

## Solution: Authorize Your Domain in Firebase Console

### Step 1: Get Your Vercel URL
After deployment, you'll have a URL like:
```
https://axis-psychotherapy-companion.vercel.app
```

### Step 2: Add Domain to Firebase

1. Go to **Firebase Console**: https://console.firebase.google.com
2. Select your project: `calm-bison-489717-d7`
3. Click **Authentication** in the left menu
4. Click **Settings** (gear icon) in the top-right
5. Go to **Authorized domains** tab
6. Click **Add domain**
7. Paste your Vercel URL (just the domain, no https://):
   ```
   axis-psychotherapy-companion.vercel.app
   ```
8. Click **Add**
9. Wait 5-10 minutes for Firebase to propagate

### Step 3: Test

Refresh your Vercel URL. Firebase auth should now work.

---

## Why This Happens

Firebase requires explicit domain authorization for security. When you deploy to Vercel, you get a new domain that Firebase hasn't seen before.

---

## Localhost Development

For local testing (`npm run dev`), **localhost** and **127.0.0.1** are already pre-authorized in Firebase, so development should work without this step.

---

## Custom Domain (Optional)

If you set up a custom domain (e.g., `axis.yourname.com`), add that domain to Firebase's authorized list as well.

---

## Troubleshooting

**Still getting auth/unauthorized-domain?**

1. Verify the exact domain (check your Vercel URL)
2. Wait 10 minutes (Firebase can take time to propagate)
3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
4. Check browser console for any other errors
5. Verify Firebase config in `firebase-applet-config.json` matches your project

**Can't find Authentication settings?**
- Make sure you're in the correct Firebase project
- Click "Go to console" from the Vercel deployment page if unsure

---

## Quick Reference

| Environment | Authorization | Status |
|------------|---------------|--------|
| localhost:3000 | Pre-authorized | ✅ Works |
| 127.0.0.1:3000 | Pre-authorized | ✅ Works |
| Vercel URL | Manual setup required | ⚙️ Follow steps above |
| Custom domain | Manual setup required | ⚙️ Follow steps above |

---

**Once authorized, Firebase auth will work perfectly on your live site!** 🎉
