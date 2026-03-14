'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { SessionConfig, buildAxisPrompt, buildKnowledgeAddendum } from '@/lib/axis-prompt';
import { semanticSearch } from '@/lib/knowledge-base';
import { downloadSessionBrief, printSessionBrief, exportSessionToJSON, type Language } from '@/lib/session-export';
import { saveBriefToPostgres, fetchUserBriefs, formatBriefDate, type StoredBrief } from '@/lib/briefs-client';
import { searchPastBriefs, buildPastSessionContext } from '@/lib/past-session-rag';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Download, Printer, FileJson, History } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'motion/react';

interface ChatInterfaceProps {
  config: SessionConfig;
  onReset?: () => void;
  initialMessages?: { id: string; role: 'user' | 'model'; text: string }[] | null;
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

export function ChatInterface({ config, onReset, initialMessages }: ChatInterfaceProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>(initialMessages ?? []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

  const texts = i18n[language];

  // Map model choice to OpenRouter model ID
  const getModelId = (model?: string): string => {
    switch (model) {
      case 'kimi':
        return 'moonshotai/kimi-k2.5';
      case 'stepfun':
        return 'stepfun/step-3.5-flash:free';
      case 'grok':
      default:
        return 'x-ai/grok-4.1-fast';
    }
  };

  const currentModel = getModelId(config.model);

  useEffect(() => {
    if (!apiKey) {
      console.error('NEXT_PUBLIC_OPENROUTER_API_KEY is missing');
      return;
    }

    // Skip auto-greeting if restoring from imported session
    if (initialMessages && initialMessages.length > 0) {
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

  const shouldUseKnowledge = async (
    conversationMessages: OpenRouterMessage[]
  ): Promise<{ needed: boolean; query?: string }> => {
    if (!apiKey) return { needed: false };

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
        },
        body: JSON.stringify({
          model: currentModel,
          messages: [
            {
              role: 'system',
              content: `You are a clinical knowledge router. Given this conversation excerpt, decide:
1. Does this moment call for specific clinical technique knowledge? (defense analysis, ego states, ACT techniques, script work, etc.)
2. If yes, provide a 3-10 word search query describing what technique is relevant.

Reply ONLY as JSON: {"needed": true/false, "query": "search query or null"}`
            },
            ...conversationMessages.slice(-2) // Last 2 messages only
          ],
          temperature: 0.3,
          max_tokens: 80,
        }),
      });

      if (!response.ok) {
        return { needed: false };
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';

      try {
        const parsed = JSON.parse(content);
        return { needed: parsed.needed ?? false, query: parsed.query };
      } catch {
        return { needed: false };
      }
    } catch (error) {
      console.error('Router call failed, skipping knowledge injection:', error);
      return { needed: false };
    }
  };

  const callOpenRouter = async (conversationMessages: OpenRouterMessage[], systemInstruction: string, knowledgeAddendum?: string): Promise<string> => {
    if (!apiKey) throw new Error('API key not configured');

    // Inject knowledge addendum into system instruction if provided
    const finalSystemInstruction = knowledgeAddendum
      ? `${systemInstruction}\n\n${knowledgeAddendum}`
      : systemInstruction;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
      },
      body: JSON.stringify({
        model: currentModel,
        messages: [
          { role: 'system', content: finalSystemInstruction },
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
      let systemInstruction = buildAxisPrompt(config);

      const conversationMessages: OpenRouterMessage[] = messages.map((msg) => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.text,
      }));
      conversationMessages.push({ role: 'user', content: userMessage });

      // FAST: Search past briefs for relevant patterns (if available)
      let pastSessionContext: string | undefined;
      if (pastBriefs.length > 0) {
        const matches = searchPastBriefs(userMessage, config.intention, pastBriefs);
        if (matches.length > 0) {
          pastSessionContext = buildPastSessionContext(matches);
          systemInstruction = `${systemInstruction}\n\n${pastSessionContext}`;
        }
      }

      // ROUTER CALL: Decide if external knowledge is needed
      const routerDecision = await shouldUseKnowledge(conversationMessages);
      let knowledgeAddendum: string | undefined;

      if (routerDecision.needed && routerDecision.query) {
        // Semantic search for relevant knowledge
        const searchResults = semanticSearch(routerDecision.query, 2);
        if (searchResults.length > 0) {
          knowledgeAddendum = buildKnowledgeAddendum(
            searchResults.map(r => r.entry)
          );
        }
      }

      // Call AXIS with optional knowledge addendum + past session context
      const responseText = await callOpenRouter(conversationMessages, systemInstruction, knowledgeAddendum);

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
  const [pastBriefs, setPastBriefs] = useState<StoredBrief[]>([]);
  const [showBriefHistory, setShowBriefHistory] = useState(false);

  // Fetch past briefs on mount and when debrief starts
  useEffect(() => {
    if (user && (isDebriefing || messages.length === 0)) {
      fetchUserBriefs().then(setPastBriefs).catch(() => {});
    }
  }, [isDebriefing, user, messages.length]);

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

        // Save brief to Postgres
        try {
          const sessionId = Date.now().toString();
          await saveBriefToPostgres(responseText, config, messages, sessionId);
          // Fetch updated brief history
          const briefs = await fetchUserBriefs();
          setPastBriefs(briefs);
        } catch (dbError) {
          console.error('Failed to save brief to Postgres:', dbError);
        }
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
            <div className="flex items-center gap-2">
              {/* Brief History Button */}
              {pastBriefs.length > 0 && (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowBriefHistory(!showBriefHistory)}
                    className="px-4 py-2 bg-void-3 text-slate-200 text-sm font-medium tracking-wide rounded-lg border border-white/10 hover:border-violet-500/30 transition-colors flex items-center gap-2"
                  >
                    <History className="w-4 h-4" />
                    History ({pastBriefs.length})
                  </motion.button>
                  <AnimatePresence>
                    {showBriefHistory && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-64 bg-void-2 border border-white/10 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto"
                      >
                        {pastBriefs.map((brief) => (
                          <button
                            key={brief.id}
                            onClick={() => {
                              setDebriefContent(brief.brief);
                              setShowBriefHistory(false);
                            }}
                            className="w-full text-left px-4 py-3 text-slate-300 hover:bg-void-3 hover:text-slate-100 transition-colors border-b border-white/5 last:border-b-0"
                          >
                            <p className="text-xs font-medium text-violet-400/80 mb-1">
                              {brief.config.challengeLevel}
                            </p>
                            <p className="text-xs text-slate-400">
                              {formatBriefDate(brief.createdAt)}
                            </p>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Export Menu Button */}
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
              onClick={onReset || (() => window.location.reload())}
              className="px-6 py-3 bg-void-2 text-slate-200 font-sans font-medium tracking-wide rounded-lg border border-white/5 hover:border-emerald-500/30 transition-colors"
            >
              {texts.startNewSession}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const isCrisis = config.urgency === 'Crisis';

  return (
    <div className={`flex flex-col h-[calc(100vh-4rem)] w-full rounded-2xl border shadow-2xl overflow-hidden relative transition-all duration-300 ${
      isCrisis
        ? 'bg-void-1 border-amber-500/30'
        : 'bg-void-1 border-white/5'
    }`}>
      {/* Crisis Banner */}
      {isCrisis && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-8 py-3 bg-amber-900/20 border-b border-amber-500/40 text-amber-200 text-sm font-medium"
        >
          Crisis mode active — Emergency resources available
        </motion.div>
      )}

      {/* Header */}
      <div className={`px-8 py-6 border-b z-10 flex items-center justify-between transition-all duration-300 shadow-[0_1px_0_oklch(100%_0_0/0.04)] ${
        isCrisis
          ? 'border-amber-500/30 bg-void-2'
          : 'border-emerald-900/30 bg-void-2'
      }`}>
        <div>
          <h2 className="text-2xl font-serif text-slate-100 tracking-wide">AXIS</h2>
          <p className={`text-xs uppercase tracking-widest mt-1 ${
            isCrisis ? 'text-amber-300/60' : 'text-slate-500'
          }`}>
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
            className={`px-6 py-2 text-sm font-medium uppercase tracking-wider rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              isCrisis
                ? 'text-amber-200 bg-amber-900/30 border border-amber-500/50 hover:bg-amber-900/50'
                : 'text-slate-200 bg-emerald-900/30 border border-emerald-500/50 hover:bg-emerald-900/50'
            }`}
          >
            {texts.endSession}
          </button>
          <UserButton />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 z-10 custom-scrollbar bg-void-0">
        {initialMessages && initialMessages.length > 0 && (
          <div className="text-xs text-slate-600 text-center py-2 select-none">
            — resumed from previous session —
          </div>
        )}
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
                <div className="bg-void-4 text-slate-300 px-6 py-4 rounded-2xl rounded-tr-sm border border-white/[0.07] text-[15px] leading-relaxed shadow-[0_2px_8px_oklch(0%_0_0/0.4)] max-w-[80%]">
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              ) : (
                <div className="max-w-[92%]">
                  <div className="bg-void-2 border border-white/5 rounded-2xl rounded-tl-sm px-5 py-4 shadow-[0_2px_12px_oklch(0%_0_0/0.3)]">
                    <div className="prose prose-invert prose-slate max-w-none prose-p:leading-relaxed prose-headings:font-serif prose-headings:text-slate-100 prose-p:text-slate-300 text-[16px]">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                    </div>
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
      <div className="p-6 bg-void-2 border-t border-white/5 z-10 shadow-[0_-1px_0_oklch(100%_0_0/0.04)]">
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
