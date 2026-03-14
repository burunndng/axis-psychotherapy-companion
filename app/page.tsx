'use client';

import { useState } from 'react';
import { SessionSetup } from '@/components/session-setup';
import { ChatInterface } from '@/components/chat-interface';
import { SessionConfig } from '@/lib/axis-prompt';
import { motion, AnimatePresence } from 'motion/react';

export default function Home() {
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);

  return (
    <main className="min-h-screen bg-void-0 p-4 md:p-8 font-sans text-slate-200 flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {!sessionConfig ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.9 }}
            className="w-full max-w-2xl"
          >
            <SessionSetup onStart={setSessionConfig} />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.9 }}
            className="w-full h-full max-w-4xl"
          >
            <ChatInterface config={sessionConfig} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
