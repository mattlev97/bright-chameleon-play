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
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Section (40%) */}
      <div className="h-[40vh] bg-green-500 flex flex-col items-center justify-center text-white p-6">
        <div className="bg-white/20 p-6 rounded-[2.5rem] backdrop-blur-md mb-4 animate-in zoom-in duration-700">
          <Wallet size={64} strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl font-black tracking-tight">DailyBudget</h1>
        <p className="text-green-100 font-medium mt-1 opacity-80">Gestione intelligente</p>
      </div>

      {/* Bottom Section (60%) */}
      <div className="flex-1 bg-white rounded-t-[3rem] -mt-12 p-8 space-y-8 shadow-2xl">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Benvenuto!</h2>
          <p className="text-slate-500 leading-relaxed">
            Il tuo budget cresce ogni giorno che risparmi. Inizia a tracciare le tue finanze oggi.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-xl">
              <PiggyBank size={20} />
            </div>
            <p className="text-sm font-semibold text-slate-700">Inserisci il tuo stipendio</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <BarChart3 size={20} />
            </div>
            <p className="text-sm font-semibold text-slate-700">Vedi il tuo budget giornaliero</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
              <ReceiptText size={20} />
            </div>
            <p className="text-sm font-semibold text-slate-700">Traccia ogni spesa</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-xs font-bold uppercase tracking-wider text-slate-400">Importo Stipendio</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">€</span>
                <Input 
                  id="amount"
                  type="number" 
                  placeholder="1600" 
                  className="pl-10 h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all text-lg font-bold"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-xs font-bold uppercase tracking-wider text-slate-400">Data di ricezione</Label>
              <Input 
                id="date"
                type="date" 
                className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-medium"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-16 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-green-100 transition-all active:scale-95">
            Inizia ora
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;