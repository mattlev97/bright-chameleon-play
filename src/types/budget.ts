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
}

export interface Settings {
  currency: string;
  language: string;
}

export interface BudgetData {
  salary: Salary | null;
  expenses: Expense[];
  settings: Settings;
}