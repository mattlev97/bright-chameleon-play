import React from 'react';
import { useBudget } from '../hooks/use-budget';
import AppLayout from '../components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Archive } from 'lucide-react';
import { formatCurrency } from '../utils/toast';

const History = () => {
  const { getHistory } = useBudgetContext();
  const history = getHistory();

  const formatMonth = (dateStr: string) => {
    const d = new Date(dateStr + '-01');
    return d.toLocaleString('it-IT', { month: 'long', year: 'numeric' });
  };

  const getMonthKey = (dateStr: string) => dateStr.slice(0, 7);

  const monthlySummary = history.reduce((acc: any, item: any) => {
    const key = getMonthKey(item.salary?.date || '');
    if (!acc[key]) {
      acc[key] = {
        month: formatMonth(key),
        salary: item.salary?.amount || 0,
        totalSpent: item.expenses.reduce((sum: number, exp: any) => sum + exp.totalAmount, 0),
        saved: item.salary?.amount ? item.salary.amount - item.expenses.reduce((sum: number, exp: any) => sum + exp.totalAmount, 0) : 0,
        expenses: item.expenses,
        dailyHistory: item.dailyHistory,
      };
    }
    return acc;
  }, {});

  const months = Object.entries(monthlySummary)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { reverse: true }))
    .map(([key, data]) => ({
      ...data,
      key,
      formattedMonth: formatMonth(key),
    }));

  return (
    <AppLayout>
      <div className="space-y-8 pt-2">
        <div className="flex items-center gap-3 px-1">
          <div className="bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] p-2 rounded-xl text-white shadow-lg shadow-[#6C63FF]/20">
            <Archive size={20} />
          </div>
          <h1 className="text-2xl font-bold text-[#1E1B3A] dark:text-[#F1F0FF] tracking-tight">Storico</h1>
        </div>

        {months.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-[#1A1830] rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-[#6B7280] text-sm font-medium">Nessuno storico disponibile</p>
          </div>
        ) : (
          months.map((monthData) => (
            <div key={monthData.key} className="bg-white dark:bg-[#1A1830] p-4 rounded-[16px] border border-slate-100/50 dark:border-slate-800/50 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">{monthData.formattedMonth}</span>
                  <span className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                    Stipendio: {formatCurrency(monthData.salary)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#1E1B3A] dark:text-[#F1F0FF]">
                    {monthData.totalSpent === 0 ? 'N/A' : formatCurrency(monthData.totalSpent)}
                  </span>
                  <span className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                    Risparmio: 
                    <span className={monthData.saved >= 0 ? 'text-green-600' : 'text-red-600'}">
                      {formatCurrency(monthData.saved)}
                    </span>
                  </span>
                </div>
              </div>

              <Button 
                variant="secondary" 
                className="mt-2 w-full h-12 rounded-xl bg-[#F3F4F6] dark:bg-slate-800 text-[#374151] dark:text-slate-300 font-bold border-none hover:bg-slate-200 dark:hover:bg-slate-700"
                onClick={() => {
                  // Would open detailed view - placeholder
                  alert(`Dettaglio di ${monthData.formattedMonth}`);
                }}
              >
                Visualizza dettaglio
              </Button>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default History;