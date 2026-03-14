'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { SessionConfig, buildAxisPrompt } from '@/lib/axis-prompt';
import { downloadSessionBrief, printSessionBrief, exportSessionToJSON, type Language } from '@/lib/session-export';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Download, Printer, FileJson } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatInterfaceProps {
  config: SessionConfig;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface OpenRouterMessage {
  role: 'user' | 'assistant';
  content: string;
}

const i18n = {
  en: {
    endSession: 'End Session',
    sessionBrief: 'Clinical Session Brief',
    startNewSession: 'Start New Session',
    export: 'Export',
    exportMarkdown: 'Export as Markdown',
    exportJSON: 'Export Full Session',
    print: 'Print',
    language: 'Language',
    speakPlainly: 'Speak plainly...',
  },
  es: {
    endSession: 'Finalizar Sesión',
    sessionBrief: 'Resumen de Sesión Clínica',
    startNewSession: 'Iniciar Nueva Sesión',
    export: 'Exportar',
    exportMarkdown: 'Exportar como Markdown',
    exportJSON: 'Exportar Sesión Completa',
    print: 'Imprimir',
    language: 'Idioma',
    speakPlainly: 'Habla claramente...',
  },
};

export function ChatInterface({ config }: ChatInterfaceProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

  const texts = i18n[language];

  useEffect(() => {
    if (!apiKey) {
      console.error('NEXT_PUBLIC_OPENROUTER_API_KEY is missing');
      return;
    }

    const startSession = async () => {
      setIsLoading(true);
      try {
        const systemInstruction = buildAxisPrompt(config);
        const response = await callOpenRouter([
          { role: 'user', content: 'Hello, I am ready to begin the session based on the provided intention.' }
        ], systemInstruction);

        if (response) {
          setMessages([{ id: Date.now().toString(), role: 'model', text: response }]);
        }
      } catch (error) {
        console.error("Failed to start session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    startSession();
  }, [config, apiKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close export menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const callOpenRouter = async (conversationMessages: OpenRouterMessage[], systemInstruction: string): Promise<string> => {
    if (!apiKey) throw new Error('API key not configured');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
      },
      body: JSON.stringify({
        model: 'x-ai/grok-4.1-fast',
        messages: [
          { role: 'system', content: systemInstruction },
          ...conversationMessages
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenRouter API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !apiKey) return;

    const userMessage = input.trim();
    setInput('');
    const userMsgId = Date.now().toString();
    setMessages((prev) => [...prev, { id: userMsgId, role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const systemInstruction = buildAxisPrompt(config);

      const conversationMessages: OpenRouterMessage[] = messages.map((msg) => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.text,
      }));
      conversationMessages.push({ role: 'user', content: userMessage });

      const responseText = await callOpenRouter(conversationMessages, systemInstruction);

      if (responseText) {
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: responseText }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'model', text: 'An error occurred while processing your request. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const [isDebriefing, setIsDebriefing] = useState(false);
  const [debriefContent, setDebriefContent] = useState<string | null>(null);

  const handleEndSession = async () => {
    if (!apiKey || isLoading || !user) return;
    setIsLoading(true);
    setIsDebriefing(true);

    try {
      const systemInstruction = buildAxisPrompt(config);

      const conversationMessages: OpenRouterMessage[] = messages.map((msg) => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.text,
      }));
      conversationMessages.push({ role: 'user', content: 'End Session' });

      const responseText = await callOpenRouter(conversationMessages, systemInstruction);

      if (responseText) {
        setDebriefContent(responseText);
      }
    } catch (error) {
      console.error('Error ending session:', error);
      setDebriefContent("Failed to generate session brief. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isDebriefing && debriefContent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.9 }}
        className="flex flex-col h-[calc(100vh-4rem)] w-full bg-void-4 rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative p-8 md:p-12"
      >
        <div className="max-w-3xl mx-auto w-full h-full flex flex-col">
          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
            <h2 className="text-3xl font-serif text-slate-100 tracking-wide">{texts.sessionBrief}</h2>
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-4 py-2 bg-void-3 text-slate-200 text-sm font-medium tracking-wide rounded-lg border border-white/10 hover:border-emerald-500/30 transition-colors"
              >
                {texts.export}
              </button>
              <AnimatePresence>
                {showExportMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-void-2 border border-white/10 rounded-lg shadow-lg z-50"
                  >
                    <button
                      onClick={() => {
                        printSessionBrief(debriefContent, config, language);
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-slate-300 hover:bg-void-3 hover:text-slate-100 flex items-center gap-3 transition-colors border-b border-white/5"
                    >
                      <Printer className="w-4 h-4" />
                      {texts.print}
                    </button>
                    <button
                      onClick={() => {
                        downloadSessionBrief(debriefContent, config, language);
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-slate-300 hover:bg-void-3 hover:text-slate-100 flex items-center gap-3 transition-colors border-b border-white/5"
                    >
                      <Download className="w-4 h-4" />
                      {texts.exportMarkdown}
                    </button>
                    <button
                      onClick={() => {
                        exportSessionToJSON(debriefContent, config, messages, language);
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-slate-300 hover:bg-void-3 hover:text-slate-100 flex items-center gap-3 transition-colors"
                    >
                      <FileJson className="w-4 h-4" />
                      {texts.exportJSON}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 mb-8">
            <div className="prose prose-invert prose-slate max-w-none prose-p:leading-relaxed prose-headings:font-serif prose-headings:text-slate-100 prose-p:text-slate-300 text-[16px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{debriefContent}</ReactMarkdown>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">{texts.language}:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="px-3 py-1 bg-void-2 border border-white/10 rounded-md text-sm text-slate-300 hover:border-white/20 transition-colors"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-void-2 text-slate-200 font-sans font-medium tracking-wide rounded-lg border border-white/5 hover:border-emerald-500/30 transition-colors"
            >
              {texts.startNewSession}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full bg-void-0 rounded-2xl border border-white/5 shadow-2xl overflow-hidden relative">
      {/* Header */}
      <div className="px-8 py-6 border-b border-white/5 bg-void-1/80 backdrop-blur-md z-10 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-slate-100 tracking-wide">AXIS</h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
            {config.challengeLevel} mode • {config.urgency}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="px-3 py-1 bg-void-2 border border-white/10 rounded-md text-sm text-slate-300 hover:border-white/20 transition-colors"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
          </div>
          <button
            onClick={handleEndSession}
            disabled={isLoading}
            className="px-6 py-2 text-sm font-medium uppercase tracking-wider text-slate-200 bg-emerald-900/30 border border-emerald-500/50 rounded-md hover:bg-emerald-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {texts.endSession}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-10 z-10 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 26,
                mass: 0.9,
                delay: idx === messages.length - 1 ? 0.05 : 0
              }}
              className={`flex w-full ${msg.role === 'user' ? 'justify-end pl-12' : 'justify-start pr-12'}`}
            >
              {msg.role === 'user' ? (
                <div className="bg-void-3 text-slate-300 px-6 py-4 rounded-2xl rounded-tr-sm border border-white/5 text-[15px] leading-relaxed shadow-sm">
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              ) : (
                <div className="w-full">
                  <div className="prose prose-invert prose-slate max-w-none prose-p:leading-relaxed prose-headings:font-serif prose-headings:text-slate-100 prose-p:text-slate-300 text-[16px]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="flex justify-start"
            >
              <div className="flex items-center space-x-2 py-4">
                <motion.div
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.98, 1.02, 0.98] }}
                  transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1.5 h-1.5 rounded-full bg-slate-500"
                />
                <motion.div
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.98, 1.02, 0.98] }}
                  transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  className="w-1.5 h-1.5 rounded-full bg-slate-500"
                />
                <motion.div
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.98, 1.02, 0.98] }}
                  transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                  className="w-1.5 h-1.5 rounded-full bg-slate-500"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input */}
      <div className="p-6 bg-void-1/90 backdrop-blur-md border-t border-white/5 z-10">
        <div className="relative flex items-end max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={texts.speakPlainly}
            disabled={isLoading}
            className="w-full max-h-40 min-h-[60px] pl-6 pr-14 py-4 bg-void-2 border border-white/10 rounded-xl focus:bg-void-3 focus:border-white/20 focus:ring-1 focus:ring-white/10 resize-none outline-none transition-all text-slate-200 placeholder:text-slate-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] disabled:opacity-50"
            rows={1}
          />
          <motion.button
            whileHover={{ scale: 1.05, color: '#f8fafc' }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1.0] }}
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 bottom-3 p-2 text-slate-500 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
