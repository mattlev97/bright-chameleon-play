import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';
import { BlobType } from '../../types/budget';
import Blob from './Blob';

interface OnboardingProps {
  onComplete: (amount: number, date: string, blob: BlobType) => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBlob, setSelectedBlob] = useState<BlobType>('sparky');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && date) {
      onComplete(parseFloat(amount), date, selectedBlob);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0F0F1A]">
      <div className="h-[35vh] bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white blur-3xl" />
        </div>
        <Sparkles size={48} className="mb-4 animate-pulse" />
        <h1 className="text-4xl font-bold tracking-tight">DailyBudget</h1>
        <p className="text-white/80 text-sm mt-2">Gestisci le tue finanze con stile</p>
      </div>

      <div className="flex-1 bg-white dark:bg-[#1A1A2E] rounded-t-[40px] -mt-10 p-8 space-y-8 shadow-2xl relative z-10">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Scegli il tuo avatar</h2>
          <p className="text-slate-500 text-sm">Chi ti accompagnerà questo mese?</p>
        </div>

        <div className="flex justify-center gap-4">
          {(['sparky', 'gloomy', 'bubbly'] as BlobType[]).map((type) => (
            <button 
              key={type}
              onClick={() => setSelectedBlob(type)}
              className={`p-2 rounded-3xl border-2 transition-all flex flex-col items-center ${selectedBlob === type ? 'border-[#6C63FF] bg-[#F5F3FF]' : 'border-transparent bg-slate-50 opacity-60'}`}
            >
              <div className="w-20 h-20">
                <Blob type={type} mood="neutral" />
              </div>
              <span className="text-[10px] font-bold uppercase mt-1">{type}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Entrate Mensili</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
                <Input type="number" placeholder="1500" className="pl-10 h-14 rounded-2xl border-2 border-slate-100 focus:border-[#6C63FF] transition-all font-bold" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Data Stipendio</Label>
              <Input type="date" className="h-14 rounded-2xl border-2 border-slate-100 focus:border-[#6C63FF] transition-all" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
          </div>
          <Button type="submit" className="w-full h-14 bg-[#6C63FF] hover:bg-[#5A52E5] text-white rounded-2xl font-bold text-lg shadow-xl shadow-[#6C63FF]/20 transition-all active:scale-95">
            Inizia ora
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;