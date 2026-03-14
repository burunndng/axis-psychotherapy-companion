'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { SessionConfig, ChallengeLevel, ActivityType, HelpType, Urgency } from '@/lib/axis-prompt';
import { RitualThreshold } from './ritual-threshold';
import { motion } from 'motion/react';

type Language = 'en' | 'es';

const i18n = {
  en: {
    title: 'AXIS Protocol',
    subtitle: 'Configure the parameters for your session.',
    language: 'Language',
    challengeLevel: 'Challenge Level',
    sessionIntention: 'Session Intention',
    intentionPlaceholder: 'What is the core focus today?',
    activityType: 'Activity Type',
    helpType: 'Help Type',
    urgency: 'Urgency',
    begin: 'Begin Session',
    welcomeBack: 'Welcome back, ',
    crisisMode: 'Crisis mode activated.',
    crisisDesc: 'If you\'re in immediate danger, please call emergency services or a crisis helpline.',
    default: 'Default — Sharp, deeply perceptive',
    gentle: 'Gentle — Warm but precise, patient',
    balanced: 'Balanced — Directness with care',
    intense: 'Intense — Relentless, breakthrough-focused',
    socratic: 'Socratic — Questions that illuminate',
    explore: 'Explore',
    debrief: 'Debrief',
    plan: 'Plan',
    process: 'Process',
    decide: 'Decide',
    understand: 'Understand',
    validate: 'Validate',
    vent: 'Vent',
    reflective: 'Reflective',
    crisis: 'Crisis',
  },
  es: {
    title: 'Protocolo AXIS',
    subtitle: 'Configura los parámetros de tu sesión.',
    language: 'Idioma',
    challengeLevel: 'Nivel de Desafío',
    sessionIntention: 'Intención de Sesión',
    intentionPlaceholder: '¿Cuál es el enfoque principal hoy?',
    activityType: 'Tipo de Actividad',
    helpType: 'Tipo de Ayuda',
    urgency: 'Urgencia',
    begin: 'Comenzar Sesión',
    welcomeBack: 'Bienvenido de vuelta, ',
    crisisMode: 'Modo de crisis activado.',
    crisisDesc: 'Si estás en peligro inmediato, por favor llama a servicios de emergencia o a una línea de crisis.',
    default: 'Predeterminado — Agudo y profundamente perspicaz',
    gentle: 'Suave — Cálido pero preciso, paciente',
    balanced: 'Equilibrado — Directividad con cuidado',
    intense: 'Intenso — Implacable, enfocado en avance',
    socratic: 'Socrático — Preguntas que iluminan',
    explore: 'Explorar',
    debrief: 'Reflexión',
    plan: 'Planificar',
    process: 'Procesar',
    decide: 'Decidir',
    understand: 'Entender',
    validate: 'Validar',
    vent: 'Desahogar',
    reflective: 'Reflexivo',
    crisis: 'Crisis',
  },
};

interface SessionSetupProps {
  onStart: (config: SessionConfig) => void;
}

export function SessionSetup({ onStart }: SessionSetupProps) {
  const { user } = useUser();
  const [language, setLanguage] = useState<Language>('en');
  const [config, setConfig] = useState<SessionConfig>({
    challengeLevel: 'default',
    intention: '',
    activityType: 'Explore',
    helpType: 'Process',
    urgency: 'Reflective',
  });

  const texts = i18n[language];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(config);
  };

  const isCrisis = config.urgency === 'Crisis';

  const fieldVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.06,
        type: 'spring',
        stiffness: 220,
        damping: 26,
        mass: 0.9,
      },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.9 }}
      className={`p-8 rounded-2xl border backdrop-blur-md relative overflow-hidden transition-all duration-300 ${
        isCrisis
          ? 'bg-void-2/75 border-amber-500/30'
          : 'bg-void-2/75 border-white/10'
      }`}
    >
      {/* Subtle vignette/glow */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 blur-[60px] pointer-events-none transition-colors duration-300 ${
          isCrisis ? 'bg-amber-900/15' : 'bg-emerald-900/10'
        }`}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            {/* Greeting with Clerk user info */}
            {user && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-slate-400 mb-4"
              >
                {texts.welcomeBack}<span className="text-emerald-400/80">{user.firstName || 'there'}</span>.
              </motion.p>
            )}

            {/* Title */}
            <motion.div
              custom={0}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
            >
              <h1 className="text-4xl font-serif text-slate-100 mb-2 tracking-tight">
                {texts.title}
              </h1>
              <p className="text-slate-400 text-sm">
                {texts.subtitle}
              </p>
            </motion.div>
          </div>

          {/* Language Selector (Top Right) */}
          <motion.div
            custom={0}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col items-end gap-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {texts.language}
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="input-void w-24"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </motion.div>
        </div>

        {/* Crisis banner */}
        {isCrisis && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            className="my-6 p-4 bg-amber-900/20 border border-amber-500/40 rounded-lg text-amber-200 text-sm"
          >
            <p className="font-medium">{texts.crisisMode}</p>
            <p className="text-xs text-amber-300/80 mt-1">
              {texts.crisisDesc}
            </p>
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6 mt-8"
          initial="hidden"
          animate="visible"
        >
          {/* Challenge Level */}
          <motion.div
            custom={1}
            variants={fieldVariants}
            className="space-y-2"
          >
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              {texts.challengeLevel}
            </label>
            <select
              name="challengeLevel"
              value={config.challengeLevel}
              onChange={handleChange}
              className="input-void"
            >
              <option value="default">{texts.default}</option>
              <option value="gentle">{texts.gentle}</option>
              <option value="balanced">{texts.balanced}</option>
              <option value="intense">{texts.intense}</option>
              <option value="socratic">{texts.socratic}</option>
            </select>
          </motion.div>

          {/* Session Intention */}
          <motion.div
            custom={2}
            variants={fieldVariants}
            className="space-y-2"
          >
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              {texts.sessionIntention} <span className="text-amber-400/60">*</span>
            </label>
            <input
              type="text"
              name="intention"
              value={config.intention}
              onChange={handleChange}
              placeholder={texts.intentionPlaceholder}
              className="input-void"
              required
            />
          </motion.div>

          {/* Activity Type & Help Type */}
          <div className="grid grid-cols-2 gap-6">
            <motion.div
              custom={3}
              variants={fieldVariants}
              className="space-y-2"
            >
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
                {texts.activityType}
              </label>
              <select
                name="activityType"
                value={config.activityType}
                onChange={handleChange}
                className="input-void"
              >
                <option value="Explore">{texts.explore}</option>
                <option value="Debrief">{texts.debrief}</option>
                <option value="Plan">{texts.plan}</option>
              </select>
            </motion.div>

            <motion.div
              custom={4}
              variants={fieldVariants}
              className="space-y-2"
            >
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
                {texts.helpType}
              </label>
              <select
                name="helpType"
                value={config.helpType}
                onChange={handleChange}
                className="input-void"
              >
                <option value="Process">{texts.process}</option>
                <option value="Decide">{texts.decide}</option>
                <option value="Understand">{texts.understand}</option>
                <option value="Validate">{texts.validate}</option>
                <option value="Vent">{texts.vent}</option>
              </select>
            </motion.div>
          </div>

          {/* Urgency */}
          <motion.div
            custom={5}
            variants={fieldVariants}
            className="space-y-2"
          >
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              {texts.urgency}
            </label>
            <select
              name="urgency"
              value={config.urgency}
              onChange={handleChange}
              className={`input-void ${
                isCrisis ? 'border-amber-500/50 focus:border-amber-500/70' : ''
              }`}
            >
              <option value="Reflective">{texts.reflective}</option>
              <option value="Crisis">{texts.crisis}</option>
            </select>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            custom={6}
            variants={fieldVariants}
            className="pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1.0] }}
              type="submit"
              disabled={!config.intention.trim()}
              className={`w-full py-4 font-serif text-lg tracking-wide rounded-lg border transition-all duration-200 shadow-void-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                isCrisis
                  ? 'bg-amber-900/30 border-amber-500/40 text-amber-200 hover:bg-amber-900/50 hover:border-amber-500/60'
                  : 'bg-void-4 border-white/5 text-slate-200 hover:border-emerald-500/30'
              }`}
            >
              {texts.begin}
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
}

/**
 * SessionSetupPage — Full page wrapper with ritual threshold
 * Includes the sacred geometry ritual threshold as visual entry point
 */
export function SessionSetupPage({ onStart }: SessionSetupProps) {
  return (
    <motion.div
      className="w-full max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.9 }}
    >
      {/* Ritual Threshold — Metatron's Cube sacred geometry */}
      <RitualThreshold />

      {/* Setup Form */}
      <SessionSetup onStart={onStart} />
    </motion.div>
  );
}
