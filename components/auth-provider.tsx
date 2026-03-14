'use client';

import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { motion } from 'motion/react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <SignedOut>
        <div className="min-h-screen bg-void-0 flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full p-8 bg-void-2/80 backdrop-blur-md rounded-2xl border border-slate-800/50 shadow-2xl text-center">
            <h1 className="text-4xl font-serif text-slate-100 mb-4 tracking-tight">AXIS</h1>
            <p className="text-slate-400 mb-8">A sharp, perceptive thinking partner.</p>
            <SignInButton mode="modal">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: 'var(--color-void-3)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="w-full py-4 bg-void-4 text-slate-200 font-sans font-medium tracking-wide rounded-lg border border-slate-700/50 hover:border-emerald-500/30 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
              >
                Sign in
              </motion.button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        {children}
      </SignedIn>
    </ClerkProvider>
  );
}
