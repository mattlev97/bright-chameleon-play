import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudget } from '../hooks/use-budget';
import AppLayout from '../components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Sparkles } from 'lucide-react';

const AddExpense = () => {
  const navigate = useNavigate();
  const { addExpense } = useBudget();
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSpread, setIsSpread] = useState(false);
  const [days, setDays] = useState('30');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description && amount) {
      const spreadDays = isSpread ? parseInt(days) : 1;
      addExpense(description, parseFloat(amount), date, spreadDays);
      navigate('/');
    }
  };

  const dailyQuota = amount && days ? (parseFloat(amount) / (isSpread ? parseInt(days) : 1)).toFixed(2) : '0.00';

  return (
    <AppLayout>
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-xl border border-slate-100 text-slate-600 active:scale-90 transition-transform">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Nuova Spesa</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 border-none shadow-xl shadow-slate-200/50 rounded-3xl space-y-6">
            <div className="space-y-2">
              <Label htmlFor="desc">Descrizione</Label>
              <Input 
                id="desc"
                placeholder="Es. Affitto, Cena, Spesa..." 
                className="h-12 rounded-xl border-slate-200"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Importo Totale</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
                <Input 
                  id="amount"
                  type="number" 
                  step="0.01"
                  placeholder="0.00" 
                  className="pl-8 h-12 rounded-xl border-slate-200"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data spesa</Label>
              <Input 
                id="date"
                type="date" 
                className="h-12 rounded-xl border-slate-200"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="space-y-0.5">
                <Label className="text-base">Spalma su più giorni</Label>
                <p className="text-xs text-slate-400">Dividi il costo nel tempo</p>
              </div>
              <Switch 
                checked={isSpread}
                onCheckedChange={setIsSpread}
              />
            </div>

            {isSpread && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <Label htmlFor="days">Numero di giorni</Label>
                <Input 
                  id="days"
                  type="number" 
                  placeholder="30" 
                  className="h-12 rounded-xl border-slate-200"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  required
                />
              </div>
            )}
          </Card>

          <Card className="p-6 bg-green-600 text-white border-none shadow-lg shadow-green-100 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={20} className="text-green-200" />
              <span className="font-medium text-green-100">Anteprima Quota</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-3xl font-black">€ {dailyQuota}</p>
                <p className="text-xs text-green-200 font-medium uppercase tracking-wider">Al giorno</p>
              </div>
              <Button type="submit" className="bg-white text-green-600 hover:bg-green-50 font-bold rounded-xl px-8 h-12">
                Aggiungi
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </AppLayout>
  );
};

export default AddExpense;