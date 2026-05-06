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
import { differenceInDays, endOfMonth, parseISO } from 'date-fns';

const CATEGORIES: { id: CategoryId; label: string; icon: string; color: string }[] = [
  { id: 'casa', label: 'Casa', icon: '🏠', color: '#4F6F52' },
  { id: 'cibo', label: 'Cibo', icon: '🍕', color: '#AD8B73' },
  { id: 'trasporti', label: 'Trasporti', icon: '🚗', color: '#86A789' },
  { id: 'svago', label: 'Svago', icon: '🎬', color: '#E2C2B9' },
  { id: 'salute', label: 'Salute', icon: '🏥', color: '#4F6F52' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#AD8B73' },
  { id: 'altro', label: 'Altro', icon: '💰', color: '#6B7353' },
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
        updateExpense(editId, { description, totalAmount: parseFloat(amount), startDate: date, spreadDays, category, recurring });
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
          <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-[#1A2A22] rounded-xl border border-slate-100 dark:border-slate-800 text-slate-600 active:scale-90 transition-transform shadow-sm"><ArrowLeft size={20} /></button>
          <h1 className="text-lg font-bold text-[#12372A]">{editId ? 'Modifica spesa' : 'Nuova spesa'}</h1>
          <div className="w-10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 bg-white dark:bg-[#1A2A22] border-none shadow-sm rounded-[32px] space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#4F6F52]">Categoria</Label>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} type="button" onClick={() => setCategory(cat.id)} className={`flex flex-col items-center gap-1 min-w-[64px] p-2 rounded-2xl border-2 transition-all ${category === cat.id ? 'border-[#4F6F52] bg-[#FBFADA]' : 'border-transparent bg-slate-50'}`}>
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-[10px] font-bold">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#4F6F52]">Descrizione</Label>
              <Input placeholder="Es. Cena, Spesa..." className="h-14 rounded-2xl border-2 border-slate-100 bg-transparent focus:border-[#4F6F52] transition-all" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#4F6F52]">Importo Totale</Label>
              <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#12372A] font-bold">€</span><Input type="number" step="0.01" placeholder="0.00" className="pl-10 h-14 rounded-2xl border-2 border-slate-100 bg-transparent focus:border-[#4F6F52] transition-all font-bold" value={amount} onChange={(e) => setAmount(e.target.value)} required /></div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#FBFADA]/50 rounded-2xl">
                <div className="space-y-0.5"><Label className="text-sm font-bold text-[#12372A]">Spalma su più giorni</Label><p className="text-[10px] text-[#4F6F52]">Dividi il costo nel tempo</p></div>
                <Switch checked={isSpread} onCheckedChange={setIsSpread} className="data-[state=checked]:bg-[#4F6F52]" />
              </div>
              {isSpread && <Input type="number" placeholder="Giorni" className="h-14 rounded-2xl border-2 border-slate-100" value={days} onChange={(e) => setDays(e.target.value)} required />}
              <div className="flex items-center justify-between p-4 bg-[#FBFADA]/50 rounded-2xl">
                <div className="space-y-0.5"><div className="flex items-center gap-2"><Repeat size={14} className="text-[#4F6F52]" /><Label className="text-sm font-bold text-[#12372A]">Spesa ricorrente</Label></div><p className="text-[10px] text-[#4F6F52]">Si ripete ogni mese</p></div>
                <Switch checked={recurring} onCheckedChange={setRecurring} className="data-[state=checked]:bg-[#4F6F52]" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-[#4F6F52] border-none rounded-[32px] text-white">
            <div className="flex items-center gap-3 mb-4"><Sparkles size={18} /><span className="font-bold text-sm">Impatto Giornaliero</span></div>
            <div className="flex justify-between items-end">
              <div><p className="text-3xl font-bold">€ {dailyQuota}</p><p className="text-[10px] opacity-70 font-bold uppercase tracking-widest">Al giorno</p></div>
              <Button type="submit" className="bg-[#FBFADA] text-[#4F6F52] hover:bg-white font-bold rounded-2xl px-8 h-12 shadow-xl">Salva</Button>
            </div>
          </Card>
        </form>
      </div>
    </AppLayout>
  );
};

export default AddExpense;