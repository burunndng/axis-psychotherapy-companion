# AXIS Setup Guide

## Prerequisites

- Node.js 18+ (check: `node --version`)
- npm or yarn
- Git
- OpenRouter API key (free: https://openrouter.ai)
- Firebase account (free tier available)

---

## Local Development Setup

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/axis-psychotherapy-companion.git
cd axis-psychotherapy-companion
npm install
```

### 2. Configure Environment Variables

Create `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add:

```
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-your_key_here
```

**Get your OpenRouter key:**
1. Go to https://openrouter.ai/keys
2. Create new API key
3. Copy and paste into `.env.local`

### 3. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## How AXIS Works

### Session Configuration

When you start, AXIS asks you to configure:

1. **Challenge Level** (5 options):
   - `default`: Sharp, deeply perceptive
   - `gentle`: Warm but precise, patient
   - `balanced`: Directness with care
   - `intense`: Relentless, breakthrough-focused
   - `socratic`: Questions that illuminate

2. **Session Intention**: What do you want to explore?

3. **Activity Type**: Explore | Debrief | Plan

4. **Help Type**: Process | Decide | Understand | Validate | Vent

5. **Urgency**: Reflective | Crisis

### Chat Interface

- Type or paste your thoughts
- AXIS responds with sharp reflection, observation, or question
- Markdown rendering for formatted responses
- Language selector (EN/ES) in header

### End Session

Click **"End Session"** button to:
1. Generate AI clinical brief
2. Choose export format:
   - 🖨️ **Print**: Opens print-ready document
   - 📥 **Markdown**: Download `.md` file with metadata
   - 📄 **JSON**: Export full session (config + messages + brief)
3. Save session metadata to Firebase Firestore

---

## Project Structure

```
axis---psychotherapy-companion/
├── app/
│   ├── page.tsx              # Main page (SessionSetup → ChatInterface)
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Design system + typography
├── components/
│   ├── chat-interface.tsx    # Chat UI + export menu
│   ├── session-setup.tsx     # Session configuration form
│   └── auth-provider.tsx     # Firebase auth wrapper
├── lib/
│   ├── axis-prompt.ts        # System prompt builder (5 modes)
│   ├── session-export.ts     # Export utilities (EN/ES, print/download)
│   ├── firebase.ts           # Firebase initialization
│   └── utils.ts              # Helper functions
├── hooks/
│   └── use-mobile.ts         # Mobile detection
├── firebase-applet-config.json  # Firebase credentials (PUBLIC)
├── firestore.rules           # Firestore security rules
├── DEPLOYMENT.md             # Deploy to Vercel
├── SETUP.md                  # This file
└── README.md                 # Project overview
```

---

## Key Features

### 🧠 Smart Prompt Engineering
- Comprehensive system prompt with 8 domains of guidance
- Behavioral instructions (How to Be)
- 11 response moves (Name, Reframe, Challenge, etc.)
- Hard stops & crisis protocol
- Mode calibration per challenge level

### 🎨 Alchemical Void Design System
- 5-level dark elevation ladder
- Fluid typography with CSS clamp()
- Motion tokens (120ms–260ms durations)
- Psychological safety first
- Reduced motion support

### 🌍 Bilingual Support
- English (en) & Spanish (es)
- i18n throughout UI
- Localized export metadata
- Language selector in header & debrief

### 📥 Session Export
- **Print**: Formatted HTML with metadata table
- **Markdown**: .md file with session config + brief
- **JSON**: Complete session data for archival
- Auto-generated session IDs & timestamps

### 🔐 Firebase Integration
- User authentication
- Firestore session storage
- Security rules for user privacy
- Automatic timestamps

---

## Development Workflows

### Make Code Changes

```bash
# Edit files in `components/` or `lib/`
# Hot reload happens automatically on save
```

### Update System Prompt

Edit `lib/axis-prompt.ts`:
- Modify identity texts per challenge level
- Update mandate (approach) per mode
- Adjust session context
- All changes reflect immediately

### Add New Language

1. Add language code to `Language` type in `lib/session-export.ts`
2. Add i18n keys to `translations` object
3. Update UI language selector in `components/chat-interface.tsx`

### Run Linting

```bash
npm run lint
```

### Build for Production

```bash
npm run build
npm start
```

---

## Testing

### Manual Testing Checklist

- [ ] Session setup form loads correctly
- [ ] All 5 challenge levels show in dropdown
- [ ] Language selector switches UI text
- [ ] Chat sends message successfully
- [ ] AXIS responds with coherent text
- [ ] "End Session" generates brief
- [ ] Export menu appears on debrief screen
- [ ] Print opens new window
- [ ] Markdown downloads .md file
- [ ] JSON downloads .json file
- [ ] Language affects export metadata
- [ ] "Start New Session" reloads cleanly

### Testing Different Modes

Try each challenge level with same intention:

```
Intention: "I'm feeling stuck between two career paths"

1. Default - Should be sharp and perceptive
2. Gentle - Should be warm and patient
3. Balanced - Should read the moment
4. Intense - Should pressure-test thinking
5. Socratic - Should ask illuminating questions
```

---

## Troubleshooting

### "Cannot find module '@google/genai'"
- This library was removed
- Run `npm install` to ensure latest dependencies

### TypeScript Errors
```bash
npm run lint  # Check for errors
```

### Hot Reload Not Working
- Restart dev server: `npm run dev`
- Clear Next.js cache: `npm run clean && npm run dev`

### Firebase Auth Errors
- Verify `firebase-applet-config.json` is correct
- Check Firestore security rules
- Ensure user is authenticated before ending session

### OpenRouter API 401 Error
- Verify API key in `.env.local`
- Check key hasn't expired on openrouter.ai
- Verify `NEXT_PUBLIC_` prefix is present in env var name

---

## Performance Optimization

Current optimizations:
- OpenRouter uses Grok 4.1 Flash (fast + capable)
- Temperature 0.8 for balanced responses
- Max 2000 tokens per response
- Client-side markdown rendering
- No unnecessary re-renders (React 19 auto batching)

For further optimization:
- Implement response streaming (OpenRouter supports it)
- Cache session briefs in IndexedDB
- Lazy load components

---

## Security Considerations

✅ **What's Secure:**
- OpenRouter API key never exposed to browser (Bearer header)
- Firebase auth handles user identification
- Firestore rules restrict access to user's own sessions
- HTTPS only in production

⚠️ **Be Careful With:**
- Don't commit `.env.local` to git (it's in `.gitignore`)
- Don't share your OpenRouter API key
- Keep Firebase config public (it's meant to be)
- Use HTTPS in production

---

## Contributing

To improve AXIS:

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes
3. Test locally: `npm run dev`
4. Lint: `npm run lint`
5. Commit: `git commit -m "Description of changes"`
6. Push: `git push origin feature/your-feature`
7. Create Pull Request on GitHub

---

## Learning Resources

### Design System
- Read `app/globals.css` for Alchemical Void tokens
- See `lib/session-export.ts` for i18n patterns
- Review `components/chat-interface.tsx` for Motion usage

### System Prompt
- Study `lib/axis-prompt.ts` for prompt engineering
- Note the 8 domains of guidance
- Review challenge level customizations

### Next.js & React
- Official docs: https://nextjs.org & https://react.dev
- This project uses React 19 with Server Components

### Motion & Animation
- Motion library: https://motion.dev
- See `motion.tsx` patterns in components

---

## Support

If you get stuck:

1. **Check local setup**:
   ```bash
   npm run dev
   # Open http://localhost:3000
   # Test core functionality
   ```

2. **Review error logs**:
   - Browser console (F12)
   - Next.js terminal output
   - Vercel dashboard (if deployed)

3. **Verify environment**:
   ```bash
   # Check Node version
   node --version  # Should be 18+

   # Check .env.local exists
   cat .env.local | grep OPENROUTER

   # Check build succeeds
   npm run build
   ```

---

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Add API key to `.env.local`
3. ✅ Start dev server: `npm run dev`
4. ✅ Test session creation and chat
5. ✅ Deploy to Vercel (see `DEPLOYMENT.md`)

---

**Happy exploring! AXIS is ready to think with you. 🧠**
