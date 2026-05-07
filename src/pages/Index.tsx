import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudget } from '../hooks/use-budget';
import AppLayout from '../components/layout/AppLayout';
import Onboarding from '../components/budget/Onboarding';
import BoatScene from '../components/budget/BoatScene';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, Trash2, Anchor, TrendingUp, Target, 
  Repeat, AlertCircle, CheckCircle2, Copy, Edit3, Info, ChevronRight, Ship
} from 'lucide-react';
import { parseISO, format } from 'date-fns';
import { Line } from 'react-chartjs-2';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Filler,
  Legend,
} from 'chart.js';
import { showSuccess } from '../utils/toast';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Filler, Legend);

const CATEGORIES: Record<string, { icon: string; color: string }> = {
  casa: { icon: '🏠', color: '#3E7B85' },
  cibo: { icon: '🍕', color: '#E67E22' },
  trasporti: { icon: '🚗', color: '#2980B9' },
  svago: { icon: '🎬', color: '#C0392B' },
  salute: { icon: '🏥', color: '#27AE60' },
  shopping: { icon: '🛍️', color: '#D35400' },
  abbonamenti: { icon: '📱', color: '#8E44AD' },
  regali: { icon: '🎁', color: '#E84393' },
  animali: { icon: '🐾', color: '#16A085' },
  istruzione: { icon: '📚', color: '#2C3E50' },
  viaggi: { icon: '✈️', color: '#3498DB' },
  investimenti: { icon: '📈', color: '#2ECC71' },
  altro: { icon: '💰', color: '#7F8C8D' },
};

const Index = () => {
  const navigate = useNavigate();
  const { data, stats, reaction, setSalary, deleteExpense, addExpense } = useBudget();
  const [showBreakdown, setShowBreakdown] = useState(false);
  
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [longPressedExpense, setLongPressedExpense] = useState<any | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  if (!data.salary || !stats) {
    return <Onboarding onComplete={setSalary} />;
  }

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);

  const trendLabels = data.dailyHistory.map(h => format(parseISO(h.date), 'dd'));
  const trendValues = data.dailyHistory.map(h => h.budget);
  
  const chartData = {
    labels: trendLabels,
    datasets: [{
      fill: true,
      label: 'Budget Reale',
      data: trendValues,
      borderColor: '#3E7B85',
      backgroundColor: 'rgba(62, 123, 133, 0.1)',
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#3E7B85',
    }],
  };

  const savingsProgress = stats.savingsGoal > 0 
    ? Math.min(100, Math.max(0, (stats.currentSavings / stats.savingsGoal) * 100))
    : 0;

  const handleDuplicate = () => {
    if (longPressedExpense) {
      addExpense(
        longPressedExpense.description + " (Copia)",
        longPressedExpense.totalAmount,
        new Date().toISOString().split('T')[0],
        longPressedExpense.spreadDays,
        longPressedExpense.category,
        longPressedExpense.recurring,
        longPressedExpense.weight || 'neutral'
      );
      showSuccess("Spesa duplicata!");
      setLongPressedExpense(null);
    }
  };

  return (
    <AppLayout>
      <AlertDialog open={!!expenseToDelete} onOpenChange={() => setExpenseToDelete(null)}>
        <AlertDialogContent className="rounded-[24px] max-w-[90%] mx-auto border-2 border-[#8B2635]/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Abbandonare il carico?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa spesa verrà rimossa definitivamente dal log di bordo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-3 sm:justify-end">
            <AlertDialogCancel className="flex-1 rounded-xl mt-0">Annulla</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (expenseToDelete) deleteExpense(expenseToDelete);
                setExpenseToDelete(null);
                showSuccess("Carico rimosso");
              }}
              className="flex-1 rounded-xl bg-[#8B2635] hover:bg-[#6B1D29]"
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!longPressedExpense} onOpenChange={() => setLongPressedExpense(null)}>
        <DialogContent className="rounded-[28px] max-w-[85%] mx-auto p-6 border-2 border-[#3E7B85]/20">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold uppercase tracking-widest">Opzioni Carico</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 pt-4">
            <Button 
              onClick={handleDuplicate}
              className="h-14 rounded-xl bg-[#F4EBD0] text-[#3E7B85] hover:bg-[#EADDB8] border-none font-bold flex items-center justify-start gap-4 px-6"
            >
              <Copy size={20} />
              Duplica spesa
            </Button>
            <Button 
              onClick={() => {
                navigate(`/add?edit=${longPressedExpense.id}`);
                setLongPressedExpense(null);
              }}
              className="h-14 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 border-none font-bold flex items-center justify-start gap-4 px-6"
            >
              <Edit3 size={20} />
              Modifica dettagli
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showBreakdown} onOpenChange={setShowBreakdown}>
        <DialogContent className="rounded-[32px] max-w-[90%] mx-auto p-8 border-2 border-[#3E7B85]/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1A2A2D] dark:text-[#F4EBD0] uppercase tracking-tighter">Log di Navigazione</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">Rifornimento</span>
                <span className="font-bold text-[#3E7B85]">+{formatCurrency(data.salary.amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">Carico Spese</span>
                <span className="font-bold text-[#8B2635]">-{formatCurrency(stats.totalPlannedExpenses)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">Riserva Risparmio</span>
                <span className="font-bold text-[#E67E22]">-{formatCurrency(stats.savingsGoal)}</span>
              </div>
              <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />
              <div className="flex justify-between items-center">
                <span className="text-[#1A2A2D] dark:text-[#F4EBD0] font-bold">Disponibile Netto</span>
                <span className="font-bold text-lg">{formatCurrency(stats.totalAvailableForFreeSpending)}</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-6 pt-2">
        {/* Nuova Testata Integrata */}
        <div className="px-1">
          <BoatScene 
            state={reaction || stats.mascotState} 
            dailyBudget={stats.dailyBudget}
            size={300} 
          />
        </div>

        {/* Info Navigazione Rapida */}
        <div className="flex gap-3 px-1">
          <Card className="flex-1 p-4 bg-white dark:bg-[#122326] border-none shadow-sm rounded-2xl flex flex-col items-center gap-1">
            <Anchor size={16} className="text-[#3E7B85]" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Giorni al Porto</span>
            <span className="text-sm font-bold text-[#1A2A2D] dark:text-[#F4EBD0]">{stats.daysRemaining}</span>
          </Card>
          <Card className="flex-1 p-4 bg-white dark:bg-[#122326] border-none shadow-sm rounded-2xl flex flex-col items-center gap-1">
            <Target size={16} className="text-[#E67E22]" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Riserva</span>
            <span className="text-sm font-bold text-[#1A2A2D] dark:text-[#F4EBD0]">{formatCurrency(stats.currentSavings)}</span>
          </Card>
          <button 
            onClick={() => setShowBreakdown(true)}
            className="p-4 bg-[#3E7B85]/10 rounded-2xl text-[#3E7B85] active:scale-90 transition-transform"
          >
            <Info size={20} />
          </button>
        </div>

        {stats.savingsGoal > 0 && (
          <Card className={`p-5 border-none shadow-sm rounded-[24px] transition-all duration-500 ${stats.isOnTrack ? 'bg-[#27AE60]/10' : 'bg-[#C0392B]/10'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-[#1A2A2D] dark:text-[#F4EBD0] uppercase tracking-widest">Rotta Risparmio</span>
              <Badge className={stats.isOnTrack ? 'bg-[#27AE60] text-white' : 'bg-[#C0392B] text-white'}>
                {stats.isOnTrack ? 'IN ROTTA' : 'FUORI ROTTA'}
              </Badge>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${stats.isOnTrack ? 'bg-[#27AE60]' : 'bg-[#C0392B]'}`}
                style={{ width: `${savingsProgress}%` }}
              />
            </div>
          </Card>
        )}

        <Card className="p-6 bg-white dark:bg-[#122326] border-none shadow-sm rounded-[24px] space-y-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-[#3E7B85]" />
            <h2 className="text-xs font-bold text-[#1A2A2D] dark:text-[#F4EBD0] uppercase tracking-widest">Marea Finanziaria</h2>
          </div>
          <div className="h-[120px] w-full">
            {trendValues.length > 1 ? (
              <Line 
                data={chartData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } }, 
                  scales: { 
                    x: { display: false }, 
                    y: { display: false } 
                  } 
                }} 
              />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs italic font-medium">
                In attesa di dati di navigazione...
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xs font-bold text-[#1A2A2D] dark:text-[#F4EBD0] px-1 uppercase tracking-widest">Log Carichi Recenti</h2>
          <div className="space-y-3">
            {data.expenses.length === 0 ? (
              <div className="text-center py-10 bg-white dark:bg-[#122326] rounded-[24px] border-2 border-dashed border-slate-100 dark:border-slate-800">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Nessun carico registrato</p>
              </div>
            ) : (
              data.expenses.map((expense) => {
                const cat = CATEGORIES[expense.category] || CATEGORIES.altro;
                return (
                  <div 
                    key={expense.id} 
                    onClick={() => navigate(`/add?edit=${expense.id}`)}
                    className="bg-white dark:bg-[#122326] p-4 rounded-[20px] border-l-4 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                    style={{ borderLeftColor: cat.color }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center text-lg">{cat.icon}</div>
                      <div>
                        <h3 className="font-bold text-[#1A2A2D] dark:text-[#F4EBD0] text-sm leading-tight">{expense.description}</h3>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                          {format(parseISO(expense.startDate), 'dd MMM')}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-bold text-[#1A2A2D] dark:text-[#F4EBD0]">{formatCurrency(expense.totalAmount)}</span>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setExpenseToDelete(expense.id); 
                        }} 
                        className="p-1 text-slate-200 hover:text-[#8B2635]"
                      >
                        <Trash2 size={12} />
                      </button>
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