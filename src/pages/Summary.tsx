import React, { useEffect, useState } from 'react';
import { useBudget } from '../hooks/use-budget';
import AppLayout from '../components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { formatCurrency } from '../utils/toast';
import { useBudgetContext } from '../context/BudgetContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Summary = () => {
  const { data, stats } = useBudget();
  const { getHistory } = useBudgetContext();
  const [chartData, setChartData] = useState<any>(null);
  const [expenseData, setExpenseData] = useState<any>(null);

  // Build category breakdown
  const categories = {
    'casa': { label: 'Casa', color: '#6C63FF', total: 0 },
    'cibo': { label: 'Cibo', color: '#F59E0B', total: 0 },
    'trasporti': { label: 'Trasporti', color: '#3B82F6', total: 0 },
    'svago': { label: 'Svago', color: '#EC4899', total: 0 },
    'salute': { label: 'Salute', color: '#10B981', total: 0 },
    'shopping': { label: 'Shopping', color: '#F97316', total: 0 },
    'altro': { label: 'Altro', color: '#9CA3AF', total: 0 },
  };

  // Calculate totals per category  data.expenses.forEach(exp => {
    if (categories[exp.category]) {
      categories[exp.category].total += exp.totalAmount;
    }
  });

  const totalSpent = Object.values(categories).reduce((sum, cat) => sum + cat.total, 0);
  const month = data.salary?.date?.slice(0, 7) || new Date().toISOString().slice(0, 7);

  // Prepare doughnut data
  const doughnutLabels = Object.keys(categories).map(key => categories[key].label);
  const doughnutDatasets = Object.keys(categories).map(key => ({
    data: [categories[key].total],
    backgroundColor: categories[key].color,
    hoverBackgroundColor: categories[key].color,
  }));

  setChartData({
    labels: doughnutLabels,
    datasets: doughnutDatasets,
  });

  // Prepare bar chart data for category list
  const sortedCategories = Object.entries(categories)
    .sort(([, a], [, b]) => b.total - a.total)
    .map(([key, cat]) => ({
      label: cat.label,
      value: cat.total,
      color: cat.color,
    }));

  setExpenseData(sortedCategories);

  return (
    <AppLayout>
      <div className="space-y-8 pt-2">
        {/* Header */}
        <div className="flex items-center gap-3 px-1">
          <div className="bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] p-2 rounded-xl text-white shadow-lg shadow-[#6C63FF]/20">
            <Wallet size={20} />
          </div>
          <h1 className="text-2xl font-bold text-[#1E1B3A] dark:text-[#F1F0FF] tracking-tight">Riepilogo</h1>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-6">
          <div className="flex justify-between items-start px-1">
            <h2 className="text-[18px] font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">Spese per categoria</h2>
            <span className="text-[13px] font-medium text-[#6B7280] dark:text-[#9CA3AF]">Totale mese: {formatCurrency(totalSpent)}</span>
          </div>

          {/* Doughnut Chart */}
          <div className="bg-white dark:bg-[#1A1830] p-6 rounded-[20px] border border-slate-100/50 dark:border-slate-800/50 shadow-[0_-8px_32px_rgba(0,0,0,0.05)]">
            <div className="h-96 w-full mx-auto relative">
              <div id="doughnut-chart" className="w-full h-full"></div>
            </div>
          </div>

          {/* Category List */}
          <div className="space-y-3">
            {expenseData?.map((cat: any) => (
              <div key={cat.label} className="flex items-center gap-3 bg-[#F4F6FB] dark:bg-slate-900/50 rounded-2xl p-3 border border-slate-100/50 dark:border-slate-800/50">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-[#6C63FF]" />
                </div>
                <div className="flex flex-col">
                  <p className="font-medium text-[#1E1B3A] dark:text-[#F1F0FF]">{cat.label}</p>
                  <p className="text-[12px] text-[#6B7280] dark:text-[#9CA3AF] font-bold">
                    {formatCurrency(cat.value)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* History Toggle */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            className="px-4 py-2 rounded-xl bg-[#F3F4F6] dark:bg-slate-800 text-[#374151] dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
            onClick={() => navigate('/history')}
          >
            Cronologia
          </Button>
        </div>
      </div>

      {/* Chart.js Doughnut Render */}
      <div className="hidden">
        <div className="w-full h-96 mx-auto rounded-[20px] overflow-hidden shadow-sm">
          <ChartJS 
            data={chartData} 
            type="doughnut" 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const value = context.formattedLabel || '';
                      const data = context.raw as number;
                      return `${value}: ${formatCurrency(data)}`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Summary;