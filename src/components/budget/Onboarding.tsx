"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Anchor, Ship, Compass } from 'lucide-react';

interface OnboardingProps {
  onComplete: (amount: number, date: string, mascotId: any, savingsGoal: number) => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [amount, setAmount] = useState('');
  const [savingsGoal, setSavingsGoal] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && date) {
      onComplete(
        parseFloat(amount), 
        date, 
        'classic', // Default mascot ID (non più selezionabile)
        savingsGoal ? parseFloat(savingsGoal) : 0
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4EBD0] dark:bg-[#0A1416]">
      <div className="h-[35vh] bg-[#3E7B85] flex flex-col items-center justify-center text-[#F4EBD0] p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 rotate-12"><Anchor size={120} /></div>
          <div className="absolute bottom-10 right-10 -rotate-12"><Ship size={120} /></div>
        </div>
        <div className="relative z-10 text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter uppercase">DailyBudget</h1>
          <p className="text-[#F4EBD0]/70 font-bold text-xs tracking-[0.2em] uppercase">Log di Bordo Finanziario</p>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-[#122326] rounded-t-[40px] -mt-12 p-8 space-y-8 shadow-2xl relative z-20 border-t-4 border-[#E67E22]">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#1A2A2D] dark:text-[#F4EBD0]">Configura la Rotta</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Inserisci le tue risorse mensili per iniziare la navigazione.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#3E7B85]">Carico Mensile (Stipendio)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A2A2D] dark:text-[#F4EBD0] font-bold">€</span>
                <Input 
                  type="number" 
                  placeholder="1600" 
                  className="pl-10 h-14 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-transparent font-bold text-lg focus:border-[#3E7B85]"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#E67E22]">Riserva di Sicurezza (Risparmio)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E67E22] font-bold">€</span>
                <Input 
                  type="number" 
                  placeholder="200" 
                  className="pl-10 h-14 rounded-xl border-2 border-[#E67E22]/20 bg-[#E67E22]/5 dark:bg-[#E67E22]/10 font-bold text-lg text-[#E67E22] focus:border-[#E67E22]"
                  value={savingsGoal}
                  onChange={(e) => setSavingsGoal(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#3E7B85]">Data di Rifornimento</Label>
              <Input 
                type="date" 
                className="h-14 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-transparent font-medium"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-14 bg-[#3E7B85] hover:bg-[#2D5A63] text-white rounded-xl font-bold text-lg shadow-xl shadow-[#3E7B85]/20 flex gap-3">
            <Compass size={20} />
            Prendi il Timone
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;