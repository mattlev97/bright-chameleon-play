import { useState, useEffect, useMemo } from 'react';
import { BudgetData, Expense, Salary } from '../types/budget';
import { differenceInDays, addMonths, format, parseISO, startOfDay, isAfter, isBefore, addDays } from 'date-fns';

const STORAGE_KEY = 'daily_budget_data';

const initialData: BudgetData = {
  salary: null,
  expenses: [],
  settings: {
    currency: '€',
    language: 'it',
  },
};

export function useBudget() {
  const [data, setData] = useState<BudgetData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const setSalary = (amount: number, date: string) => {
    const startDate = parseISO(date);
    const nextDate = addMonths(startDate, 1);
    
    setData(prev => ({
      ...prev,
      salary: {
        amount,
        date,
        nextDate: format(nextDate, 'yyyy-MM-dd'),
      },
    }));
  };

  const addExpense = (description: string, totalAmount: number, startDate: string, spreadDays: number) => {
    const dailyQuota = totalAmount / spreadDays;
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      description,
      totalAmount,
      startDate,
      spreadDays,
      dailyQuota,
    };

    setData(prev => ({
      ...prev,
      expenses: [newExpense, ...prev.expenses],
    }));
  };

  const deleteExpense = (id: string) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== id),
    }));
  };

  const resetData = () => {
    setData(initialData);
  };

  const stats = useMemo(() => {
    if (!data.salary) return null;

    const today = startOfDay(new Date());
    const nextSalaryDate = startOfDay(parseISO(data.salary.nextDate));
    const daysRemaining = Math.max(1, differenceInDays(nextSalaryDate, today));
    
    // Calcolo quanto è già stato "consumato" dalle spese fino a oggi
    let totalSpentSoFar = 0;
    data.expenses.forEach(expense => {
      const expStart = startOfDay(parseISO(expense.startDate));
      const daysSinceStart = differenceInDays(today, expStart);
      
      if (daysSinceStart >= 0) {
        const daysToCharge = Math.min(daysSinceStart, expense.spreadDays);
        totalSpentSoFar += daysToCharge * expense.dailyQuota;
      }
    });

    const availableBalance = data.salary.amount - totalSpentSoFar;
    const dailyBudget = availableBalance / daysRemaining;

    // Progresso del mese
    const salaryDate = startOfDay(parseISO(data.salary.date));
    const totalDaysInMonth = differenceInDays(nextSalaryDate, salaryDate);
    const daysPassed = differenceInDays(today, salaryDate);
    const progress = Math.min(100, Math.max(0, (daysPassed / totalDaysInMonth) * 100));

    return {
      dailyBudget,
      availableBalance,
      daysRemaining,
      progress,
    };
  }, [data]);

  return {
    data,
    setSalary,
    addExpense,
    deleteExpense,
    resetData,
    stats,
    updateSettings: (settings: Partial<BudgetData['settings']>) => 
      setData(prev => ({ ...prev, settings: { ...prev.settings, ...settings } })),
  };
}