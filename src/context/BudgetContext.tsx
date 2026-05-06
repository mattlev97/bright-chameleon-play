import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { BudgetData, Expense, MascotId, ExpenseWeight } from '../types/budget';
import { MascotState } from '../components/budget/MascotBlob';
import { differenceInDays, addMonths, format, parseISO, startOfDay } from 'date-fns';

interface BudgetContextType {
  data: BudgetData;
  stats: any;
  reaction: MascotState | null;
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

const WEIGHT_VALUES: Record<ExpenseWeight, number> = {
  necessary: 0.8,
  neutral: 1.0,
  impulsive: 1.2
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

    let mascotState: MascotState = 'neutral';
    if (dailyBudget > 40) mascotState = 'happy';
    else if (dailyBudget < 15) mascotState = 'sad';

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
      mascotState
    };
  };

  const stats = useMemo(() => calculateStats(data), [data]);

  const triggerReaction = (amount: number, weight: ExpenseWeight) => {
    if (!stats) return;
    
    const currentDailyBudget = stats.dailyBudget || 1; // Evita divisione per zero
    const impact = (amount / currentDailyBudget) * WEIGHT_VALUES[weight];

    let reactionState: MascotState = 'neutral';
    if (impact < 0.3) reactionState = 'happy';
    else if (impact < 0.7) reactionState = 'neutral';
    else if (impact < 1.0) reactionState = 'concerned';
    else reactionState = 'shocked';

    setReaction(reactionState);
    setTimeout(() => setReaction(null), 3000);
  };

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
    triggerReaction(totalAmount, weight);
    
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
      weight
    };
    setData(prev => ({ ...prev, expenses: [newExpense, ...prev.expenses] }));
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.map(e => {
        if (e.id === id) {
          const updated = { ...e, ...updates };
          if (updates.totalAmount !== undefined || updates.spreadDays !== undefined) {
            updated.dailyQuota = (updated.totalAmount / updated.spreadDays);
          }
          return updated;
        }
        return e;
      })
    }));
  };

  const deleteExpense = (id: string) => {
    setData(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== id) }));
  };

  const resetData = () => setData(initialData);

  const updateSettings = (settings: Partial<BudgetData['settings']>) => 
    setData(prev => ({ ...prev, settings: { ...prev.settings, ...settings } }));

  return (
    <BudgetContext.Provider value={{ data, stats, reaction, setSalary, addExpense, updateExpense, deleteExpense, resetData, updateSettings }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgetContext = () => {
  const context = useContext(BudgetContext);
  if (!context) throw new Error('useBudgetContext must be used within a BudgetProvider');
  return context;
};