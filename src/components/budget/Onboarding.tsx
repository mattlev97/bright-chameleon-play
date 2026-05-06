import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

interface OnboardingProps {
  onComplete: (amount: number, date: string) => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && date) {
      onComplete(parseFloat(amount), date);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <Card className="w-full max-w-sm border-none shadow-xl rounded-3xl overflow-hidden">
        <div className="bg-green-500 p-8 flex justify-center">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
            <Wallet className="text-white" size={48} />
          </div>
        </div>
        <CardHeader className="text-center pt-8">
          <CardTitle className="text-2xl font-bold text-slate-800">Benvenuto!</CardTitle>
          <CardDescription className="text-slate-500 px-4">
            Gestisci il tuo budget in modo intelligente. Inserisci il tuo stipendio per iniziare.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Importo Stipendio</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
                <Input 
                  id="amount"
                  type="number" 
                  placeholder="1600" 
                  className="pl-8 h-12 rounded-xl border-slate-200 focus:ring-green-500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data di ricezione</Label>
              <Input 
                id="date"
                type="date" 
                className="h-12 rounded-xl border-slate-200 focus:ring-green-500"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-100 transition-all active:scale-95">
              Inizia ora
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;