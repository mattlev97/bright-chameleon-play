import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import { useBudget } from '../hooks/use-budget';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Zap, Crown, Medal, Lock } from 'lucide-react';
import MascotBlob from '../components/budget/MascotBlob';

interface TrophyItem {
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

  // Logica per calcolare i progressi (simulata basata sui dati attuali)
  // In un'app reale, questi dati verrebbero salvati giornalmente nel dailyHistory
  const totalSaved = stats?.currentSavings || 0;
  const expensesCount = data.expenses.length;
  const daysActive = data.dailyHistory.length || 1;

  const trophies: TrophyItem[] = [
    {
      id: 'saver_100',
      title: 'Risparmiatore Zen',
      description: 'Giorni con 100% di budget risparmiato',
      icon: <Crown size={24} />,
      color: '#F59E0B',
      requirement: 5,
      current: Math.min(5, Math.floor(daysActive / 3)), // Simulazione
      unit: 'gg'
    },
    {
      id: 'saver_50',
      title: 'Formichina',
      description: 'Giorni con almeno il 50% risparmiato',
      icon: <Medal size={24} />,
      color: '#10B981',
      requirement: 10,
      current: Math.min(10, Math.floor(daysActive / 1.5)), // Simulazione
      unit: 'gg'
    },
    {
      id: 'total_savings',
      title: 'Paperone',
      description: 'Risparmio totale accumulato',
      icon: <Trophy size={24} />,
      color: '#6C63FF',
      requirement: 500,
      current: totalSaved,
      unit: '€'
    },
    {
      id: 'consistency',
      title: 'Meticoloso',
      description: 'Spese tracciate con precisione',
      icon: <Target size={24} />,
      color: '#3B82F6',
      requirement: 20,
      current: expensesCount,
      unit: 'spese'
    },
    {
      id: 'impulse_control',
      title: 'Mente Fredda',
      description: 'Evita le spese d\'impulso',
      icon: <Zap size={24} />,
      color: '#EC4899',
      requirement: 7,
      current: Math.max(0, 7 - data.expenses.filter(e => e.weight === 'impulsive').length),
      unit: 'gg'
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-8 pt-4">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <MascotBlob 
                type={data.settings.mascotId} 
                state={totalSaved > 100 ? 'happy' : 'neutral'} 
                size={100} 
              />
              {totalSaved > 500 && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1 shadow-lg animate-bounce">
                  <Crown size={20} className="text-white" />
                </div>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">Sala dei Trofei</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Ogni moneta risparmiata è un passo verso la gloria!</p>
          </div>
        </div>

        <div className="grid gap-4">
          {trophies.map((t) => {
            const isAchieved = t.current >= t.requirement;
            const progress = Math.min(100, (t.current / t.requirement) * 100);

            return (
              <Card key={t.id} className={`p-5 border-none shadow-sm rounded-[24px] relative overflow-hidden transition-all duration-500 ${isAchieved ? 'bg-white dark:bg-[#1A1830]' : 'bg-slate-50/50 dark:bg-slate-900/30 opacity-80'}`}>
                {!isAchieved && (
                  <div className="absolute top-3 right-3 text-slate-300">
                    <Lock size={16} />
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  <div 
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-all duration-700 ${isAchieved ? 'scale-110' : 'grayscale'}`}
                    style={{ backgroundColor: `${t.color}15`, color: t.color }}
                  >
                    {t.icon}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-end">
                      <h3 className={`font-bold text-sm ${isAchieved ? 'text-[#1E1B3A] dark:text-[#F1F0FF]' : 'text-slate-400'}`}>
                        {t.title}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400">
                        {Math.round(t.current)} / {t.requirement} {t.unit}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">{t.description}</p>
                    <div className="pt-2">
                      <Progress value={progress} className="h-1.5 bg-slate-100 dark:bg-slate-800" indicatorClassName={isAchieved ? 'bg-gradient-to-r from-[#6C63FF] to-[#A78BFA]' : ''} />
                    </div>
                  </div>
                </div>

                {isAchieved && (
                  <div className="absolute -bottom-2 -right-2 opacity-5">
                    <Star size={80} fill="currentColor" />
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="bg-[#F5F3FF] dark:bg-[#6C63FF]/10 p-6 rounded-[28px] text-center space-y-2">
          <p className="text-xs font-bold text-[#6C63FF] uppercase tracking-widest">Prossimo Livello</p>
          <p className="text-sm text-[#1E1B3A] dark:text-[#F1F0FF] font-medium">
            Risparmia altri <span className="font-bold text-[#6C63FF]">€ 42</span> per sbloccare il prossimo trofeo!
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Trophies;