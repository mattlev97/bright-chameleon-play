import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import { useBudget } from '../hooks/use-budget';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Anchor, Compass, Gift, HardDrive, Key, Lock, Map, Shield, Skull } from 'lucide-react';
import BoatScene from '../components/budget/BoatScene';

interface RelicItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  requirement: number;
  current: number;
  unit: string;
}

const Trophies = () => {
  const { data, stats } = useBudget();

  const totalSaved = stats?.currentSavings || 0;
  const expensesCount = data.expenses.length;
  const daysActive = data.dailyHistory.length || 1;

  const relics: RelicItem[] = [
    {
      id: 'compass',
      title: 'Bussola d\'Ottone',
      description: 'Mantieni la rotta per 7 giorni senza sforare il budget.',
      icon: <Compass size={28} />,
      color: '#B45309',
      requirement: 7,
      current: Math.min(7, daysActive),
      unit: 'gg'
    },
    {
      id: 'chest',
      title: 'Forziere del Capitano',
      description: 'Accumula una riserva di risparmio superiore a 500€.',
      icon: <Gift size={28} />,
      color: '#1E40AF',
      requirement: 500,
      current: totalSaved,
      unit: '€'
    },
    {
      id: 'key',
      title: 'Chiave Arrugginita',
      description: 'Registra 20 carichi nel tuo log di bordo.',
      icon: <Key size={28} />,
      color: '#4B5563',
      requirement: 20,
      current: expensesCount,
      unit: 'log'
    },
    {
      id: 'idol',
      title: 'Idolo Abissale',
      description: 'Evita spese d\'impulso per un\'intera settimana.',
      icon: <Skull size={28} />,
      color: '#065F46',
      requirement: 7,
      current: Math.max(0, 7 - data.expenses.filter(e => e.weight === 'impulsive').length),
      unit: 'gg'
    },
    {
      id: 'anchor',
      title: 'Ancora d\'Oro',
      description: 'Raggiungi il porto (fine mese) con il budget in attivo.',
      icon: <Anchor size={28} />,
      color: '#D97706',
      requirement: 1,
      current: stats.isOnTrack ? 1 : 0,
      unit: 'porto'
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-8 pt-4">
        <div className="text-center space-y-4">
          <div className="flex justify-center px-4">
            <div className="relative w-full max-w-[300px]">
              <BoatScene 
                state={stats.mascotState} 
                dailyBudget={stats.dailyBudget}
                size={180} 
              />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-[#F4EBD0] tracking-tighter uppercase italic">Reliquie Recuperate</h1>
            <p className="text-xs text-slate-500 uppercase tracking-[0.2em]">Oggetti emersi dalle profondità del tuo risparmio</p>
          </div>
        </div>

        <div className="grid gap-4">
          {relics.map((relic) => {
            const isAchieved = relic.current >= relic.requirement;
            const progress = Math.min(100, (relic.current / relic.requirement) * 100);

            return (
              <Card 
                key={relic.id} 
                className={`p-6 border-none shadow-2xl rounded-[24px] relative overflow-hidden transition-all duration-700 ${
                  isAchieved 
                    ? 'bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border-t border-white/10' 
                    : 'bg-black/40 opacity-60 grayscale'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div 
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-1000 ${
                      isAchieved ? 'scale-110 rotate-3' : 'scale-90'
                    }`}
                    style={{ 
                      backgroundColor: isAchieved ? `${relic.color}20` : '#111',
                      color: isAchieved ? relic.color : '#333',
                      boxShadow: isAchieved ? `0 0 20px ${relic.color}30` : 'none'
                    }}
                  >
                    {isAchieved ? relic.icon : <Lock size={24} />}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-end">
                      <h3 className={`font-bold text-base tracking-tight ${isAchieved ? 'text-[#F4EBD0]' : 'text-slate-600'}`}>
                        {relic.title}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        {Math.round(relic.current)}/{relic.requirement}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed italic">{relic.description}</p>
                    <div className="pt-3">
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-1000"
                          style={{ 
                            width: `${progress}%`, 
                            backgroundColor: isAchieved ? relic.color : '#333',
                            boxShadow: isAchieved ? `0 0 10px ${relic.color}` : 'none'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Effetto "Glow" per reliquie sbloccate */}
                {isAchieved && (
                  <div 
                    className="absolute -right-10 -bottom-10 w-32 h-32 blur-[60px] opacity-20"
                    style={{ backgroundColor: relic.color }}
                  />
                )}
              </Card>
            );
          })}
        </div>

        <div className="bg-black/60 border border-white/5 p-6 rounded-[32px] text-center space-y-3">
          <p className="text-[10px] font-bold text-[#E67E22] uppercase tracking-[0.3em]">Prossima Immersione</p>
          <p className="text-sm text-[#F4EBD0] font-medium leading-relaxed">
            Continua a navigare con prudenza per far emergere nuovi segreti dagli abissi.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Trophies;