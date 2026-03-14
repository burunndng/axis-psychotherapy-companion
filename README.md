# AXIS — Psychotherapy Companion

> A sharp, deeply perceptive AI thinking partner for psychological clarity and insight.

AXIS is a contemplative web application that helps users understand their emotional patterns, thinking traps, decisions, and inner conflicts through precise reflection and honest challenge. Built with **OpenRouter API (Grok 4.1 Flash)**, **Next.js 15**, and the **Alchemical Void** design system.

---

## ✨ Features

### 🧠 5 Challenge Levels
Choose how AXIS meets you:
- **Default**: Sharp, deeply perceptive
- **Gentle**: Warm but precise, patient
- **Balanced**: Directness with care
- **Intense**: Relentless, breakthrough-focused
- **Socratic**: Questions that illuminate

### 🌍 Bilingual (EN/ES)
Full support for English and Spanish across UI and session exports.

### 📥 Session Export
Generate clinical session briefs in multiple formats:
- 🖨️ **Print**: Formatted HTML document
- 📄 **Markdown**: `.md` file with metadata
- 📋 **JSON**: Complete session data

### 🎨 Alchemical Void Design
Dark, contemplative, psychologically safe interface:
- 5-level elevation system
- Fluid typography with CSS clamp()
- Motion tokens optimized for serious UX
- Reduced motion support
- Jewel-tone accents (emerald, purple, teal)

### 🔐 Firebase Integration
- User authentication
- Firestore session storage
- Secure, privacy-focused

### 💬 Live Chat
Real-time conversation with markdown rendering, language selection, and smooth animations.

---

## 🚀 Quick Start

### Local Development (5 minutes)

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/axis-psychotherapy-companion.git
cd axis-psychotherapy-companion

# Install dependencies
npm install

# Create .env.local with your OpenRouter API key
echo "NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-your_key_here" > .env.local

# Start dev server
npm run dev
```

Open http://localhost:3000 in your browser.

**Get OpenRouter API key:** https://openrouter.ai/keys (free account)

### Deploy to Vercel (2 minutes)

1. Push to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repo
4. Add `NEXT_PUBLIC_OPENROUTER_API_KEY` environment variable
5. Click "Deploy"

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## 📋 How It Works

### 1. Session Setup
Configure your session:
- Challenge level (5 options)
- Session intention
- Activity type (Explore/Debrief/Plan)
- Help type (Process/Decide/Understand/Validate/Vent)
- Urgency (Reflective/Crisis)

### 2. Live Chat
- Type thoughts or paste text
- AXIS responds with observation, reframe, or question
- Markdown formatting for structure
- Language can be switched anytime

### 3. End Session
- Click "End Session" button
- AXIS generates clinical brief
- Choose export format (Print/Markdown/JSON)
- Session saved to Firestore

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 + React 19 + TypeScript |
| **Styling** | Tailwind CSS 4.1.11 + Motion animations |
| **AI** | OpenRouter API (Grok 4.1 Flash) |
| **Auth/DB** | Firebase + Firestore |
| **Export** | Client-side Blob downloads |
| **Design** | Alchemical Void system (dark, contemplative) |

---

## 📁 Project Structure

```
axis---psychotherapy-companion/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Main page (setup → chat → debrief)
│   ├── layout.tsx           # Root layout + Firebase provider
│   └── globals.css          # Design system (Alchemical Void)
├── components/              # React components
│   ├── chat-interface.tsx   # Chat UI + export menu
│   ├── session-setup.tsx    # Session configuration form
│   └── auth-provider.tsx    # Firebase auth wrapper
├── lib/                     # Utilities
│   ├── axis-prompt.ts       # System prompt (5 challenge levels)
│   ├── session-export.ts    # Export functions (EN/ES, print/download)
│   ├── firebase.ts          # Firebase initialization
│   └── utils.ts             # Helper functions
├── SETUP.md                 # Local development guide
├── DEPLOYMENT.md            # Vercel deployment guide
└── README.md                # This file
```

---

## 🎯 System Prompt Architecture

AXIS's system prompt includes:

1. **Identity** - Who AXIS is (5 different identities per challenge level)
2. **Role & Scope** - What AXIS is NOT (therapist, crisis service, friend)
3. **Mandate** - How to approach based on challenge level
4. **How to Be** - Behavioral framework (read, meet, contribute, earn, lead, follow)
5. **Moves** - 11 response techniques (Name, Reframe, Challenge, etc.)
6. **Hard Stops** - What never to do
7. **Mode Calibration** - Per-level instructions
8. **End-of-Session Brief** - Structured clinical format

---

## 🎨 Design System

**Colors (Elevation Ladder):**
```css
--color-void-0: #020617  /* Base void - page background */
--color-void-1: #030712  /* Deep panels */
--color-void-2: #0B1120  /* Cards */
--color-void-3: #111827  /* Active state */
--color-void-4: #1F2937  /* Modals */
```

**Motion Tokens:**
- Micro-interactions: 120–160ms
- Context changes: 220–260ms
- Spring config: `stiffness: 220, damping: 26, mass: 0.9`

**Typography:**
- Headings: Serif (Cormorant Garamond)
- Body: Sans-serif (default Tailwind)
- Fluid scaling with CSS clamp()

See [app/globals.css](app/globals.css) for full design tokens.

---

## 🌐 Internationalization

AXIS supports English and Spanish:

- **UI Text**: Session setup, buttons, labels
- **Export Metadata**: Session brief headers, metadata tables
- **Error Messages**: Localized feedback

Language selector in header lets users switch anytime.

To add more languages, update `i18n` in `components/chat-interface.tsx` and `lib/session-export.ts`.

---

## 📤 Session Export

### Markdown Format
```markdown
# Clinical Session Brief

**Session ID:** AXIS-1710425600000-ABC123XYZ
**Exported on:** March 13, 2026, 10:30 AM

...[formatted brief with metadata]...
```

### JSON Format
```json
{
  "metadata": {
    "sessionId": "AXIS-...",
    "timestamp": "2026-03-13T10:30:00.000Z",
    "language": "en"
  },
  "config": { "challengeLevel": "default", ... },
  "messages": [ { "role": "user", "text": "..." }, ... ],
  "briefContent": "..."
}
```

---

## 🔐 Security

✅ **Secure:**
- OpenRouter API key never exposed (Bearer header only)
- Firebase auth for user identification
- Firestore rules restrict access to user's sessions
- HTTPS in production
- No passwords stored

⚠️ **Never commit:**
- `.env.local` (add to `.gitignore`)
- Firebase private keys
- OpenRouter API key (use environment variables)

---

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Local development, testing, troubleshooting
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to Vercel, custom domain, monitoring

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes and test locally: `npm run dev`
4. Lint: `npm run lint`
5. Commit: `git commit -m "Description"`
6. Push: `git push origin feature/your-feature`
7. Create Pull Request

---

## 📊 Performance

- **AI Model**: Grok 4.1 Flash (fast, capable)
- **Response Quality**: Temperature 0.8, max 2000 tokens
- **Frontend**: Client-side rendering, zero backend API
- **Session Export**: Blob downloads (no server needed)
- **Animations**: Optimized spring configs, respects reduced-motion

---

## 🛠 Development Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Check code style
npm run clean    # Clear Next.js cache
```

---

## 🐛 Troubleshooting

**"API Key Missing" error:**
- Verify `.env.local` exists with `NEXT_PUBLIC_OPENROUTER_API_KEY`
- Restart dev server after adding env vars

**Build fails:**
- Run `npm install` to ensure all dependencies
- Check `npm run lint` for TypeScript errors

**Firebase auth errors:**
- Verify `firebase-applet-config.json` is valid
- Check Firestore security rules

See [SETUP.md](SETUP.md#troubleshooting) for more help.

---

## 📝 License

This project is private. Use for personal or internal use.

---

## 🎯 Next Steps

1. **Local Setup**: Follow [SETUP.md](SETUP.md)
2. **Test Sessions**: Create a few sessions with different challenge levels
3. **Deploy**: Follow [DEPLOYMENT.md](DEPLOYMENT.md)
4. **Customize**: Modify system prompt in `lib/axis-prompt.ts`
5. **Extend**: Add features, languages, or export formats

---

**Built with clarity, precision, and care.** ✨

AXIS is a tool for understanding. Use it wisely.
