import React, { useState, useRef, useEffect } from 'react';
import { useAI } from '../../hooks/use-ai';
import { useBudget } from '../../hooks/use-budget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Send, X, Loader2, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AIChat = () => {
  const { stats } = useBudget();
  const { loadModel, askBibi, loading, ready, progress } = useAI();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'bibi', text: string}[]>([
    { role: 'bibi', text: "Ciao! Sono Bibi. Posso aiutarti a capire come gestire meglio il tuo budget di oggi?" }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleOpen = () => {
    setIsOpen(true);
    loadModel();
  };

  const handleSend = async () => {
    if (!input.trim() || !ready) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    const context = `L'utente ha un budget giornaliero di €${stats.dailyBudget.toFixed(2)}. 
    Mancano ${stats.daysRemaining} giorni allo stipendio. 
    Il risparmio attuale è €${stats.currentSavings.toFixed(2)} su un obiettivo di €${stats.savingsGoal}.`;

    const response = await askBibi(userMsg, context);
    setMessages(prev => [...prev, { role: 'bibi', text: response }]);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handleOpen}
            className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] rounded-full shadow-lg shadow-[#6C63FF]/40 flex items-center justify-center text-white z-40 active:scale-90 transition-transform"
          >
            <Sparkles size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            className="fixed bottom-24 right-6 left-6 md:left-auto md:w-[360px] z-50"
          >
            <Card className="overflow-hidden border-none shadow-2xl rounded-[28px] bg-white dark:bg-[#1A1830] flex flex-col h-[450px]">
              <div className="p-4 bg-gradient-to-r from-[#6C63FF] to-[#A78BFA] text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-1.5 rounded-lg">
                    <Bot size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Bibi AI</h3>
                    <p className="text-[10px] opacity-80">100% Locale & Privata</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar" ref={scrollRef}>
                {!ready && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-6">
                    <div className="relative">
                      <Loader2 className="animate-spin text-[#6C63FF]" size={40} />
                      <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#A78BFA]" size={16} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">Sto caricando il mio cervello...</p>
                      <p className="text-[11px] text-slate-400">Scarico il modello IA locale (~80MB). Verrà salvato nella cache del tuo browser.</p>
                      <Progress value={progress} className="h-1.5" />
                      <p className="text-[10px] font-bold text-[#6C63FF]">{Math.round(progress)}%</p>
                    </div>
                  </div>
                )}

                {ready && messages.map((msg, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-[#6C63FF] text-white rounded-tr-none shadow-md shadow-[#6C63FF]/10' 
                        : 'bg-slate-100 dark:bg-slate-800 text-[#1E1B3A] dark:text-[#F1F0FF] rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                <div className="relative flex items-center gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={ready ? "Chiedi a Bibi..." : "Caricamento..."}
                    disabled={!ready}
                    className="rounded-xl border-none bg-white dark:bg-[#1A1830] shadow-inner pr-12 h-12"
                  />
                  <Button 
                    onClick={handleSend} 
                    disabled={!ready || !input.trim()}
                    size="icon"
                    className="absolute right-1 w-10 h-10 rounded-lg bg-[#6C63FF] hover:bg-[#5b54d6] text-white transition-all"
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};