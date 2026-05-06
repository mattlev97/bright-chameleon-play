export type CategoryId = 'casa' | 'cibo' | 'trasporti' | 'svago' | 'salute' | 'shopping' | 'altro';

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
  color: string;
}

export interface Salary {
  amount: number;
  date: string;
  nextDate: string;
}

export interface Expense {
  id: string;
  description: string;
  totalAmount: number;
  startDate: string;
  spreadDays: number;
  dailyQuota: number;
  category: CategoryId;
  recurring: boolean;
}

export interface DailyHistory {
  date: string;
  budget: number;
}

export interface MonthSnapshot {
  month: string;
  salary: number;
  totalSpent: number;
  saved: number;
  expenses: Expense[];
  dailyHistory: DailyHistory[];
}

export interface Settings {
  currency: string;
  language: string;
  savingsGoal: number;
  notificationsEnabled: boolean;
}

export interface BudgetData {
  salary: Salary | null;
  expenses: Expense[];
  settings: Settings;
  dailyHistory: DailyHistory[];
  history: MonthSnapshot[];
}