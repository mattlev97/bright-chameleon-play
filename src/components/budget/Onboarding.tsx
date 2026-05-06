import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, Heart, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-[#FBFADA] dark:bg-[#0F1A15]">
      <div className="h-[35vh] bg-[#4F6F52] flex flex-col items-center justify-center text-[#FBFADA] p-6 relative overflow-hidden">
        <div className="absolute top-10 left-10 opacity-20"><Leaf size={80} /></div>
        <div className="absolute bottom-5 right-10 opacity-20 rotate-45"><Leaf size={60} /></div>
        
        <div className="bg-white/10 p-5 rounded-full backdrop-blur-sm mb-4">
          <Heart size={48} className="text-[#FBFADA]" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight font-serif">EcoBudget</h1>
        <p className="text-[#FBFADA]/80 text-sm mt-1">Prenditi cura del tuo futuro e del tuo amico</p>
      </div>

      <div className="flex-1 bg-white dark:bg-[#1A2A22] rounded-t-[40px] -mt-12 p-8 space-y-8 shadow-2xl relative z-10">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-[#12372A] dark:text-[#FBFADA]">Inizia la tua oasi</h2>
          <p className="text-[#4F6F52] text-sm">Il tuo risparmio nutre il tuo compagno digitale.</p>
        </div>

        <div className="flex justify-center gap-4">
          <div className="p-4 rounded-3xl border-2 border-[#4F6F52] bg-[#FBFADA] flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-[#8E9775] rounded-2xl flex items-center justify-center text-2xl">🦏</div>
            <span className="text-[10px] font-bold uppercase">Rinoceronte</span>
          </div>
          <div className="p-4 rounded-3xl border-2 border-transparent bg-slate-50 opacity-50 flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-slate-200 rounded-2xl flex items-center justify-center text-2xl">🐘</div>
            <span className="text-[10px] font-bold uppercase">Presto...</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#4F6F52]">Entrate Mensili</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#12372A] font-bold">€</span>
                <Input 
                  type="number" 
                  placeholder="1500" 
                  className="pl-10 h-14 rounded-2xl border-2 border-[#E2C2B9]/30 bg-transparent focus:border-[#4F6F52] transition-all font-bold"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#4F6F52]">Data Stipendio</Label>
              <Input 
                type="date" 
                className="h-14 rounded-2xl border-2 border-[#E2C2B9]/30 bg-transparent focus:border-[#4F6F52] transition-all"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-14 bg-[#4F6F52] hover:bg-[#12372A] text-white rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95">
            Crea la tua oasi
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;