import { useBudgetContext } from '../context/BudgetContext';

export function useBudget() {
  return useBudgetContext();
}