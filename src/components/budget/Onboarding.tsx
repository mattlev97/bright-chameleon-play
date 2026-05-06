import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, Heart } from 'lucide-react';
import { PetType } from '../../types/budget';

interface OnboardingProps {
  onComplete: (amount: number, date: string, pet: PetType) => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPet, setSelectedPet] = useState<PetType>('rhino');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && date) {
      onComplete(parseFloat(amount), date, selectedPet);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFADA] dark:bg-[#0F1A15]">
      <div className="h-[30vh] bg-[#4F6F52] flex flex-col items-center justify-center text-[#FBFADA] p-6 relative overflow-hidden">
        <div className="absolute top-10 left-10 opacity-20"><Leaf size={80} /></div>
        <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm mb-3">
          <Heart size={40} className="text-[#FBFADA]" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight font-serif">EcoBudget</h1>
        <p className="text-[#FBFADA]/80 text-xs mt-1">Nutri il tuo futuro</p>
      </div>

      <div className="flex-1 bg-white dark:bg-[#1A2A22] rounded-t-[40px] -mt-10 p-8 space-y-8 shadow-2xl relative z-10">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-[#12372A]">Scegli il tuo compagno</h2>
          <p className="text-[#4F6F52] text-sm">Chi vuoi proteggere nella tua oasi?</p>
        </div>

        <div className="flex justify-center gap-6">
          <button 
            onClick={() => setSelectedPet('rhino')}
            className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${selectedPet === 'rhino' ? 'border-[#4F6F52] bg-[#FBFADA]' : 'border-transparent bg-slate-50 opacity-60'}`}
          >
            <div className="w-14 h-14 bg-[#8E9775] rounded-2xl flex items-center justify-center text-3xl">🦏</div>
            <span className="text-[10px] font-bold uppercase">Rinoceronte</span>
          </button>
          <button 
            onClick={() => setSelectedPet('elephant')}
            className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${selectedPet === 'elephant' ? 'border-[#4F6F52] bg-[#FBFADA]' : 'border-transparent bg-slate-50 opacity-60'}`}
          >
            <div className="w-14 h-14 bg-[#A5A5A5] rounded-2xl flex items-center justify-center text-3xl">🐘</div>
            <span className="text-[10px] font-bold uppercase">Elefante</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#4F6F52]">Entrate Mensili</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#12372A] font-bold">€</span>
                <Input type="number" placeholder="1500" className="pl-10 h-14 rounded-2xl border-2 border-[#E2C2B9]/30 bg-transparent focus:border-[#4F6F52] transition-all font-bold" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#4F6F52]">Data Stipendio</Label>
              <Input type="date" className="h-14 rounded-2xl border-2 border-[#E2C2B9]/30 bg-transparent focus:border-[#4F6F52] transition-all" value={date} onChange={(e) => setDate(e.target.value)} required />
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