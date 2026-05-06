import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, PiggyBank, BarChart3, Check } from 'lucide-react';
import MascotBlob from './MascotBlob';
import { MascotId } from '../../types/budget';

interface OnboardingProps {
  onComplete: (amount: number, date: string, mascotId: MascotId) => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMascot, setSelectedMascot] = useState<MascotId>('classic');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      if (amount && date) {
        onComplete(parseFloat(amount), date, selectedMascot);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FB] dark:bg-[#0F0E1A]">
      <div className="h-[35vh] bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="bg-white/20 p-5 rounded-[2.5rem] backdrop-blur-md mb-4 animate-in zoom-in duration-700 shadow-2xl">
          <Wallet size={48} strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">DailyBudget</h1>
        <p className="text-white/80 font-medium mt-1">Finanza personale premium</p>
      </div>

      <div className="flex-1 bg-white dark:bg-[#1A1830] rounded-t-[32px] -mt-10 p-8 space-y-8 shadow-[0_-8px_32px_rgba(0,0,0,0.05)] relative z-10">
        {step === 1 ? (
          <>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">Iniziamo!</h2>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm leading-relaxed">
                Inserisci le tue informazioni base per calcolare il tuo budget giornaliero.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Importo Stipendio</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E1B3A] dark:text-[#F1F0FF] font-bold">€</span>
                    <Input 
                      type="number" 
                      placeholder="1600" 
                      className="pl-10 h-13 rounded-xl border-[1.5px] border-slate-200 dark:border-slate-800 bg-transparent font-bold"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Data di ricezione</Label>
                  <Input 
                    type="date" 
                    className="h-13 rounded-xl border-[1.5px] border-slate-200 dark:border-slate-800 bg-transparent"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-[52px] bg-[#6C63FF] text-white rounded-xl font-bold shadow-lg shadow-[#6C63FF]/20">
                Continua
              </Button>
            </form>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">Scegli il tuo Bibi</h2>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm leading-relaxed">
                Questa mascotte rifletterà la tua salute finanziaria. Scegli quella che preferisci.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4">
              {(['classic', 'tall', 'wide'] as MascotId[]).map((id) => (
                <button
                  key={id}
                  onClick={() => setSelectedMascot(id)}
                  className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                    selectedMascot === id 
                      ? 'border-[#6C63FF] bg-[#F5F3FF] dark:bg-[#6C63FF]/10' 
                      : 'border-transparent bg-slate-50 dark:bg-slate-900/50'
                  }`}
                >
                  {selectedMascot === id && (
                    <div className="absolute top-2 right-2 bg-[#6C63FF] text-white rounded-full p-0.5">
                      <Check size={10} />
                    </div>
                  )}
                  <MascotBlob type={id} state="neutral" size={60} />
                  <span className="text-[10px] font-bold mt-2 uppercase tracking-tighter text-slate-500">
                    {id === 'classic' ? 'Original' : id === 'tall' ? 'Slim' : 'Chubby'}
                  </span>
                </button>
              ))}
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full h-[52px] bg-gradient-to-r from-[#6C63FF] to-[#A78BFA] text-white rounded-xl font-bold shadow-lg shadow-[#6C63FF]/20"
            >
              Inizia l'avventura
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Onboarding;