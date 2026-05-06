import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellRing, X } from 'lucide-react';

interface NotificationPromptProps {
  onAccept: () => void;
  onDecline: () => void;
}

const NotificationPrompt = ({ onAccept, onDecline }: NotificationPromptProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-md bg-white dark:bg-[#1A1830] border-none shadow-2xl rounded-[32px] p-8 space-y-6 animate-in slide-in-from-bottom-10 duration-500">
        <div className="flex justify-between items-start">
          <div className="w-16 h-16 bg-[#F5F3FF] dark:bg-[#6C63FF]/10 rounded-[24px] flex items-center justify-center text-[#6C63FF]">
            <BellRing size={32} />
          </div>
          <button onClick={onDecline} className="p-2 text-slate-300 hover:text-slate-500">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">Rimani in controllo</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Vuoi ricevere un aggiornamento sul tuo budget ogni mattina alle 09:00? Ti aiuterà a gestire meglio le tue spese.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={onAccept}
            className="w-full h-14 bg-gradient-to-r from-[#6C63FF] to-[#A78BFA] text-white font-bold rounded-2xl shadow-lg shadow-[#6C63FF]/20"
          >
            Sì, attiva notifiche
          </Button>
          <Button 
            variant="ghost"
            onClick={onDecline}
            className="w-full h-12 text-slate-400 font-bold hover:bg-transparent"
          >
            Magari più tardi
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotificationPrompt;