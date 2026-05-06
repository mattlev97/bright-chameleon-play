import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudget } from '../hooks/use-budget';
import AppLayout from '../components/layout/AppLayout';
import Onboarding from '../components/budget/Onboarding';
import Blob from '../components/budget/Blob';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trash2, Info, ChevronRight, Sparkles, Wallet } from 'lucide-react';
import { parseISO, format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { showSuccess } from '../utils/toast';
import { motion } from 'framer-motion';

const CATEGORIES: Record<string, { icon: string; color: string }> = {
  casa: { icon: '🏠', color: '#6C63FF' },
  cibo: { icon: '🍕', color: '#F59E0B' },
  trasporti: { icon: '🚗', color: '#3B82F6' },
  svago: { icon: '🎬', color: '#EC4899' },
  salute: { icon: '🏥', color: '#10B981' },
  shopping: { icon: '🛍️', color: '#F97316' },
  altro: { icon: '💰', color: '#9CA3AF' },
};

const Index = () => {
  const navigate = useNavigate();
  const { data, stats, setSalary, deleteExpense } = useBudget();
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!data.salary || !stats) {
    return <Onboarding onComplete={setSalary} />;
  }

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);

  const blobMood = !stats.isOnTrack ? 'sad' : (stats.currentSavings > 100 ? 'happy' : 'neutral');

  return (
    <AppLayout>
      <Dialog open={showBreakdown} onOpenChange={setShowBreakdown}>
        <DialogContent className="rounded-[32px] max-w-[90%] mx-auto p-8 border-none bg-white">
          <DialogHeader><DialogTitle className="text-xl font-bold text-slate-800">Dettaglio Budget</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex justify-between"><span>Entrate</span><span className="font-bold text-green-600">+{formatCurrency(data.salary.amount)}</span></div>
            <div className="flex justify-between"><span>Spese Fisse</span><span className="font-bold text-red-500">-{formatCurrency(stats.totalPlannedExpenses)}</span></div>
            <div className="flex justify-between"><span>Risparmio</span><span className="font-bold text-[#6C63FF]">-{formatCurrency(stats.savingsGoal)}</span></div>
            <div className="h-px bg-slate-100 w-full" />
            <div className="flex justify-between"><span className="font-bold">Disponibile</span><span className="font-bold text-lg text-[#6C63FF]">{formatCurrency(stats.totalAvailableForFreeSpending)}</span></div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-8 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#6C63FF] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#6C63FF]/20">
              <Wallet size={20} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">DailyBudget</h1>
          </div>
          <button onClick={() => setShowBreakdown(true)} className="p-2 text-slate-400 hover:text-[#6C63FF] transition-colors"><Info size={20} /></button>
        </div>

        <div className="relative flex justify-center py-4">
          <Blob type={data.settings.selectedBlob} mood={blobMood} />
        </div>

        <Card className="p-8 bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] border-none shadow-2xl shadow-[#6C63FF]/30 rounded-[40px] relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 p-6 opacity-20"><Sparkles size={64} /></div>
          
          <div className="relative z-10">
            <p className="text-white/70 font-medium text-xs uppercase tracking-widest mb-1">Budget di oggi</p>
            <h1 className="text-5xl font-bold tracking-tight mb-4">{formatCurrency(stats.dailyBudget)}</h1>
            <button onClick={() => setShowBreakdown(true)} className="flex items-center gap-1 text-white/60 text-[10px] font-bold hover:text-white transition-colors mb-6">ANALISI COMPLETA <ChevronRight size={12} /></button>
            <div className="flex items-center gap-2 text-white/80 mb-6"><Calendar size={14} /><span className="text-xs font-medium">{stats.daysRemaining} giorni alla fine</span></div>
            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-white transition-all duration-1000" style={{ width: `${stats.progress}%` }} /></div>
          </div>
        </Card>

        <Card className={`p-6 border-none shadow-sm rounded-[32px] transition-all duration-500 ${stats.isOnTrack ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">Stato Finanziario</span>
            </div>
            <Badge className={`${stats.isOnTrack ? 'bg-green-500' : 'bg-red-500'} text-white border-none text-[10px] font-bold`}>{stats.isOnTrack ? 'IN TARGET' : 'FUORI TARGET'}</Badge>
          </div>
          <div className="space-y-3">
            <div className="h-3 w-full bg-white rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-1000 ${stats.isOnTrack ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, (stats.currentSavings / (stats.savingsGoal || 1)) * 100)}%` }} />
            </div>
            <p className={`text-[11px] font-medium ${stats.isOnTrack ? 'text-green-600' : 'text-red-600'}`}>
              {stats.isOnTrack ? 'Ottimo lavoro! Stai rispettando i tuoi obiettivi.' : 'Attenzione: stai spendendo più del previsto.'}
            </p>
          </div>
        </Card>

        <div className="space-y-5 pb-4">
          <h2 className="text-lg font-bold text-slate-800 px-1">Ultime attività</h2>
          <div className="space-y-3">
            {data.expenses.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm italic">Nessuna spesa registrata</div>
            ) : (
              data.expenses.map((expense) => {
                const cat = CATEGORIES[expense.category] || CATEGORIES.altro;
                return (
                  <div key={expense.id} onClick={() => navigate(`/add?edit=${expense.id}`)} className="bg-white p-5 rounded-[24px] border border-slate-100 hover:border-[#6C63FF]/30 flex items-center justify-between shadow-sm transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl">{cat.icon}</div>
                      <div><h3 className="font-bold text-slate-800 text-sm">{expense.description}</h3><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{format(parseISO(expense.startDate), 'dd MMM')}</p></div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-bold text-slate-800">{formatCurrency(expense.totalAmount)}</span>
                      <button onClick={(e) => { e.stopPropagation(); deleteExpense(expense.id); showSuccess("Rimosso"); }} className="text-slate-300 hover:text-red-400"><Trash2 size={14} /></button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;