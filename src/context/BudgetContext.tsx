import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { BudgetData, Expense, Salary } from '../types/budget';
import { differenceInDays, addMonths, format, parseISO, startOfDay } from 'date-fns';

interface BudgetContextType {
  data: BudgetData;
  stats: any;
  setSalary: (amount: number, date: string) => void;
  addExpense: (
    description: string,
    totalAmount: number,
    startDate: string,
    spreadDays: number,
    category: string,
    recurring: boolean
  ) => void;
  deleteExpense: (id: string) => void;
  resetData: () => void;
  updateSettings: (settings: Partial<BudgetData['settings']>) => void;
  getHistory: () => BudgetData[];
  setHistory: (history: BudgetData[]) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const STORAGE_KEY = 'daily_budget_data';
const HISTORY_KEY = 'daily_budget_history';

const initialData: BudgetData = {
  salary: null,
  expenses: [],
  settings: {
    currency: '€',
    language: 'it',
  },
};

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<BudgetData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  const [history, setHistory] = useState<BudgetData[]>(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

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

  const addExpense = (
    description: string,
    totalAmount: number,
    startDate: string,
    spreadDays: number,
    category: string,
    recurring: boolean  ) => {
    const dailyQuota = totalAmount / spreadDays;
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      description,
      totalAmount,
      startDate,
      spreadDays,
      dailyQuota,
      category,
      recurring,
      color: '#6C63FF',
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

  const resetData = () => setData(initialData);

  const updateSettings = (settings: Partial<BudgetData['settings']>) => 
    setData(prev => ({ ...prev, settings: { ...prev.settings, ...settings } }));

  const getHistory = () => history;
  const setHistory = (newHistory: BudgetData[]) => setHistory(newHistory);

  const stats = useMemo(() => {
    if (!data.salary) return null;
    const today = startOfDay(new Date());
    const nextSalaryDate = startOfDay(parseISO(data.salary.nextDate));
    const daysRemaining = Math.max(1, differenceInDays(nextSalaryDate, today));
    
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
    const salaryDate = startOfDay(parseISO(data.salary.date));
    const totalDaysInMonth = differenceInDays(nextSalaryDate, salaryDate);
    const daysPassed = differenceInDays(today, salaryDate);
    const progress = Math.min(100, Math.max(0, (daysPassed / totalDaysInMonth) * 100));

    // Daily history tracking
    const todayKey = today.toISOString().split('T')[0];
    const dailyHistory = JSON.parse(localStorage.getItem('dailyHistory') || '[]');
    const existing = dailyHistory.find(h => h.date === todayKey);
    if (existing) {
      existing.budget = dailyBudget;
    } else {
      dailyHistory.push({ date: todayKey, budget: dailyBudget });
      localStorage.setItem('dailyHistory', JSON.stringify(dailyHistory));
    }

    return { dailyBudget, availableBalance, daysRemaining, progress };
  }, [data]);

  // Handle recurring expenses at salary change
  useEffect(() => {
    if (!data.salary) return;
    
    const currentExpenses = [...data.expenses];
    const recurringExpenses = currentExpenses.filter(e => e.recurring);
        recurringExpenses.forEach(expense => {
      const expenseDate = parseISO(expense.startDate);
      const nextMonthDate = new Date(expenseDate.getFullYear(), expenseDate.getMonth() + 1, expenseDate.getDate());
      if (nextMonthDate <= startOfDay(new Date())) {
        // Create next month instance
        const nextMonthExpense = {
          ...expense,
          id: crypto.randomUUID(),
          startDate: format(nextMonthDate, 'yyyy-MM-dd'),
        };
        // Add to new data after resetting expenses
        setData(prev => ({
          ...prev,
          expenses: [...prev.expenses, nextMonthExpense],
        }));
      }
    });
  }, [data.salary]);

  return (
    <BudgetContext.Provider value={{ 
      data,       stats, 
      setSalary, 
      addExpense, 
      deleteExpense, 
      resetData, 
      updateSettings,
      getHistory,
      setHistory
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgetContext = () => {
  const context = useContext(BudgetContext);
  if (!context) throw new Error('useBudgetContext must be used within a BudgetProvider');
  return context;
};