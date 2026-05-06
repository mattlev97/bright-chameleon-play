import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudget } from '../hooks/use-budget';
import AppLayout from '../components/layout/AppLayout';
import Onboarding from '../components/budget/Onboarding';
import NotificationPrompt from '../components/budget/NotificationPrompt';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, Trash2, Wallet, TrendingUp, Target, 
  Repeat, AlertCircle, CheckCircle2, Copy, Edit3 
} from 'lucide-react';
import { parseISO, isAfter, addDays, startOfDay, format } from 'date-fns';
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
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { showSuccess } from '../utils/toast';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

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
  const { data, stats, setSalary, deleteExpense, addExpense, updateSettings } = useBudget();
  const [showNotifyPrompt, setShowNotifyPrompt] = useState(false);
  
  // Stati per eliminazione e duplicazione
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [longPressedExpense, setLongPressedExpense] = useState<any | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Gestione Long Press
  const handleTouchStart = (expense: any) => {
    timerRef.current = setTimeout(() => {
      setLongPressedExpense(expense);
      if (navigator.vibrate) navigator.vibrate(50); // Feedback aptico
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
        new Date().toISOString().split('T')[0], // Data odierna per la copia
        longPressedExpense.spreadDays,
        longPressedExpense.category,
        longPressedExpense.recurring
      );
      showSuccess("Spesa duplicata!");
      setLongPressedExpense(null);
    }
  };

  return (
    <AppLayout>
      {/* Dialog di conferma eliminazione */}
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

      {/* Menu Duplicazione (Long Press) */}
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
        <div className="flex items-center gap-3 px-1">
          <div className="bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] p-2 rounded-xl text-white shadow-lg shadow-[#6C63FF]/20">
            <Wallet size={20} />
          </div>
          <h1 className="text-2xl font-bold text-[#1E1B3A] dark:text-[#F1F0FF] tracking-tight">DailyBudget</h1>
        </div>

        <Card className="p-6 bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] border-none shadow-[0_8px_32px_rgba(108,99,255,0.25)] rounded-[24px] relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <p className="text-white/80 font-medium text-[13px] mb-1">Budget di oggi</p>
            <h1 className="text-[42px] font-bold text-white tracking-tight mb-4 leading-none">
              {formatCurrency(stats.dailyBudget)}
            </h1>
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
            {trendValues.length > 1 ? <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: true, grid: { display: false } } } }} /> : <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">Dati insufficienti</div>}
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
    </AppLayout>
  );
};

export default Index;