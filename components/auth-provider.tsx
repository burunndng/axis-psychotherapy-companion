'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { motion } from 'motion/react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  logOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-void-0 flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-3 h-3 rounded-full bg-emerald-500/50"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-void-0 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-void-2/80 backdrop-blur-md rounded-2xl border border-slate-800/50 shadow-2xl text-center">
          <h1 className="text-4xl font-serif text-slate-100 mb-4 tracking-tight">AXIS</h1>
          <p className="text-slate-400 mb-8">A sharp, perceptive thinking partner.</p>
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: 'var(--color-void-3)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1.0] }}
            onClick={signIn}
            className="w-full py-4 bg-void-4 text-slate-200 font-sans font-medium tracking-wide rounded-lg border border-slate-700/50 hover:border-emerald-500/30 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
          >
            Sign in with Google
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
