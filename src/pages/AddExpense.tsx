import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBudget } from '../hooks/use-budget';
import AppLayout from '../components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Sparkles, Repeat, CalendarRange, ShieldCheck, Zap, HelpCircle, Package } from 'lucide-react';
import { CategoryId, ExpenseWeight } from '../types/budget';
import { differenceInDays, endOfMonth, parseISO } from 'date-fns';

const CATEGORIES: { id: CategoryId; label: string; icon: string; color: string }[] = [
  { id: 'casa', label: 'Casa', icon: '🏠', color: '#3E7B85' },
  { id: 'cibo', label: 'Cibo', icon: '🍕', color: '#E67E22' },
  { id: 'trasporti', label: 'Trasporti', icon: '🚗', color: '#2980B9' },
  { id: 'svago', label: 'Svago', icon: '🎬', color: '#C0392B' },
  { id: 'salute', label: 'Salute', icon: '🏥', color: '#27AE60' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#D35400' },
  { id: 'abbonamenti', label: 'Abbonamenti', icon: '📱', color: '#8E44AD' },
  { id: 'regali', label: 'Regali', icon: '🎁', color: '#E84393' },
  { id: 'animali', label: 'Animali', icon: '🐾', color: '#16A085' },
  { id: 'istruzione', label: 'Istruzione', icon: '📚', color: '#2C3E50' },
  { id: 'viaggi', label: 'Viaggi', icon: '✈️', color: '#3498DB' },
  { id: 'investimenti', label: 'Investimenti', icon: '📈', color: '#2ECC71' },
  { id: 'altro', label: 'Altro', icon: '💰', color: '#7F8C8D' },
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
  const [days, setDays] = useState(editExpense?.spreadDays.toString() || '1');
  const [category, setCategory] = useState<CategoryId>(editExpense?.category || 'altro');
  const [recurring, setRecurring] = useState(editExpense?.recurring || false);
  const [weight, setWeight] = useState<ExpenseWeight>(editExpense?.weight || 'neutral');

  useEffect(() => {
    if (!editExpense) {
      const selectedDate = parseISO(date);
      const lastDay = endOfMonth(selectedDate);
      const remaining = differenceInDays(lastDay, selectedDate) + 1;
      setDays(remaining.toString());
    }
  }, [date]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description && amount) {
      const spreadDays = Math.max(1, parseInt(days));
      if (editId) {
        updateExpense(editId, {
          description,
          totalAmount: parseFloat(amount),
          startDate: date,
          spreadDays,
          category,
          recurring,
          weight
        });
      } else {
        addExpense(description, parseFloat(amount), date, spreadDays, category, recurring, weight);
      }
      navigate('/');
    }
  };

  const dailyQuota = amount && days ? (parseFloat(amount) / Math.max(1, parseInt(days))).toFixed(2) : '0.00';

  return (
    <AppLayout>
      <div className="space-y-6 pt-2">
        <div className="flex items-center justify-between px-1">
          <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-[#122326] rounded-xl border-2 border-[#3E7B85]/10 text-[#3E7B85] active:scale-90 transition-transform shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-[#1A2A2D] dark:text-[#F4EBD0] uppercase tracking-tighter">
            {editId ? 'Modifica Carico' : 'Nuovo Carico'}
          </h1>
          <div className="w-10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 bg-white dark:bg-[#122326] border-none shadow-sm rounded-[28px] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#3E7B85]" />
            
            {/* Selettore Peso Carico */}
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3E7B85]">Gravità del Carico</Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setWeight('necessary')}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${
                    weight === 'necessary' 
                      ? 'border-[#27AE60] bg-[#27AE60]/10 text-[#27AE60]' 
                      : 'border-transparent bg-slate-50 dark:bg-slate-900/50 text-slate-400'
                  }`}
                >
                  <ShieldCheck size={20} />
                  <span className="text-[9px] font-bold uppercase">Vitale</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWeight('neutral')}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${
                    weight === 'neutral' 
                      ? 'border-[#3E7B85] bg-[#3E7B85]/10 text-[#3E7B85]' 
                      : 'border-transparent bg-slate-50 dark:bg-slate-900/50 text-slate-400'
                  }`}
                >
                  <Package size={20} />
                  <span className="text-[9px] font-bold uppercase">Standard</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWeight('impulsive')}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${
                    weight === 'impulsive' 
                      ? 'border-[#C0392B] bg-[#C0392B]/10 text-[#C0392B]' 
                      : 'border-transparent bg-slate-50 dark:bg-slate-900/50 text-slate-400'
                  }`}
                >
                  <Zap size={20} />
                  <span className="text-[9px] font-bold uppercase">Rischio</span>
                </button>
              </div>
            </div>

            {/* Categorie */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3E7B85]">Categoria</Label>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center gap-1 min-w-[68px] p-3 rounded-xl border-2 transition-all ${
                      category === cat.id 
                        ? 'border-[#E67E22] bg-[#E67E22]/10' 
                        : 'border-transparent bg-slate-50 dark:bg-slate-900/50'
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-[9px] font-bold uppercase tracking-tighter">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3E7B85]">Descrizione Log</Label>
              <Input 
                id="desc"
                placeholder="Es. Rifornimento, Esca, Cena..." 
                className="h-13 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-transparent focus:border-[#3E7B85] transition-all"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3E7B85]">Valore Totale</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A2A2D] dark:text-[#F4EBD0] font-bold">€</span>
                <Input 
                  id="amount"
                  type="number" 
                  step="0.01"
                  placeholder="0.00" 
                  className="pl-10 h-13 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-transparent font-bold text-lg"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3E7B85]">Data</Label>
                <Input 
                  id="date"
                  type="date" 
                  className="h-13 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-transparent font-medium"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="days" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3E7B85]">Giorni Tratta</Label>
                <Input 
                  id="days"
                  type="number" 
                  min="1"
                  className="h-13 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-transparent font-bold"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F4EBD0]/50 dark:bg-black/20 rounded-2xl border-2 border-dashed border-[#3E7B85]/20">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Repeat size={14} className="text-[#E67E22]" />
                  <Label className="text-xs font-bold text-[#1A2A2D] dark:text-[#F4EBD0] uppercase">Carico Ricorrente</Label>
                </div>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Si ripete ogni mese</p>
              </div>
              <Switch 
                checked={recurring}
                onCheckedChange={setRecurring}
                className="data-[state=checked]:bg-[#E67E22]"
              />
            </div>
          </Card>

          {/* Pannello di Controllo Impatto */}
          <Card className="p-6 bg-[#3E7B85] border-none rounded-[28px] shadow-xl shadow-[#3E7B85]/20">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={18} className="text-white/60" />
              <span className="font-bold text-white/80 text-[10px] uppercase tracking-[0.2em]">Impatto Giornaliero</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-3xl font-bold text-white">€ {dailyQuota}</p>
                <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest">Per ogni giorno di tratta</p>
              </div>
              <Button type="submit" className="bg-[#E67E22] hover:bg-[#D35400] text-white font-bold rounded-xl px-8 h-12 shadow-lg shadow-black/20 uppercase tracking-widest text-xs">
                {editId ? 'Aggiorna' : 'Imbarca'}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </AppLayout>
  );
};

export default AddExpense;