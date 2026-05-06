import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { BudgetData, Expense, MascotId } from '../types/budget';
import { differenceInDays, addMonths, format, parseISO, startOfDay, endOfDay } from 'date-fns';

interface BudgetContextType {
  data: BudgetData;
  stats: any;
  setSalary: (amount: number, date: string, mascotId?: MascotId, savingsGoal?: number) => void;
  addExpense: (description: string, totalAmount: number, startDate: string, spreadDays: number, category: any, recurring: boolean) => void;
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const calculateStats = (currentData: BudgetData) => {
    if (!currentData.salary) return null;
    
    const today = startOfDay(new Date());
    const nextSalaryDate = startOfDay(parseISO(currentData.salary.nextDate));
    const salaryDate = startOfDay(parseISO(currentData.salary.date));
    
    // Calcolo giorni rimanenti reale
    const daysRemaining = Math.max(1, differenceInDays(nextSalaryDate, today));
    const totalDaysInMonth = Math.max(1, differenceInDays(nextSalaryDate, salaryDate));
    const daysPassed = Math.max(0, differenceInDays(today, salaryDate));
    
    const totalPlannedExpenses = currentData.expenses.reduce((acc, e) => acc + e.totalAmount, 0);
    const savingsGoal = currentData.settings.savingsGoal || 0;

    // Budget giornaliero = (Stipendio - Spese Totali - Obiettivo Risparmio) / Giorni Rimanenti
    const totalAvailableForFreeSpending = currentData.salary.amount - totalPlannedExpenses - savingsGoal;
    const dailyBudget = Math.max(0, totalAvailableForFreeSpending / daysRemaining);
    
    // Calcolo risparmio corrente basato sulle spese effettivamente "accadute"
    let accruedExpenses = 0;
    currentData.expenses.forEach(expense => {
      const expStart = startOfDay(parseISO(expense.startDate));
      const daysSinceStart = differenceInDays(today, expStart) + 1; // +1 perché il primo giorno conta
      
      if (daysSinceStart > 0) {
        const daysToCharge = Math.min(daysSinceStart, expense.spreadDays);
        accruedExpenses += daysToCharge * expense.dailyQuota;
      }
    });

    // Il risparmio attuale è lo stipendio meno quello che abbiamo già "consumato"
    const currentSavings = currentData.salary.amount - accruedExpenses;
    const progress = Math.min(100, (daysPassed / totalDaysInMonth) * 100);
    
    // Siamo in linea se quello che ci resta è >= a quello che dovremmo avere (Stipendio - Spese Proporzionali - Risparmio Proporzionale)
    const expectedExpensesAtThisPoint = (totalPlannedExpenses / totalDaysInMonth) * daysPassed;
    const expectedSavingsAtThisPoint = (savingsGoal / totalDaysInMonth) * daysPassed;
    
    // Semplifichiamo: siamo in linea se il risparmio attuale è coerente con l'obiettivo
    const isOnTrack = currentSavings >= (currentData.salary.amount - expectedExpensesAtThisPoint - expectedSavingsAtThisPoint);

    let mascotState: 'happy' | 'neutral' | 'sad' = 'neutral';
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

  const addExpense = (description: string, totalAmount: number, startDate: string, spreadDays: number, category: any, recurring: boolean) => {
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