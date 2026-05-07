import React, { useState } from 'react';
import { useBudget } from '../hooks/use-budget';
import AppLayout from '../components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CategoryId } from '../types/budget';
import { Compass, Map as MapIcon, TrendingDown } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORIES: Record<CategoryId, { label: string; icon: string; color: string }> = {
  casa: { label: 'Casa', icon: '🏠', color: '#3E7B85' },
  cibo: { label: 'Cibo', icon: '🍕', color: '#E67E22' },
  trasporti: { label: 'Trasporti', icon: '🚗', color: '#2980B9' },
  svago: { label: 'Svago', icon: '🎬', color: '#C0392B' },
  salute: { label: 'Salute', icon: '🏥', color: '#27AE60' },
  shopping: { label: 'Shopping', icon: '🛍️', color: '#D35400' },
  abbonamenti: { label: 'Abbonamenti', icon: '📱', color: '#8E44AD' },
  regali: { label: 'Regali', icon: '🎁', color: '#E84393' },
  animali: { label: 'Animali', icon: '🐾', color: '#16A085' },
  istruzione: { label: 'Istruzione', icon: '📚', color: '#2C3E50' },
  viaggi: { icon: '✈️', label: 'Viaggi', color: '#3498DB' },
  investimenti: { icon: '📈', label: 'Investimenti', color: '#2ECC71' },
  altro: { label: 'Altro', icon: '💰', color: '#7F8C8D' },
};

const Summary = () => {
  const { data } = useBudget();
  const [view, setView] = useState<'current' | 'history'>('current');

  const expenses = view === 'current' 
    ? data.expenses 
    : data.history.flatMap(h => h.expenses);

  const categoryTotals = expenses.reduce((acc, exp) => {
    const cat = exp.category || 'altro';
    acc[cat] = (acc[cat] || 0) + exp.totalAmount;
    return acc;
  }, {} as Record<string, number>);

  const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  const chartData = {
    labels: Object.keys(categoryTotals).map(cat => CATEGORIES[cat as CategoryId]?.label || cat),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: Object.keys(categoryTotals).map(cat => CATEGORIES[cat as CategoryId]?.color || '#7F8C8D'),
        borderWidth: 2,
        borderColor: '#F4EBD0',
        hoverOffset: 15,
      },
    ],
  };

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  return (
    <AppLayout>
      <div className="space-y-6 pt-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#E67E22] p-2.5 rounded-xl text-white shadow-lg shadow-[#E67E22]/20">
              <MapIcon size={22} />
            </div>
            <h1 className="text-2xl font-bold text-[#1A2A2D] dark:text-[#F4EBD0] tracking-tighter uppercase">Mappa Spese</h1>
          </div>
          
          <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#3E7B85]/10 dark:bg-[#3E7B85]/20 rounded-xl h-12 p-1">
              <TabsTrigger value="current" className="rounded-lg font-bold data-[state=active]:bg-[#3E7B85] data-[state=active]:text-white">Rotta Attuale</TabsTrigger>
              <TabsTrigger value="history" className="rounded-lg font-bold data-[state=active]:bg-[#3E7B85] data-[state=active]:text-white">Archivio Log</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Card className="p-8 bg-white dark:bg-[#122326] border-none shadow-sm rounded-[32px] flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#E67E22]" />
          <div className="w-full max-w-[220px] aspect-square relative z-10">
            {totalSpent > 0 ? (
              <Pie 
                data={chartData} 
                options={{ 
                  plugins: { legend: { display: false } },
                  cutout: '75%'
                }} 
              />
            ) : (
              <div className="w-full h-full rounded-full border-8 border-slate-50 dark:border-slate-900 flex items-center justify-center">
                <Compass className="text-slate-200" size={48} />
              </div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Uscite</p>
              <p className="text-2xl font-bold text-[#1A2A2D] dark:text-[#F4EBD0]">€ {totalSpent.toFixed(0)}</p>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <h2 className="text-[10px] font-bold text-[#3E7B85] uppercase tracking-[0.2em] px-1">Dettaglio Carichi</h2>
          {sortedCategories.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm italic bg-white/50 dark:bg-black/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              Nessun carico registrato in questa tratta
            </div>
          ) : (
            sortedCategories.map(([catId, amount]) => {
              const cat = CATEGORIES[catId as CategoryId];
              const percentage = ((amount / totalSpent) * 100).toFixed(1);
              return (
                <div key={catId} className="bg-white dark:bg-[#122326] p-4 rounded-2xl border-l-4 flex items-center justify-between shadow-sm" style={{ borderLeftColor: cat.color }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-slate-50 dark:bg-slate-900 shadow-inner">
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#1A2A2D] dark:text-[#F4EBD0]">{cat.label}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{percentage}% del totale</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#1A2A2D] dark:text-[#F4EBD0]">€ {amount.toFixed(2)}</p>
                    <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full mt-1 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: cat.color }} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Summary;