import React, { useState, useEffect } from 'react';
import { useBudget } from '../hooks/use-budget';
import AppLayout from '../components/layout/AppLayout';
import Onboarding from '../components/budget/Onboarding';
import NotificationPrompt from '../components/budget/NotificationPrompt';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trash2, Wallet, TrendingUp, Target, Repeat } from 'lucide-react';
import { parseISO, isAfter, addDays, startOfDay, format } from 'date-fns';
import { Line } from 'react-chartjs-2';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

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
  const { data, stats, setSalary, deleteExpense, updateSettings } = useBudget();
  const [showNotifyPrompt, setShowNotifyPrompt] = useState(false);

  useEffect(() => {
    if (data.salary && !data.settings.notificationsEnabled && !localStorage.getItem('notify_prompt_shown')) {
      const timer = setTimeout(() => setShowNotifyPrompt(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [data.salary, data.settings.notificationsEnabled]);

  if (!data.salary || !stats) {
    return <Onboarding onComplete={setSalary} />;
  }

  const handleAcceptNotifications = async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      updateSettings({ notificationsEnabled: true });
    }
    setShowNotifyPrompt(false);
    localStorage.setItem('notify_prompt_shown', 'true');
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);

  // Dati per il grafico trend
  const trendLabels = data.dailyHistory.map(h => format(parseISO(h.date), 'dd'));
  const trendValues = data.dailyHistory.map(h => h.budget);
  
  const chartData = {
    labels: trendLabels,
    datasets: [
      {
        fill: true,
        label: 'Budget Reale',
        data: trendValues,
        borderColor: '#6C63FF',
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#6C63FF',
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1E1B3A',
        titleFont: { size: 10 },
        bodyFont: { size: 12, weight: 'bold' as const },
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => `€ ${context.parsed.y.toFixed(2)}`
        }
      }
    },
    scales: {
      x: { display: false },
      y: { 
        display: true,
        grid: { display: false },
        ticks: { font: { size: 10 }, color: '#9CA3AF' }
      }
    }
  };

  // Calcolo obiettivo risparmio
  const savingsProgress = stats.savingsGoal > 0 
    ? Math.min(100, Math.max(0, (stats.currentSavings / stats.savingsGoal) * 100))
    : 0;
  const isGoalReached = stats.savingsGoal > 0 && stats.currentSavings >= stats.savingsGoal;

  return (
    <AppLayout>
      {showNotifyPrompt && (
        <NotificationPrompt 
          onAccept={handleAcceptNotifications}
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
              <span className="text-sm font-medium">
                {stats.daysRemaining} giorni al prossimo stipendio
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-white/70 uppercase tracking-wider">
                <span>Mese trascorso</span>
                <span>{Math.round(stats.progress)}%</span>
              </div>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white/90 transition-all duration-1000" 
                  style={{ width: `${stats.progress}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Obiettivo Risparmio */}
        {stats.savingsGoal > 0 && (
          <Card className={`p-5 border-none shadow-sm rounded-[20px] transition-all duration-500 ${isGoalReached ? 'bg-green-50 dark:bg-green-900/20' : 'bg-white dark:bg-[#1A1830]'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target size={16} className={isGoalReached ? 'text-green-500' : 'text-[#6C63FF]'} />
                <span className="text-sm font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">Obiettivo Risparmio</span>
              </div>
              {isGoalReached && (
                <Badge className="bg-green-500 text-white border-none text-[10px] font-bold animate-bounce">RAGGIUNTO! 🎉</Badge>
              )}
            </div>
            <div className="space-y-2">
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${isGoalReached ? 'bg-green-500' : 'bg-gradient-to-r from-[#6C63FF] to-[#A78BFA]'}`}
                  style={{ width: `${savingsProgress}%` }}
                />
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Hai messo da parte <span className="font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">{formatCurrency(stats.currentSavings)}</span> su {formatCurrency(stats.savingsGoal)}
              </p>
            </div>
          </Card>
        )}

        {/* Grafico Trend */}
        <Card className="p-6 bg-white dark:bg-[#1A1830] border-none shadow-sm rounded-[24px] space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-[#6C63FF]" />
            <h2 className="text-sm font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">Andamento del mese</h2>
          </div>
          <div className="h-[140px] w-full">
            {trendValues.length > 1 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
                Dati insufficienti per il grafico
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-5">
          <div className="flex justify-between items-end px-1">
            <h2 className="text-[18px] font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">Spese recenti</h2>
            <span className="text-[13px] font-medium text-[#6B7280] dark:text-[#9CA3AF]">Saldo: {formatCurrency(stats.availableBalance)}</span>
          </div>

          <div className="space-y-3">
            {data.expenses.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-[#1A1830] rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-sm">
                <p className="text-[#6B7280] text-sm font-medium">Nessuna spesa inserita</p>
              </div>
            ) : (
              data.expenses.map((expense) => {
                const today = startOfDay(new Date());
                const endDate = addDays(parseISO(expense.startDate), expense.spreadDays);
                const isActive = isAfter(endDate, today);
                const cat = CATEGORIES[expense.category] || CATEGORIES.altro;

                return (
                  <div 
                    key={expense.id} 
                    className="bg-white dark:bg-[#1A1830] p-4 rounded-[16px] border-l-4 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all"
                    style={{ borderLeftColor: cat.color }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-xl shadow-inner">
                        {cat.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-[#1E1B3A] dark:text-[#F1F0FF] leading-tight">{expense.description}</h3>
                          {expense.recurring && <Repeat size={12} className="text-[#6C63FF]" />}
                        </div>
                        <p className="text-[12px] text-[#6B7280] dark:text-[#9CA3AF] font-medium mt-0.5">
                          {formatCurrency(expense.dailyQuota)}/gg
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[15px] font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">
                        {formatCurrency(expense.totalAmount)}
                      </span>
                      <div className="flex items-center gap-2">
                        {isActive && (
                          <Badge className="bg-[#EDE9FE] text-[#6C63FF] hover:bg-[#EDE9FE] border-none font-bold text-[10px] px-2 py-0.5 rounded-md">
                            ATTIVA
                          </Badge>
                        )}
                        <button 
                          onClick={() => deleteExpense(expense.id)}
                          className="p-1.5 text-slate-300 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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