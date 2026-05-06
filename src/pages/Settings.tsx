import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudget } from '../hooks/use-budget';
import AppLayout from '../components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { LogOut, Download, Trash2, Wallet, Info } from 'lucide-react';
import { showSuccess } from '../utils/toast';

const Settings = () => {
  const navigate = useNavigate();
  const { data, setSalary, resetData } = useBudget();

  const handleExport = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `budget_data_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showSuccess("Dati esportati con successo!");
  };

  const handleReset = () => {
    if (confirm("Sei sicuro di voler azzerare tutti i dati? Questa azione non è reversibile.")) {
      resetData();
      navigate('/');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 pt-4">
        <h1 className="text-2xl font-bold text-slate-800 px-2">Impostazioni</h1>

        <Card className="p-6 border-none shadow-xl shadow-slate-200/50 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 text-green-600">
            <Wallet size={20} />
            <h2 className="font-bold">Stipendio Corrente</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Importo Mensile</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
                <Input 
                  type="number" 
                  defaultValue={data.salary?.amount}
                  className="pl-8 h-12 rounded-xl border-slate-200"
                  onBlur={(e) => {
                    if (e.target.value && data.salary) {
                      setSalary(parseFloat(e.target.value), data.salary.date);
                      showSuccess("Stipendio aggiornato!");
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-2xl flex items-start gap-3">
              <Info size={16} className="text-slate-400 mt-0.5" />
              <p className="text-xs text-slate-500 leading-relaxed">
                Il budget viene ricalcolato automaticamente ogni giorno a mezzanotte dividendo il saldo rimanente per i giorni che mancano al prossimo stipendio.
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full h-14 rounded-2xl border-slate-200 text-slate-600 font-bold justify-start gap-3 px-6"
            onClick={handleExport}
          >
            <Download size={20} className="text-blue-500" />
            Esporta Dati (JSON)
          </Button>

          <Button 
            variant="outline" 
            className="w-full h-14 rounded-2xl border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold justify-start gap-3 px-6"
            onClick={handleReset}
          >
            <Trash2 size={20} />
            Azzera tutto
          </Button>
        </div>

        <div className="text-center pt-8">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Daily Budget PWA v1.0</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;