import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudget } from '../hooks/use-budget';
import AppLayout from '../components/layout/AppLayout';
import Onboarding from '../components/budget/Onboarding';
import NotificationPrompt from '../components/budget/NotificationPrompt';
import MascotBlob from '../components/budget/MascotBlob';
import { AIChat } from '../components/budget/AIChat';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, Trash2, Wallet, TrendingUp, Target, 
  Repeat, AlertCircle, CheckCircle2, Copy, Edit3, Info, ChevronRight
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
  casa: { icon: '🏠', color: '#6C63FF' },
  cibo: { icon: '🍕', color: '#F59E0B' },
  trasporti: { icon: '🚗', color: '#3B82F6' },
  svago: { icon: '🎬', color: '#EC4899' },
  salute: { icon: '🏥', color: '#10B981' },
  shopping: { icon: '🛍️', color: '#F97316' },
  abbonamenti: { icon: '📱', color: '#8B5CF6' },
  regali: { icon: '🎁', color: '#F472B6' },
  animali: { icon: '🐾', color: '#10B981' },
  istruzione: { icon: '📚', color: '#3B82F6' },
  viaggi: { icon: '✈️', color: '#06B6D4' },
  investimenti: { icon: '📈', color: '#22C55E' },
  altro: { icon: '💰', color: '#9CA3AF' },
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
      borderColor: '#6C63FF',
      backgroundColor: 'rgba(108, 99, 255, 0.1)',
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#6C63FF',
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
        <AlertDialogContent className="rounded-[24px] max-w-[90%] mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione eliminerà definitivamente la spesa selezionata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-3 sm:justify-end">
            <AlertDialogCancel className="flex-1 rounded-xl mt-0">Annulla</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (expenseToDelete) deleteExpense(expenseToDelete);
                setExpenseToDelete(null);
                showSuccess("Spesa eliminata");
              }}
              className="flex-1 rounded-xl bg-red-500 hover:bg-red-600"
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!longPressedExpense} onOpenChange={() => setLongPressedExpense(null)}>
        <DialogContent className="rounded-[28px] max-w-[85%] mx-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-center text-lg">Opzioni Spesa</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 pt-4">
            <Button 
              onClick={handleDuplicate}
              className="h-14 rounded-2xl bg-[#F5F3FF] text-[#6C63FF] hover:bg-[#EDE9FE] border-none font-bold flex items-center justify-start gap-4 px-6"
            >
              <Copy size={20} />
              Duplica spesa
            </Button>
            <Button 
              onClick={() => {
                navigate(`/add?edit=${longPressedExpense.id}`);
                setLongPressedExpense(null);
              }}
              className="h-14 rounded-2xl bg-slate-50 text-slate-700 hover:bg-slate-100 border-none font-bold flex items-center justify-start gap-4 px-6"
            >
              <Edit3 size={20} />
              Modifica dettagli
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showBreakdown} onOpenChange={setShowBreakdown}>
        <DialogContent className="rounded-[32px] max-w-[90%] mx-auto p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">Come calcoliamo il budget?</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Stipendio Mensile</span>
                <span className="font-bold text-green-500">+{formatCurrency(data.salary.amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Spese Pianificate</span>
                <span className="font-bold text-red-400">-{formatCurrency(stats.totalPlannedExpenses)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Obiettivo Risparmio</span>
                <span className="font-bold text-[#6C63FF]">-{formatCurrency(stats.savingsGoal)}</span>
              </div>
              <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />
              <div className="flex justify-between items-center">
                <span className="text-[#1E1B3A] dark:text-[#F1F0FF] font-bold">Disponibile Totale</span>
                <span className="font-bold text-lg">{formatCurrency(stats.totalAvailableForFreeSpending)}</span>
              </div>
            </div>
            
            <div className="bg-[#F5F3FF] dark:bg-[#6C63FF]/10 p-4 rounded-2xl space-y-2">
              <p className="text-xs text-[#6C63FF] font-bold uppercase tracking-wider">Formula Finale</p>
              <p className="text-sm text-[#1E1B3A] dark:text-[#F1F0FF] leading-relaxed">
                Dividiamo il <strong>Disponibile Totale</strong> per i <strong>{stats.daysRemaining} giorni</strong> rimasti fino al prossimo stipendio.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <div className="px-3 py-1 bg-white dark:bg-[#1A1830] rounded-lg font-bold text-[#6C63FF]">
                  {formatCurrency(stats.dailyBudget)} / giorno
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showNotifyPrompt && (
        <NotificationPrompt 
          onAccept={async () => {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') updateSettings({ notificationsEnabled: true });
            setShowNotifyPrompt(false);
            localStorage.setItem('notify_prompt_shown', 'true');
          }}
          onDecline={() => {
            setShowNotifyPrompt(false);
            localStorage.setItem('notify_prompt_shown', 'true');
          }}
        />
      )}

      <div className="space-y-8 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] p-2 rounded-xl text-white shadow-lg shadow-[#6C63FF]/20">
              <Wallet size={20} />
            </div>
            <h1 className="text-2xl font-bold text-[#1E1B3A] dark:text-[#F1F0FF] tracking-tight">DailyBudget</h1>
          </div>
          
          <button 
            onClick={() => setShowBreakdown(true)}
            className="p-2 text-[#6C63FF] bg-[#F5F3FF] dark:bg-[#6C63FF]/10 rounded-full active:scale-90 transition-transform"
          >
            <Info size={20} />
          </button>
        </div>

        <div className="flex justify-center -mb-12 relative z-20">
          <MascotBlob 
            type={data.settings.mascotId} 
            state={reaction || stats.mascotState} 
            size={120} 
          />
        </div>

        <Card className="p-6 bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] border-none shadow-[0_8px_32px_rgba(108,99,255,0.25)] rounded-[24px] relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-1">
              <p className="text-white/80 font-medium text-[13px]">Budget di oggi</p>
              {stats.savingsGoal > 0 && (
                <Badge className="bg-white/20 text-white border-none text-[9px] font-bold">AL NETTO DEL RISPARMIO</Badge>
              )}
            </div>
            <h1 className="text-[42px] font-bold text-white tracking-tight mb-2 leading-none">
              {formatCurrency(stats.dailyBudget)}
            </h1>
            
            <button 
              onClick={() => setShowBreakdown(true)}
              className="flex items-center gap-1 text-white/70 text-[11px] font-bold hover:text-white transition-colors mb-6"
            >
              VEDI DETTAGLIO CALCOLO <ChevronRight size={12} />
            </button>

            <div className="flex items-center gap-2 text-white/85 mb-6">
              <Calendar size={14} />
              <span className="text-sm font-medium">{stats.daysRemaining} giorni al prossimo stipendio</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-white/70 uppercase tracking-wider">
                <span>Mese trascorso</span>
                <span>{Math.round(stats.progress)}%</span>
              </div>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white/90 transition-all duration-1000" style={{ width: `${stats.progress}%` }} />
              </div>
            </div>
          </div>
        </Card>

        {stats.savingsGoal > 0 && (
          <Card className={`p-5 border-none shadow-sm rounded-[20px] transition-all duration-500 ${stats.isOnTrack ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target size={16} className={stats.isOnTrack ? 'text-green-500' : 'text-red-500'} />
                <span className="text-sm font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">Obiettivo Risparmio</span>
              </div>
              <div className="flex items-center gap-1.5">
                {stats.isOnTrack ? (
                  <Badge className="bg-green-500 text-white border-none text-[10px] font-bold gap-1">
                    <CheckCircle2 size={10} /> IN LINEA
                  </Badge>
                ) : (
                  <Badge className="bg-red-500 text-white border-none text-[10px] font-bold gap-1">
                    <AlertCircle size={10} /> SPENDI TROPPO
                  </Badge>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${stats.isOnTrack ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${savingsProgress}%` }}
                />
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Hai messo da parte <span className="font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">{formatCurrency(stats.currentSavings)}</span> su {formatCurrency(stats.savingsGoal)}
              </p>
            </div>
          </Card>
        )}

        <Card className="p-6 bg-white dark:bg-[#1A1830] border-none shadow-sm rounded-[24px] space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-[#6C63FF]" />
            <h2 className="text-sm font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">Andamento del mese</h2>
          </div>
          <div className="h-[140px] w-full">
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
              <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
                Dati insufficienti
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-5">
          <h2 className="text-[18px] font-bold text-[#1E1B3A] dark:text-[#F1F0FF] px-1">Spese recenti</h2>
          <div className="space-y-3">
            {data.expenses.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-[#1A1830] rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-sm">
                <p className="text-[#6B7280] text-sm font-medium">Nessuna spesa inserita</p>
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
                    className="bg-white dark:bg-[#1A1830] p-4 rounded-[16px] border-l-4 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all cursor-pointer select-none"
                    style={{ borderLeftColor: cat.color }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-xl shadow-inner">{cat.icon}</div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-[#1E1B3A] dark:text-[#F1F0FF] leading-tight">{expense.description}</h3>
                          {expense.recurring && <Repeat size={12} className="text-[#6C63FF]" />}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                          {format(parseISO(expense.startDate), 'dd MMM yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[15px] font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">{formatCurrency(expense.totalAmount)}</span>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setExpenseToDelete(expense.id); 
                        }} 
                        className="p-1.5 text-slate-300 hover:text-red-400 transition-colors"
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
      
      {/* Integrazione Chat AI */}
      <AIChat />
    </AppLayout>
  );
};

export default Index;