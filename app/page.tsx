'use client';

import { useState } from 'react';
import { SessionSetupPage } from '@/components/session-setup';
import { ChatInterface } from '@/components/chat-interface';
import { SessionConfig } from '@/lib/axis-prompt';
import { motion, AnimatePresence } from 'motion/react';

export default function Home() {
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);

  return (
    <main className="relative min-h-screen bg-void-0 p-4 md:p-8 font-sans text-slate-200 flex flex-col items-center justify-center">
      {/* Vignette background — adds depth */}
      <div className="fixed inset-0 bg-gradient-to-b from-emerald-900/5 via-transparent to-void-0 pointer-events-none" />

      <AnimatePresence mode="wait">
        {!sessionConfig ? (
          <SessionSetupPage onStart={setSessionConfig} key="setup" />
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.9 }}
            className="w-full max-w-4xl relative z-10"
          >
            <ChatInterface config={sessionConfig} onReset={() => setSessionConfig(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
