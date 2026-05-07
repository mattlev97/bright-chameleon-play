import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudget } from '../hooks/use-budget';
import AppLayout from '../components/layout/AppLayout';
import Onboarding from '../components/budget/Onboarding';
import NotificationPrompt from '../components/budget/NotificationPrompt';
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
  const { data, stats, reaction, setSalary, deleteExpense, addExpense, updateSettings } = useBudget();
  const [showNotifyPrompt, setShowNotifyPrompt] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [longPressedExpense, setLongPressedExpense] = useState<any | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (reaction) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [reaction]);

  useEffect(() => {
    if (data.salary && !data.settings.notificationsEnabled && !localStorage.getItem('notify_prompt_shown')) {
      const timer = setTimeout(() => setShowNotifyPrompt(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [data.salary, data.settings.notificationsEnabled]);

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

  const handleTouchStart = (expense: any) => {
    timerRef.current = setTimeout(() => {
      setLongPressedExpense(expense);
      if (navigator.vibrate) navigator.vibrate(50);
    }, 600);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

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
            
            <div className="bg-[#F4EBD0] dark:bg-[#3E7B85]/10 p-5 rounded-2xl space-y-2 border-l-4 border-[#3E7B85]">
              <p className="text-[10px] text-[#3E7B85] font-bold uppercase tracking-widest">Calcolo Rotta</p>
              <p className="text-sm text-[#1A2A2D] dark:text-[#F4EBD0] leading-relaxed">
                Dividiamo il <strong>Disponibile Netto</strong> per i <strong>{stats.daysRemaining} giorni</strong> di navigazione rimasti.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <div className="px-4 py-2 bg-white dark:bg-[#122326] rounded-lg font-bold text-[#3E7B85] shadow-sm">
                  {formatCurrency(stats.dailyBudget)} / giorno
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-8 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="bg-[#3E7B85] p-2.5 rounded-xl text-white shadow-lg shadow-[#3E7B85]/20">
              <Ship size={22} />
            </div>
            <h1 className="text-2xl font-bold text-[#1A2A2D] dark:text-[#F4EBD0] tracking-tighter uppercase">DailyBudget</h1>
          </div>
          
          <button 
            onClick={() => setShowBreakdown(true)}
            className="p-2 text-[#3E7B85] bg-[#3E7B85]/10 rounded-full active:scale-90 transition-transform"
          >
            <Info size={20} />
          </button>
        </div>

        <div className="px-1">
          <BoatScene 
            state={reaction || stats.mascotState} 
            size={190} 
          />
        </div>

        <Card className="p-7 bg-[#3E7B85] border-none shadow-2xl rounded-[28px] relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-1">
              <p className="text-white/60 font-bold text-[10px] uppercase tracking-[0.2em]">Budget Giornaliero</p>
              {stats.savingsGoal > 0 && (
                <Badge className="bg-[#E67E22] text-white border-none text-[8px] font-bold tracking-widest">RISERVA ATTIVA</Badge>
              )}
            </div>
            <h1 className="text-[48px] font-bold text-white tracking-tighter mb-2 leading-none">
              {formatCurrency(stats.dailyBudget)}
            </h1>
            
            <button 
              onClick={() => setShowBreakdown(true)}
              className="flex items-center gap-1 text-white/50 text-[10px] font-bold hover:text-white transition-colors mb-8 uppercase tracking-widest"
            >
              Vedi Log di Calcolo <ChevronRight size={12} />
            </button>

            <div className="flex items-center gap-2 text-white/80 mb-6">
              <Anchor size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">{stats.daysRemaining} giorni al porto</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-bold text-white/50 uppercase tracking-[0.2em]">
                <span>Navigazione</span>
                <span>{Math.round(stats.progress)}%</span>
              </div>
              <div className="h-2.5 w-full bg-black/20 rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${stats.progress}%` }} />
              </div>
            </div>
          </div>
        </Card>

        {stats.savingsGoal > 0 && (
          <Card className={`p-6 border-none shadow-sm rounded-[24px] transition-all duration-500 ${stats.isOnTrack ? 'bg-[#27AE60]/10' : 'bg-[#C0392B]/10'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target size={18} className={stats.isOnTrack ? 'text-[#27AE60]' : 'text-[#C0392B]'} />
                <span className="text-xs font-bold text-[#1A2A2D] dark:text-[#F4EBD0] uppercase tracking-widest">Obiettivo Riserva</span>
              </div>
              {stats.isOnTrack ? (
                <Badge className="bg-[#27AE60] text-white border-none text-[9px] font-bold tracking-widest">IN ROTTA</Badge>
              ) : (
                <Badge className="bg-[#C0392B] text-white border-none text-[9px] font-bold tracking-widest">FUORI ROTTA</Badge>
              )}
            </div>
            <div className="space-y-3">
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${stats.isOnTrack ? 'bg-[#27AE60]' : 'bg-[#C0392B]'}`}
                  style={{ width: `${savingsProgress}%` }}
                />
              </div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                Riserva accumulata: <span className="text-[#1A2A2D] dark:text-[#F4EBD0]">{formatCurrency(stats.currentSavings)}</span> / {formatCurrency(stats.savingsGoal)}
              </p>
            </div>
          </Card>
        )}

        <Card className="p-6 bg-white dark:bg-[#122326] border-none shadow-sm rounded-[24px] space-y-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-[#3E7B85]" />
            <h2 className="text-xs font-bold text-[#1A2A2D] dark:text-[#F4EBD0] uppercase tracking-widest">Marea Finanziaria</h2>
          </div>
          <div className="h-[150px] w-full">
            {trendValues.length > 1 ? (
              <Line 
                data={chartData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } }, 
                  scales: { 
                    x: { display: false }, 
                    y: { display: true, grid: { display: false }, ticks: { display: false } } 
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

        <div className="space-y-5">
          <h2 className="text-sm font-bold text-[#1A2A2D] dark:text-[#F4EBD0] px-1 uppercase tracking-widest">Log Carichi Recenti</h2>
          <div className="space-y-3">
            {data.expenses.length === 0 ? (
              <div className="text-center py-14 bg-white dark:bg-[#122326] rounded-[24px] border-2 border-dashed border-slate-100 dark:border-slate-800">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Nessun carico registrato</p>
              </div>
            ) : (
              data.expenses.map((expense) => {
                const cat = CATEGORIES[expense.category] || CATEGORIES.altro;
                return (
                  <div 
                    key={expense.id} 
                    onPointerDown={() => handleTouchStart(expense)}
                    onPointerUp={handleTouchEnd}
                    onPointerLeave={handleTouchEnd}
                    onClick={() => navigate(`/add?edit=${expense.id}`)}
                    className="bg-white dark:bg-[#122326] p-4 rounded-[20px] border-l-4 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all cursor-pointer select-none"
                    style={{ borderLeftColor: cat.color }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center text-xl shadow-inner">{cat.icon}</div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-[#1A2A2D] dark:text-[#F4EBD0] text-sm leading-tight">{expense.description}</h3>
                          {expense.recurring && <Repeat size={12} className="text-[#3E7B85]" />}
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                          {format(parseISO(expense.startDate), 'dd MMM yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-sm font-bold text-[#1A2A2D] dark:text-[#F4EBD0]">{formatCurrency(expense.totalAmount)}</span>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setExpenseToDelete(expense.id); 
                        }} 
                        className="p-1.5 text-slate-200 hover:text-[#8B2635] transition-colors"
                      >
                        <Trash2 size={14} />
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