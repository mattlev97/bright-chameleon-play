import React from 'react';
import { useBudget } from '../hooks/use-budget';
import AppLayout from '../components/layout/AppLayout';
import Onboarding from '../components/budget/Onboarding';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, Calendar, Trash2, Wallet } from 'lucide-react';
import { parseISO, isAfter, addDays, startOfDay } from 'date-fns';

const Index = () => {
  const { data, stats, setSalary, deleteExpense } = useBudget();

  if (!data.salary || !stats) {
    return <Onboarding onComplete={setSalary} />;
  }

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);

  return (
    <AppLayout>
      <div className="space-y-6 pt-2">
        {/* App Header */}
        <div className="flex items-center gap-3 px-2 mb-2">
          <div className="bg-green-500 p-2 rounded-xl text-white shadow-lg shadow-green-100">
            <Wallet size={24} />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">DailyBudget</h1>
        </div>

        {/* Hero Card */}
        <Card className="p-8 bg-white border-none shadow-2xl shadow-slate-200/50 rounded-[32px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 opacity-50" />
          
          <div className="relative z-10">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Budget di oggi</p>
            <h1 className={`text-5xl font-black tracking-tight mb-6 ${stats.dailyBudget >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {formatCurrency(stats.dailyBudget)}
            </h1>
            
            <div className="flex items-center gap-2 text-slate-500 mb-6">
              <Calendar size={16} className="text-green-500" />
              <span className="text-sm font-bold">
                {stats.daysRemaining} giorni al prossimo stipendio
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Mese trascorso</span>
                <span>{Math.round(stats.progress)}%</span>
              </div>
              <Progress value={stats.progress} className="h-2.5 bg-slate-100" />
            </div>
          </div>
        </Card>

        {/* Spese Recenti */}
        <div className="space-y-4">
          <div className="flex justify-between items-end px-2">
            <h2 className="text-xl font-black text-slate-800">Spese recenti</h2>
            <span className="text-xs font-bold text-slate-400">Saldo: {formatCurrency(stats.availableBalance)}</span>
          </div>

          <div className="space-y-3">
            {data.expenses.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                <p className="text-slate-400 text-sm font-medium">Nessuna spesa inserita</p>
              </div>
            ) : (
              data.expenses.map((expense) => {
                const today = startOfDay(new Date());
                const endDate = addDays(parseISO(expense.startDate), expense.spreadDays);
                const isActive = isAfter(endDate, today);

                return (
                  <div key={expense.id} className="bg-white p-5 rounded-[2rem] border border-slate-50 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${isActive ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                        <TrendingDown size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 leading-tight">{expense.description}</h3>
                        <p className="text-xs text-slate-400 font-bold">
                          {formatCurrency(expense.totalAmount)} • {expense.spreadDays}gg
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-sm font-black text-slate-700">
                        -{formatCurrency(expense.dailyQuota)}/gg
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-green-100 text-green-700 hover:bg-green-100 border-none font-bold px-3" : "bg-slate-100 text-slate-400 border-none font-bold px-3"}>
                          {isActive ? 'Attiva' : 'Conclusa'}
                        </Badge>
                        <button 
                          onClick={() => deleteExpense(expense.id)}
                          className="p-2 text-slate-200 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
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