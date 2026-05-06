import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, PiggyBank, BarChart3, ReceiptText } from 'lucide-react';

interface OnboardingProps {
  onComplete: (amount: number, date: string) => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && date) {
      onComplete(parseFloat(amount), date);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FB] dark:bg-[#0F0E1A]">
      {/* Top Section (40%) */}
      <div className="h-[40vh] bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="bg-white/20 p-6 rounded-[2.5rem] backdrop-blur-md mb-4 animate-in zoom-in duration-700 shadow-2xl">
          <Wallet size={56} strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">DailyBudget</h1>
        <p className="text-white/80 font-medium mt-1">Finanza personale premium</p>
      </div>

      {/* Bottom Section (60%) - Sheet Effect */}
      <div className="flex-1 bg-white dark:bg-[#1A1830] rounded-t-[28px] -mt-10 p-8 space-y-8 shadow-[0_-8px_32px_rgba(0,0,0,0.05)] relative z-10">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">Benvenuto!</h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm leading-relaxed">
            Il tuo budget cresce ogni giorno che risparmi. Inizia a tracciare le tue finanze oggi.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
            <div className="p-2 bg-[#F5F3FF] text-[#6C63FF] rounded-xl">
              <PiggyBank size={18} />
            </div>
            <p className="text-xs font-semibold text-[#1E1B3A] dark:text-[#F1F0FF]">Inserisci lo stipendio</p>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
            <div className="p-2 bg-[#F5F3FF] text-[#6C63FF] rounded-xl">
              <BarChart3 size={18} />
            </div>
            <p className="text-xs font-semibold text-[#1E1B3A] dark:text-[#F1F0FF]">Budget giornaliero dinamico</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Importo Stipendio</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E1B3A] dark:text-[#F1F0FF] font-bold">€</span>
                <Input 
                  id="amount"
                  type="number" 
                  placeholder="1600" 
                  className="pl-10 h-13 rounded-xl border-[1.5px] border-slate-200 dark:border-slate-800 bg-transparent focus:border-[#6C63FF] focus:ring-0 transition-all font-bold"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Data di ricezione</Label>
              <Input 
                id="date"
                type="date" 
                className="h-13 rounded-xl border-[1.5px] border-slate-200 dark:border-slate-800 bg-transparent focus:border-[#6C63FF] focus:ring-0 transition-all font-medium"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-[52px] bg-gradient-to-r from-[#6C63FF] to-[#A78BFA] hover:opacity-90 text-white rounded-xl font-bold text-lg shadow-lg shadow-[#6C63FF]/20 transition-all active:scale-95">
            Inizia ora
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;