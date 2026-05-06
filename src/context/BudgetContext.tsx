import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { BudgetData, Expense, MascotId, MascotState, ExpenseWeight } from '../types/budget';
import { differenceInDays, addMonths, format, parseISO, startOfDay } from 'date-fns';

interface BudgetContextType {
  data: BudgetData;
  stats: any;
  setSalary: (amount: number, date: string, mascotId?: MascotId, savingsGoal?: number) => void;
  addExpense: (description: string, totalAmount: number, startDate: string, spreadDays: number, category: any, recurring: boolean, weight: ExpenseWeight) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  resetData: () => void;
  updateSettings: (settings: Partial<BudgetData['settings']>) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const STORAGE_KEY = 'daily_budget_premium_v1';

const initialData: BudgetData = {
  salary: null,
  expenses: [],
  settings: {
    currency: '€',
    language: 'it',
    savingsGoal: null,
    notificationsEnabled: false,
    mascotId: 'classic',
  },
  dailyHistory: [],
  history: [],
};

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<BudgetData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  const [reaction, setReaction] = useState<MascotState | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const calculateStats = (currentData: BudgetData) => {
    if (!currentData.salary) return null;
    
    const today = startOfDay(new Date());
    const nextSalaryDate = startOfDay(parseISO(currentData.salary.nextDate));
    const salaryDate = startOfDay(parseISO(currentData.salary.date));
    
    const daysRemaining = Math.max(1, differenceInDays(nextSalaryDate, today));
    const totalDaysInMonth = Math.max(1, differenceInDays(nextSalaryDate, salaryDate));
    const daysPassed = Math.max(0, differenceInDays(today, salaryDate));
    
    const totalPlannedExpenses = currentData.expenses.reduce((acc, e) => acc + e.totalAmount, 0);
    const savingsGoal = currentData.settings.savingsGoal || 0;

    const totalAvailableForFreeSpending = currentData.salary.amount - totalPlannedExpenses - savingsGoal;
    const dailyBudget = Math.max(0, totalAvailableForFreeSpending / daysRemaining);
    const currentSavings = currentData.salary.amount - totalPlannedExpenses;
    const isOnTrack = currentSavings >= savingsGoal;
    const progress = Math.min(100, (daysPassed / totalDaysInMonth) * 100);

    // Stato base della mascotte
    let baseState: MascotState = 'neutral';
    if (dailyBudget > 40) baseState = 'happy';
    else if (dailyBudget < 15) baseState = 'concerned';

    return { 
      dailyBudget, 
      daysRemaining, 
      progress, 
      currentSavings,
      savingsGoal,
      totalPlannedExpenses,
      isOnTrack,
      totalDaysInMonth,
      totalAvailableForFreeSpending,
      mascotState: reaction || baseState
    };
  };

  const stats = useMemo(() => calculateStats(data), [data, reaction]);

  const setSalary = (amount: number, date: string, mascotId?: MascotId, savingsGoal?: number) => {
    const startDate = parseISO(date);
    const nextDate = addMonths(startDate, 1);
    setData(prev => ({
      ...prev,
      salary: { amount, date, nextDate: format(nextDate, 'yyyy-MM-dd') },
      settings: { 
        ...prev.settings, 
        mascotId: mascotId || prev.settings.mascotId,
        savingsGoal: savingsGoal !== undefined ? savingsGoal : prev.settings.savingsGoal
      }
    }));
  };

  const addExpense = (description: string, totalAmount: number, startDate: string, spreadDays: number, category: any, recurring: boolean, weight: ExpenseWeight) => {
    const dailyQuota = totalAmount / spreadDays;
    
    // Calcolo reazione immediata
    if (stats) {
      const weightMultiplier = weight === 'necessary' ? 0.8 : weight === 'impulse' ? 1.2 : 1.0;
      const impact = (totalAmount / stats.dailyBudget) * weightMultiplier;
      
      let newReaction: MascotState = 'neutral';
      if (impact < 0.3) newReaction = 'happy';
      else if (impact >= 0.3 && impact < 0.7) newReaction = 'neutral';
      else if (impact >= 0.7 && impact < 1.0) newReaction = 'concerned';
      else newReaction = 'shocked';

      setReaction(newReaction);
      setTimeout(() => setReaction(null), 3000);
    }

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      description,
      totalAmount,
      startDate,
      spreadDays,
      dailyQuota,
      category,
      recurring,
      weight
    };
    setData(prev => ({ ...prev, expenses: [newExpense, ...prev.expenses] }));
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.map(e => (e.id === id ? { ...e, ...updates } : e))
    }));
  };

  const deleteExpense = (id: string) => {
    setData(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== id) }));
  };

  const resetData = () => setData(initialData);

  const updateSettings = (settings: Partial<BudgetData['settings']>) => 
    setData(prev => ({ ...prev, settings: { ...prev.settings, ...settings } }));

  return (
    <BudgetContext.Provider value={{ data, stats, setSalary, addExpense, updateExpense, deleteExpense, resetData, updateSettings }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgetContext = () => {
  const context = useContext(BudgetContext);
  if (!context) throw new Error('useBudgetContext must be used within a BudgetProvider');
  return context;
};