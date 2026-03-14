# Clerk Authentication Setup

This project uses **Clerk** for authentication instead of Firebase. Clerk provides a modern, secure authentication solution with zero configuration needed on your end.

## Quick Setup (2 minutes)

### Step 1: Create Clerk Application

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Sign up or log in with your account
3. Click **Create Application**
4. Choose your authentication providers (Google, GitHub, Email, etc.)
5. Click **Create**

### Step 2: Get Your API Keys

1. In the Clerk dashboard, go to **API Keys** (left sidebar)
2. Copy **Publishable Key** and paste into `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
   ```
3. Copy **Secret Key** and paste into `.env.local`:
   ```
   CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxx
   ```

### Step 3: Configure Allowed Origins

1. In Clerk dashboard, go to **Settings** → **URLs**
2. Add your development and production URLs:
   - **Development**: `http://localhost:3000`
   - **Production**: `https://your-domain.vercel.app`

### Step 4: Run Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` — you should see a sign-in button.

## Deployment to Vercel

### Step 1: Add Environment Variables to Vercel

1. Go to your Vercel project settings
2. Click **Environment Variables**
3. Add:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
4. Click **Save**

### Step 2: Update Clerk Allowed Origins

In Clerk dashboard, add your Vercel URL to **Settings** → **URLs**:
```
https://your-project.vercel.app
```

### Step 3: Deploy

```bash
git push origin main
```

Vercel will auto-deploy with your environment variables.

## How It Works

- **Sign-in Page**: Users see a Clerk-managed sign-in modal
- **Session Management**: Clerk automatically manages user sessions
- **User Data**: Access via `useUser()` hook in components
- **Sign-out**: Built-in sign-out button in user menu

## Customization

### Styling Clerk Components

Clerk components can be styled via CSS variables. Add to `app/globals.css`:

```css
:root {
  --clerk-primary-color: #10b981;
  --clerk-accent-color: #9333ea;
}
```

### Accessing User Information

In any client component:

```typescript
'use client';
import { useUser } from '@clerk/nextjs';

export function MyComponent() {
  const { user } = useUser();

  return (
    <div>
      Welcome, {user?.firstName}!
    </div>
  );
}
```

## Common Issues

**"Invalid API key"**
- Check that you've added both `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
- Ensure keys are from the same Clerk application

**"Invalid origin"**
- Add your current URL to Clerk dashboard **Settings** → **URLs**
- For localhost, ensure `http://localhost:3000` is whitelisted

**"Sign-in not working"**
- Verify environment variables are loaded (restart `npm run dev`)
- Check browser console for errors

## Support

- Clerk Docs: [https://clerk.com/docs](https://clerk.com/docs)
- Clerk Support: [https://support.clerk.com](https://support.clerk.com)

---

**AXIS is now secured with Clerk authentication!** 🔐
