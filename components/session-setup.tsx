'use client';

import { useState } from 'react';
import { SessionConfig, ChallengeLevel, ActivityType, HelpType, Urgency } from '@/lib/axis-prompt';
import { motion } from 'motion/react';

interface SessionSetupProps {
  onStart: (config: SessionConfig) => void;
}

export function SessionSetup({ onStart }: SessionSetupProps) {
  const [config, setConfig] = useState<SessionConfig>({
    challengeLevel: 'default',
    intention: '',
    activityType: 'Explore',
    helpType: 'Process',
    urgency: 'Reflective',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(config);
  };

  const inputClasses = "w-full p-3 bg-void-1 border border-white/5 rounded-lg focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30 outline-none text-slate-200 placeholder:text-slate-600 transition-all duration-200";
  const labelClasses = "block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2";

  return (
    <div className="p-8 bg-void-2/75 backdrop-blur-md rounded-2xl border border-white/10 relative overflow-hidden">
      {/* Subtle vignette/glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-emerald-900/10 blur-[60px] pointer-events-none" />
      
      <div className="relative z-10">
        <h1 className="text-4xl font-serif text-slate-100 mb-2 tracking-tight">AXIS Protocol</h1>
        <p className="text-slate-400 text-sm mb-8">Configure the parameters for your session.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className={labelClasses}>Challenge Level</label>
            <select name="challengeLevel" value={config.challengeLevel} onChange={handleChange} className={inputClasses}>
              <option value="default">Default — Sharp, deeply perceptive</option>
              <option value="gentle">Gentle — Warm but precise, patient</option>
              <option value="balanced">Balanced — Directness with care</option>
              <option value="intense">Intense — Relentless, breakthrough-focused</option>
              <option value="socratic">Socratic — Questions that illuminate</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className={labelClasses}>Session Intention</label>
            <input
              type="text"
              name="intention"
              value={config.intention}
              onChange={handleChange}
              placeholder="What is the core focus today?"
              className={inputClasses}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClasses}>Activity Type</label>
              <select name="activityType" value={config.activityType} onChange={handleChange} className={inputClasses}>
                <option value="Explore">Explore</option>
                <option value="Debrief">Debrief</option>
                <option value="Plan">Plan</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClasses}>Help Type</label>
              <select name="helpType" value={config.helpType} onChange={handleChange} className={inputClasses}>
                <option value="Process">Process</option>
                <option value="Decide">Decide</option>
                <option value="Understand">Understand</option>
                <option value="Validate">Validate</option>
                <option value="Vent">Vent</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelClasses}>Urgency</label>
            <select name="urgency" value={config.urgency} onChange={handleChange} className={inputClasses}>
              <option value="Reflective">Reflective</option>
              <option value="Crisis">Crisis</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.01, backgroundColor: 'var(--color-void-3)' }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1.0] }}
            type="submit"
            className="w-full py-4 mt-4 bg-void-4 text-slate-200 font-serif text-lg tracking-wide rounded-lg border border-white/5 hover:border-emerald-500/30 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
          >
            Begin Session
          </motion.button>
        </form>
      </div>
    </div>
  );
}
