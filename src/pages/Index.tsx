import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudget } from '../hooks/use-budget';
import AppLayout from '../components/layout/AppLayout';
import Onboarding from '../components/budget/Onboarding';
import Pet from '../components/budget/Pet';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trash2, Info, ChevronRight, Leaf, Flower2, TreePine } from 'lucide-react';
import { parseISO, format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { showSuccess } from '../utils/toast';
import { motion } from 'framer-motion';

const CATEGORIES: Record<string, { icon: string; color: string }> = {
  casa: { icon: '🏠', color: '#4F6F52' },
  cibo: { icon: '🍕', color: '#AD8B73' },
  trasporti: { icon: '🚗', color: '#86A789' },
  svago: { icon: '🎬', color: '#E2C2B9' },
  salute: { icon: '🏥', color: '#4F6F52' },
  shopping: { icon: '🛍️', color: '#AD8B73' },
  altro: { icon: '💰', color: '#6B7353' },
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

  const petMood = !stats.isOnTrack ? 'sad' : (stats.currentSavings > 100 ? 'happy' : 'neutral');

  return (
    <AppLayout>
      <Dialog open={showBreakdown} onOpenChange={setShowBreakdown}>
        <DialogContent className="rounded-[32px] max-w-[90%] mx-auto p-8 border-none bg-[#FBFADA]">
          <DialogHeader><DialogTitle className="text-xl font-bold text-[#12372A]">Analisi dell'Oasi</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex justify-between"><span>Entrate</span><span className="font-bold text-green-600">+{formatCurrency(data.salary.amount)}</span></div>
            <div className="flex justify-between"><span>Spese Fisse</span><span className="font-bold text-red-500">-{formatCurrency(stats.totalPlannedExpenses)}</span></div>
            <div className="flex justify-between"><span>Risparmio</span><span className="font-bold text-[#AD8B73]">-{formatCurrency(stats.savingsGoal)}</span></div>
            <div className="h-px bg-[#E2C2B9]/30 w-full" />
            <div className="flex justify-between"><span className="font-bold">Disponibile</span><span className="font-bold text-lg">{formatCurrency(stats.totalAvailableForFreeSpending)}</span></div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-8 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2"><Leaf className="text-[#4F6F52]" size={24} /><h1 className="text-2xl font-bold text-[#12372A] font-serif">EcoBudget</h1></div>
          <button onClick={() => setShowBreakdown(true)} className="p-2 text-[#4F6F52] bg-[#86A789]/10 rounded-full"><Info size={20} /></button>
        </div>

        <div className="relative pt-16">
          <div className="absolute top-0 left-0 w-full z-20 pointer-events-none">
            <Pet type={data.settings.selectedPet} mood={petMood} />
          </div>

          <Card className="p-8 bg-[#4F6F52] border-none shadow-2xl rounded-[40px] relative overflow-hidden">
            {/* Decorazioni dinamiche dell'Oasi */}
            <div className="absolute bottom-0 left-0 w-full h-12 flex items-end justify-around px-4 pointer-events-none">
              {stats.isOnTrack && (
                <>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}><Flower2 className="text-[#FBFADA]/30" size={20} /></motion.div>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }}><TreePine className="text-[#FBFADA]/20" size={32} /></motion.div>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }}><Flower2 className="text-[#FBFADA]/30" size={16} /></motion.div>
                </>
              )}
              <div className="w-full h-4 bg-[#3A5A40]/30 absolute bottom-0 left-0" />
            </div>
            
            <div className="relative z-10">
              <p className="text-[#FBFADA]/80 font-medium text-xs uppercase tracking-widest mb-1">Budget di oggi</p>
              <h1 className="text-5xl font-bold text-[#FBFADA] tracking-tight mb-4">{formatCurrency(stats.dailyBudget)}</h1>
              <button onClick={() => setShowBreakdown(true)} className="flex items-center gap-1 text-[#FBFADA]/60 text-[10px] font-bold hover:text-[#FBFADA] transition-colors mb-6">DETTAGLI CALCOLO <ChevronRight size={12} /></button>
              <div className="flex items-center gap-2 text-[#FBFADA]/80 mb-6"><Calendar size={14} /><span className="text-xs font-medium">{stats.daysRemaining} giorni al raccolto</span></div>
              <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden"><div className="h-full bg-[#FBFADA] transition-all duration-1000" style={{ width: `${stats.progress}%` }} /></div>
            </div>
          </Card>
        </div>

        <Card className={`p-6 border-2 shadow-sm rounded-[32px] transition-all duration-500 ${stats.isOnTrack ? 'border-[#86A789] bg-[#FBFADA]' : 'border-red-200 bg-red-50'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><Leaf size={18} className={stats.isOnTrack ? 'text-[#4F6F52]' : 'text-red-500'} /><span className="text-sm font-bold text-[#12372A]">Salute dell'Oasi</span></div>
            <Badge className={`${stats.isOnTrack ? 'bg-[#4F6F52]' : 'bg-red-500'} text-white border-none text-[10px] font-bold`}>{stats.isOnTrack ? 'FLORESCENTE' : 'IN PERICOLO'}</Badge>
          </div>
          <div className="space-y-3">
            <div className="h-3 w-full bg-slate-200/50 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-1000 ${stats.isOnTrack ? 'bg-[#4F6F52]' : 'bg-red-500'}`} style={{ width: `${Math.min(100, (stats.currentSavings / (stats.savingsGoal || 1)) * 100)}%` }} />
            </div>
            <p className="text-[11px] font-medium text-[#4F6F52]">{stats.isOnTrack ? 'L\'oasi è rigogliosa e il tuo amico sta bene!' : 'L\'oasi sta appassendo. Riduci le spese per salvarla.'}</p>
          </div>
        </Card>

        <div className="space-y-5">
          <h2 className="text-lg font-bold text-[#12372A] px-1 font-serif">Ultime attività</h2>
          <div className="space-y-3">
            {data.expenses.map((expense) => {
              const cat = CATEGORIES[expense.category] || CATEGORIES.altro;
              return (
                <div key={expense.id} onClick={() => navigate(`/add?edit=${expense.id}`)} className="bg-white dark:bg-[#1A2A22] p-5 rounded-[24px] border-2 border-transparent hover:border-[#86A789]/30 flex items-center justify-between shadow-sm transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FBFADA] flex items-center justify-center text-xl">{cat.icon}</div>
                    <div><h3 className="font-bold text-[#12372A] text-sm">{expense.description}</h3><p className="text-[10px] text-[#4F6F52]/60 font-bold uppercase tracking-wider">{format(parseISO(expense.startDate), 'dd MMM')}</p></div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-bold text-[#12372A]">{formatCurrency(expense.totalAmount)}</span>
                    <button onClick={(e) => { e.stopPropagation(); deleteExpense(expense.id); showSuccess("Rimosso"); }} className="text-slate-300 hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;