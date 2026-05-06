import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudget } from '../hooks/use-budget';
import AppLayout from '../components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  LogOut, Download, Trash2, Wallet, Info, FileText, 
  History, Target, Repeat, ChevronRight, Bell 
} from 'lucide-react';
import { showSuccess } from '../utils/toast';
import { format, parseISO } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Settings = () => {
  const navigate = useNavigate();
  const { data, setSalary, resetData, updateSettings, deleteExpense } = useBudget();
  const [showHistory, setShowHistory] = useState(false);

  const handleExportCSV = () => {
    const headers = ['Data', 'Descrizione', 'Categoria', 'Importo Totale', 'Quota Giornaliera', 'Giorni Spalma', 'Ricorrente'];
    const rows = data.expenses.map(e => [
      e.startDate,
      e.description,
      e.category,
      e.totalAmount,
      e.dailyQuota.toFixed(2),
      e.spreadDays,
      e.recurring ? 'Sì' : 'No'
    ]);

    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = format(new Date(), 'MM-yyyy');
    link.setAttribute('href', url);
    link.setAttribute('download', `budget-${dateStr}.csv`);
    link.click();
    showSuccess("CSV esportato!");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF() as any;
    const dateStr = format(new Date(), 'MMMM yyyy');
    
    doc.setFontSize(20);
    doc.setTextColor(108, 99, 255);
    doc.text('DailyBudget Report', 14, 22);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(dateStr, 14, 30);

    // Riepilogo
    const totalSpent = data.expenses.reduce((acc, e) => acc + e.totalAmount, 0);
    doc.autoTable({
      startY: 40,
      head: [['Voce', 'Valore']],
      body: [
        ['Stipendio', `EUR ${data.salary?.amount || 0}`],
        ['Totale Speso', `EUR ${totalSpent.toFixed(2)}`],
        ['Saldo Rimanente', `EUR ${(data.salary?.amount || 0) - totalSpent}`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [108, 99, 255] }
    });

    // Tabella Spese
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Data', 'Descrizione', 'Cat', 'Importo']],
      body: data.expenses.map(e => [e.startDate, e.description, e.category, `EUR ${e.totalAmount}`]),
      headStyles: { fillColor: [108, 99, 255] }
    });

    doc.save(`budget-${format(new Date(), 'MM-yyyy')}.pdf`);
    showSuccess("PDF esportato!");
  };

  const handleReset = () => {
    if (confirm("Sei sicuro di voler azzerare tutti i dati? Questa azione non è reversibile.")) {
      resetData();
      navigate('/');
    }
  };

  const recurringExpenses = data.expenses.filter(e => e.recurring);

  return (
    <AppLayout>
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between px-2">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Impostazioni</h1>
          <button onClick={() => setShowHistory(!showHistory)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-[#6C63FF]">
            <History size={20} />
          </button>
        </div>

        {showHistory ? (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-2 px-2 mb-2">
              <button onClick={() => setShowHistory(false)} className="text-sm font-bold text-[#6C63FF]">← Torna indietro</button>
            </div>
            {data.history.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm italic">Nessuno storico disponibile</div>
            ) : (
              data.history.map((h, i) => (
                <Card key={i} className="p-5 bg-white dark:bg-[#1A1830] border-none shadow-sm rounded-2xl">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg">{format(parseISO(h.month + '-01'), 'MMMM yyyy')}</h3>
                    <Badge className={h.saved >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}>
                      {h.saved >= 0 ? '+' : ''}{h.saved.toFixed(0)} €
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-500">
                    <div>Stipendio: <span className="text-slate-800 dark:text-slate-200">€ {h.salary}</span></div>
                    <div>Speso: <span className="text-slate-800 dark:text-slate-200">€ {h.totalSpent.toFixed(0)}</span></div>
                  </div>
                </Card>
              ))
            )}
          </div>
        ) : (
          <>
            <Card className="p-6 border-none shadow-sm bg-white dark:bg-[#1A1830] rounded-3xl space-y-6">
              <div className="flex items-center gap-3 text-[#6C63FF]">
                <Target size={20} />
                <h2 className="font-bold">Obiettivo Risparmio</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Voglio risparmiare questo mese</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
                    <Input 
                      type="number" 
                      value={data.settings.savingsGoal}
                      className="pl-8 h-12 rounded-xl border-slate-200 dark:border-slate-800"
                      onChange={(e) => updateSettings({ savingsGoal: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-none shadow-sm bg-white dark:bg-[#1A1830] rounded-3xl space-y-6">
              <div className="flex items-center gap-3 text-[#6C63FF]">
                <Repeat size={20} />
                <h2 className="font-bold">Spese Ricorrenti</h2>
              </div>
              <div className="space-y-3">
                {recurringExpenses.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Nessuna spesa ricorrente attiva</p>
                ) : (
                  recurringExpenses.map(e => (
                    <div key={e.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                      <div>
                        <p className="text-sm font-bold">{e.description}</p>
                        <p className="text-[10px] text-slate-400">€ {e.totalAmount} / mese</p>
                      </div>
                      <button onClick={() => deleteExpense(e.id)} className="text-red-400 p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="p-6 border-none shadow-sm bg-white dark:bg-[#1A1830] rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[#6C63FF]">
                  <Bell size={20} />
                  <h2 className="font-bold">Notifiche</h2>
                </div>
                <Switch 
                  checked={data.settings.notificationsEnabled}
                  onCheckedChange={(val) => updateSettings({ notificationsEnabled: val })}
                />
              </div>
              <p className="text-[11px] text-slate-400">Ricevi un riepilogo del budget ogni mattina alle 09:00.</p>
            </Card>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold gap-2"
                  onClick={handleExportCSV}
                >
                  <FileText size={18} className="text-blue-500" />
                  CSV
                </Button>
                <Button 
                  variant="outline" 
                  className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold gap-2"
                  onClick={handleExportPDF}
                >
                  <Download size={18} className="text-red-500" />
                  PDF
                </Button>
              </div>

              <Button 
                variant="outline" 
                className="w-full h-14 rounded-2xl border-red-100 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold justify-start gap-3 px-6"
                onClick={handleReset}
              >
                <Trash2 size={20} />
                Azzera tutti i dati
              </Button>
            </div>
          </>
        )}

        <div className="text-center pt-8">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Daily Budget Premium v1.0</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;