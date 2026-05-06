export type CategoryId = 
  | 'casa' | 'cibo' | 'trasporti' | 'svago' | 'salute' | 'shopping' 
  | 'abbonamenti' | 'regali' | 'animali' | 'istruzione' | 'viaggi' | 'investimenti' | 'altro';

export type MascotId = 'classic' | 'tall' | 'wide';
export type MascotState = 'happy' | 'neutral' | 'concerned' | 'shocked';
export type ExpenseWeight = 'necessary' | 'neutral' | 'impulse';

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
  weight: ExpenseWeight;
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
  savingsGoal: number | null;
  notificationsEnabled: boolean;
  mascotId: MascotId;
}

export interface BudgetData {
  salary: Salary | null;
  expenses: Expense[];
  settings: Settings;
  dailyHistory: DailyHistory[];
  history: MonthSnapshot[];
}