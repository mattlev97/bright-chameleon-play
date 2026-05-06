import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBudget } from '../hooks/use-budget';
import AppLayout from '../components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Sparkles, Repeat } from 'lucide-react';
import { CategoryId } from '../types/budget';
import { differenceInDays, endOfMonth, parseISO, startOfDay } from 'date-fns';

const CATEGORIES: { id: CategoryId; label: string; icon: string; color: string }[] = [
  { id: 'casa', label: 'Casa', icon: '🏠', color: '#6C63FF' },
  { id: 'cibo', label: 'Cibo', icon: '🍕', color: '#F59E0B' },
  { id: 'trasporti', label: 'Trasporti', icon: '🚗', color: '#3B82F6' },
  { id: 'svago', label: 'Svago', icon: '🎬', color: '#EC4899' },
  { id: 'salute', label: 'Salute', icon: '🏥', color: '#10B981' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#F97316' },
  { id: 'abbonamenti', label: 'Abbonamenti', icon: '📱', color: '#8B5CF6' },
  { id: 'regali', label: 'Regali', icon: '🎁', color: '#F472B6' },
  { id: 'animali', label: 'Animali', icon: '🐾', color: '#10B981' },
  { id: 'istruzione', label: 'Istruzione', icon: '📚', color: '#3B82F6' },
  { id: 'viaggi', label: 'Viaggi', icon: '✈️', color: '#06B6D4' },
  { id: 'investimenti', label: 'Investimenti', icon: '📈', color: '#22C55E' },
  { id: 'altro', label: 'Altro', icon: '💰', color: '#9CA3AF' },
];

const AddExpense = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addExpense, updateExpense, data } = useBudget();
  
  const editId = new URLSearchParams(location.search).get('edit');
  const editExpense = editId ? data.expenses.find(e => e.id === editId) : null;

  const [description, setDescription] = useState(editExpense?.description || '');
  const [amount, setAmount] = useState(editExpense?.totalAmount.toString() || '');
  const [date, setDate] = useState(editExpense?.startDate || new Date().toISOString().split('T')[0]);
  const [isSpread, setIsSpread] = useState(editExpense ? editExpense.spreadDays > 1 : false);
  const [days, setDays] = useState(editExpense?.spreadDays.toString() || '1');
  const [category, setCategory] = useState<CategoryId>(editExpense?.category || 'altro');
  const [recurring, setRecurring] = useState(editExpense?.recurring || false);

  // Calcolo automatico giorni spalma
  useEffect(() => {
    if (isSpread && !editExpense) {
      const selectedDate = parseISO(date);
      const lastDay = endOfMonth(selectedDate);
      const remaining = differenceInDays(lastDay, selectedDate) + 1;
      setDays(remaining.toString());
    }
  }, [isSpread, date]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description && amount) {
      const spreadDays = isSpread ? parseInt(days) : 1;
      if (editId) {
        updateExpense(editId, {
          description,
          totalAmount: parseFloat(amount),
          startDate: date,
          spreadDays,
          category,
          recurring
        });
      } else {
        addExpense(description, parseFloat(amount), date, spreadDays, category, recurring);
      }
      navigate('/');
    }
  };

  const dailyQuota = amount && days ? (parseFloat(amount) / (isSpread ? parseInt(days) : 1)).toFixed(2) : '0.00';

  return (
    <AppLayout>
      <div className="space-y-6 pt-2">
        <div className="flex items-center justify-between px-1">
          <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-[#1A1830] rounded-xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 active:scale-90 transition-transform shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">
            {editId ? 'Modifica spesa' : 'Nuova spesa'}
          </h1>
          <div className="w-10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 bg-white dark:bg-[#1A1830] border-none shadow-[0_4px_20px_rgba(0,0,0,0.04)] rounded-[24px] space-y-6">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Categoria</Label>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center gap-1 min-w-[64px] p-2 rounded-xl border-2 transition-all ${
                      category === cat.id 
                        ? 'border-[#6C63FF] bg-[#F5F3FF] dark:bg-[#6C63FF]/10' 
                        : 'border-transparent bg-slate-50 dark:bg-slate-900/50'
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-[10px] font-bold">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc" className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Descrizione</Label>
              <Input 
                id="desc"
                placeholder="Es. Affitto, Cena, Spesa..." 
                className="h-13 rounded-xl border-[1.5px] border-slate-200 dark:border-slate-800 bg-transparent focus:border-[#6C63FF] focus:ring-0 transition-all"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Importo Totale</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E1B3A] dark:text-[#F1F0FF] font-bold">€</span>
                <Input 
                  id="amount"
                  type="number" 
                  step="0.01"
                  placeholder="0.00" 
                  className="pl-10 h-13 rounded-xl border-[1.5px] border-slate-200 dark:border-slate-800 bg-transparent focus:border-[#6C63FF] focus:ring-0 transition-all font-bold"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Data spesa</Label>
              <Input 
                id="date"
                type="date" 
                className="h-13 rounded-xl border-[1.5px] border-slate-200 dark:border-slate-800 bg-transparent focus:border-[#6C63FF] focus:ring-0 transition-all font-medium"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#F4F6FB] dark:bg-slate-900/50 rounded-2xl">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">Spalma su più giorni</Label>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">Dividi il costo nel tempo</p>
                </div>
                <Switch 
                  checked={isSpread}
                  onCheckedChange={setIsSpread}
                  className="data-[state=checked]:bg-[#6C63FF]"
                />
              </div>

              {isSpread && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <Label htmlFor="days" className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Numero di giorni</Label>
                  <Input 
                    id="days"
                    type="number" 
                    placeholder="30" 
                    className="h-13 rounded-xl border-[1.5px] border-slate-200 dark:border-slate-800 bg-transparent focus:border-[#6C63FF] focus:ring-0 transition-all"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-[#F4F6FB] dark:bg-slate-900/50 rounded-2xl">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Repeat size={14} className="text-[#6C63FF]" />
                    <Label className="text-sm font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">Spesa ricorrente</Label>
                  </div>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">Si ripete ogni mese</p>
                </div>
                <Switch 
                  checked={recurring}
                  onCheckedChange={setRecurring}
                  className="data-[state=checked]:bg-[#6C63FF]"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-[#F5F3FF] dark:bg-[#6C63FF]/10 border-none rounded-[24px]">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={18} className="text-[#6C63FF]" />
              <span className="font-bold text-[#6C63FF] text-sm">Anteprima Quota</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-3xl font-bold text-[#6C63FF]">€ {dailyQuota}</p>
                <p className="text-[11px] text-[#6C63FF]/70 font-bold uppercase tracking-wider">Al giorno</p>
              </div>
              <Button type="submit" className="bg-gradient-to-r from-[#6C63FF] to-[#A78BFA] text-white hover:opacity-90 font-bold rounded-xl px-8 h-12 shadow-lg shadow-[#6C63FF]/20">
                {editId ? 'Salva' : 'Aggiungi'}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </AppLayout>
  );
};

export default AddExpense;