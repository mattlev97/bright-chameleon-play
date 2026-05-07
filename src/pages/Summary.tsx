import React, { useState } from 'react';
import { useBudget } from '../hooks/use-budget';
import AppLayout from '../components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CategoryId } from '../types/budget';
import { Compass, Map as MapIcon, Anchor, Wind, Ship } from 'lucide-react';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORIES: Record<CategoryId, { label: string; icon: string; color: string }> = {
  casa: { label: 'Alloggio', icon: '🏠', color: '#3E7B85' },
  cibo: { label: 'Viveri', icon: '🍕', color: '#E67E22' },
  trasporti: { label: 'Rotta', icon: '🚗', color: '#2980B9' },
  svago: { label: 'Svago', icon: '🎬', color: '#C0392B' },
  salute: { label: 'Cura', icon: '🏥', color: '#27AE60' },
  shopping: { label: 'Merci', icon: '🛍️', color: '#D35400' },
  abbonamenti: { label: 'Segnali', icon: '📱', color: '#8E44AD' },
  regali: { label: 'Tributi', icon: '🎁', color: '#E84393' },
  animali: { label: 'Equipaggio', icon: '🐾', color: '#16A085' },
  istruzione: { label: 'Sapere', icon: '📚', color: '#2C3E50' },
  viaggi: { icon: '✈️', label: 'Esplorazione', color: '#3498DB' },
  investimenti: { icon: '📈', label: 'Tesoro', color: '#2ECC71' },
  altro: { label: 'Varie', icon: '💰', color: '#7F8C8D' },
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
        borderWidth: 0,
        hoverOffset: 20,
      },
    ],
  };

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  return (
    <AppLayout>
      <div className="space-y-8 pt-4">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[#E67E22] p-3 rounded-2xl text-white shadow-[0_0_20px_rgba(230,126,34,0.3)]">
                <MapIcon size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#F4EBD0] tracking-tighter uppercase italic">Carta Nautica</h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Rilevamento carichi e rotte</p>
              </div>
            </div>
          </div>
          
          <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-white/5 rounded-2xl h-14 p-1.5">
              <TabsTrigger value="current" className="rounded-xl font-bold text-xs uppercase tracking-widest data-[state=active]:bg-[#3E7B85] data-[state=active]:text-white">Rotta Attuale</TabsTrigger>
              <TabsTrigger value="history" className="rounded-xl font-bold text-xs uppercase tracking-widest data-[state=active]:bg-[#3E7B85] data-[state=active]:text-white">Vecchi Log</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Card className="p-10 bg-[#1A1A1A] border-none shadow-2xl rounded-[40px] flex flex-col items-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#E67E22] to-transparent" />
          
          <div className="w-full max-w-[240px] aspect-square relative z-10">
            {totalSpent > 0 ? (
              <Pie 
                data={chartData} 
                options={{ 
                  plugins: { legend: { display: false } },
                  cutout: '82%'
                }} 
              />
            ) : (
              <div className="w-full h-full rounded-full border-[12px] border-white/5 flex items-center justify-center">
                <Wind className="text-white/10" size={60} />
              </div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-1">Zavorra</p>
              <p className="text-3xl font-bold text-[#F4EBD0] tracking-tighter">€{totalSpent.toFixed(0)}</p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Anchor size={14} className="text-[#3E7B85]" />
            <h2 className="text-[10px] font-bold text-[#3E7B85] uppercase tracking-[0.3em]">Dettaglio Stiva</h2>
          </div>
          
          {sortedCategories.length === 0 ? (
            <div className="text-center py-16 bg-black/20 rounded-[32px] border-2 border-dashed border-white/5">
              <Ship className="mx-auto text-white/5 mb-4" size={40} />
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest italic">Nessun carico rilevato</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {sortedCategories.map(([catId, amount]) => {
                const cat = CATEGORIES[catId as CategoryId];
                const percentage = ((amount / totalSpent) * 100).toFixed(1);
                return (
                  <div key={catId} className="bg-[#1A1A1A] p-5 rounded-[24px] flex items-center justify-between shadow-xl border-l-4" style={{ borderLeftColor: cat.color }}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-black/40 shadow-inner">
                        {cat.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#F4EBD0] tracking-tight">{cat.label}</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{percentage}% del carico</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#F4EBD0] text-base">€{amount.toFixed(0)}</p>
                      <div className="w-24 h-1.5 bg-black/40 rounded-full mt-2 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full rounded-full" 
                          style={{ backgroundColor: cat.color }} 
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Summary;