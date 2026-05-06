import React, { useState } from 'react';
import { useBudget } from '../hooks/use-budget';
import AppLayout from '../components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CategoryId } from '../types/budget';

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORIES: Record<CategoryId, { label: string; icon: string; color: string }> = {
  casa: { label: 'Casa', icon: '🏠', color: '#6C63FF' },
  cibo: { label: 'Cibo', icon: '🍕', color: '#F59E0B' },
  trasporti: { label: 'Trasporti', icon: '🚗', color: '#3B82F6' },
  svago: { label: 'Svago', icon: '🎬', color: '#EC4899' },
  salute: { label: 'Salute', icon: '🏥', color: '#10B981' },
  shopping: { label: 'Shopping', icon: '🛍️', color: '#F97316' },
  altro: { label: 'Altro', icon: '💰', color: '#9CA3AF' },
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
        backgroundColor: Object.keys(categoryTotals).map(cat => CATEGORIES[cat as CategoryId]?.color || '#9CA3AF'),
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  return (
    <AppLayout>
      <div className="space-y-6 pt-2">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">Riepilogo</h1>
          <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-900 rounded-xl h-12 p-1">
              <TabsTrigger value="current" className="rounded-lg font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-[#1A1830] data-[state=active]:shadow-sm">Questo mese</TabsTrigger>
              <TabsTrigger value="history" className="rounded-lg font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-[#1A1830] data-[state=active]:shadow-sm">Storico totale</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Card className="p-8 bg-white dark:bg-[#1A1830] border-none shadow-[0_4px_20px_rgba(0,0,0,0.04)] rounded-[24px] flex flex-col items-center">
          <div className="w-full max-w-[240px] aspect-square relative">
            {totalSpent > 0 ? (
              <Pie 
                data={chartData} 
                options={{ 
                  plugins: { legend: { display: false } },
                  cutout: '70%'
                }} 
              />
            ) : (
              <div className="w-full h-full rounded-full border-8 border-slate-50 dark:border-slate-900 flex items-center justify-center">
                <p className="text-slate-400 text-xs font-medium">Nessun dato</p>
              </div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Totale</p>
              <p className="text-xl font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">€ {totalSpent.toFixed(0)}</p>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <h2 className="text-sm font-bold text-[#1E1B3A] dark:text-[#F1F0FF] px-1">Dettaglio Categorie</h2>
          {sortedCategories.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">Nessuna spesa registrata</div>
          ) : (
            sortedCategories.map(([catId, amount]) => {
              const cat = CATEGORIES[catId as CategoryId];
              const percentage = ((amount / totalSpent) * 100).toFixed(1);
              return (
                <div key={catId} className="bg-white dark:bg-[#1A1830] p-4 rounded-2xl border border-slate-100/50 dark:border-slate-800/50 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#1E1B3A] dark:text-[#F1F0FF]">{cat.label}</h3>
                      <p className="text-[11px] font-medium text-slate-400">{percentage}% del totale</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">€ {amount.toFixed(2)}</p>
                    <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full mt-1 overflow-hidden">
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