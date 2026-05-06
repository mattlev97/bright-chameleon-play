import React, { useState } from 'react';
import { useBudget } from '../hooks/use-budget';
import AppLayout from '../components/layout/AppLayout';
import Onboarding from '../components/budget/Onboarding';
import DeleteConfirmationModal from '../components/budget/DeleteConfirmationModal';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trash2, Wallet } from 'lucide-react';
import { parseISO, isAfter, addDays, startOfDay } from 'date-fns';
import { Expense } from '../types/budget';

const Index = () => {
  const { data, stats, setSalary, deleteExpense } = useBudget();
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  if (!data.salary || !stats) {
    return <Onboarding onComplete={setSalary} />;
  }

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);

  const getCategoryIcon = (desc: string) => {
    const d = desc.toLowerCase();
    if (d.includes('spesa') || d.includes('cibo')) return '🛒';
    if (d.includes('affitto') || d.includes('casa')) return '🏠';
    if (d.includes('cena') || d.includes('ristorante')) return '🍕';
    if (d.includes('trasporti') || d.includes('auto')) return '🚗';
    if (d.includes('svago') || d.includes('cinema')) return '🎬';
    return '💰';
  };

  const handleDeleteConfirm = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete.id);
      setExpenseToDelete(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8 pt-2">
        {/* App Header */}
        <div className="flex items-center gap-3 px-1">
          <div className="bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] p-2 rounded-xl text-white shadow-lg shadow-[#6C63FF]/20">
            <Wallet size={20} />
          </div>
          <h1 className="text-2xl font-bold text-[#1E1B3A] dark:text-[#F1F0FF] tracking-tight">DailyBudget</h1>
        </div>

        {/* Hero Card Premium */}
        <Card className="p-6 bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] border-none shadow-[0_8px_32px_rgba(108,99,255,0.25)] rounded-[24px] relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <svg className="absolute bottom-0 left-0 w-full opacity-15 pointer-events-none" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#ffffff" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,218.7C960,235,1056,213,1152,186.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          
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

        {/* Spese Recenti */}
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

                return (
                  <div key={expense.id} className="bg-white dark:bg-[#1A1830] p-4 rounded-[16px] border border-slate-100/50 dark:border-slate-800/50 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-xl shadow-inner">
                        {getCategoryIcon(expense.description)}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#1E1B3A] dark:text-[#F1F0FF] leading-tight">{expense.description}</h3>
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
                          onClick={() => setExpenseToDelete(expense)}
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

      {/* Modal di conferma eliminazione */}
      <DeleteConfirmationModal 
        isOpen={!!expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={handleDeleteConfirm}
        expenseName={expenseToDelete?.description || ''}
      />
    </AppLayout>
  );
};

export default Index;