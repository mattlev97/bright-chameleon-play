import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudget } from '../hooks/use-budget';
import AppLayout from '../components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Download, Trash2, FileText, History, Target, Repeat, Bell } from 'lucide-react';
import { showSuccess } from '../utils/toast';
import { format, parseISO } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Settings = () => {
  const navigate = useNavigate();
  const { data, resetData, updateSettings, deleteExpense } = useBudget();
  const [showHistory, setShowHistory] = useState(false);

  const handleExportCSV = () => {
    const headers = ['Data', 'Descrizione', 'Categoria', 'Importo Totale', 'Quota Giornaliera', 'Giorni Spalma', 'Ricorrente'];
    const rows = data.expenses.map(e => [e.startDate, e.description, e.category, e.totalAmount, e.dailyQuota.toFixed(2), e.spreadDays, e.recurring ? 'Sì' : 'No']);
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `budget-${format(new Date(), 'MM-yyyy')}.csv`);
    link.click();
    showSuccess("CSV esportato!");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF() as any;
    doc.setFontSize(20);
    doc.setTextColor(108, 99, 255);
    doc.text('DailyBudget Report', 14, 22);
    const totalSpent = data.expenses.reduce((acc, e) => acc + e.totalAmount, 0);
    doc.autoTable({
      startY: 40,
      head: [['Voce', 'Valore']],
      body: [['Stipendio', `EUR ${data.salary?.amount || 0}`], ['Totale Speso', `EUR ${totalSpent.toFixed(2)}`], ['Saldo Rimanente', `EUR ${(data.salary?.amount || 0) - totalSpent}`]],
      theme: 'striped',
      headStyles: { fillColor: [108, 99, 255] }
    });
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Data', 'Descrizione', 'Cat', 'Importo']],
      body: data.expenses.map(e => [e.startDate, e.description, e.category, `EUR ${e.totalAmount}`]),
      headStyles: { fillColor: [108, 99, 255] }
    });
    doc.save(`budget-${format(new Date(), 'MM-yyyy')}.pdf`);
    showSuccess("PDF esportato!");
  };

  return (
    <AppLayout>
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between px-2">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Impostazioni</h1>
          <button onClick={() => setShowHistory(!showHistory)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-[#6C63FF]"><History size={20} /></button>
        </div>

        {!showHistory ? (
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
                      value={data.settings.savingsGoal === null ? '' : data.settings.savingsGoal}
                      placeholder="Inserisci cifra..."
                      className="pl-8 h-12 rounded-xl border-slate-200 dark:border-slate-800"
                      onChange={(e) => updateSettings({ savingsGoal: e.target.value === '' ? null : parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-none shadow-sm bg-white dark:bg-[#1A1830] rounded-3xl space-y-6">
              <div className="flex items-center gap-3 text-[#6C63FF]"><Repeat size={20} /><h2 className="font-bold">Spese Ricorrenti</h2></div>
              <div className="space-y-3">
                {data.expenses.filter(e => e.recurring).length === 0 ? <p className="text-xs text-slate-400 italic">Nessuna spesa ricorrente attiva</p> : data.expenses.filter(e => e.recurring).map(e => (
                  <div key={e.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                    <div><p className="text-sm font-bold">{e.description}</p><p className="text-[10px] text-slate-400">€ {e.totalAmount} / mese</p></div>
                    <button onClick={() => deleteExpense(e.id)} className="text-red-400 p-1"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 border-none shadow-sm bg-white dark:bg-[#1A1830] rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[#6C63FF]"><Bell size={20} /><h2 className="font-bold">Notifiche</h2></div>
                <Switch checked={data.settings.notificationsEnabled} onCheckedChange={(val) => updateSettings({ notificationsEnabled: val })} />
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 font-bold gap-2" onClick={handleExportCSV}><FileText size={18} className="text-blue-500" />CSV</Button>
              <Button variant="outline" className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 font-bold gap-2" onClick={handleExportPDF}><Download size={18} className="text-red-500" />PDF</Button>
            </div>

            <Button variant="outline" className="w-full h-14 rounded-2xl border-red-100 text-red-500 font-bold justify-start gap-3 px-6" onClick={() => { if (confirm("Azzera tutto?")) { resetData(); navigate('/'); } }}><Trash2 size={20} />Azzera tutti i dati</Button>
          </>
        ) : (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <button onClick={() => setShowHistory(false)} className="text-sm font-bold text-[#6C63FF]">← Torna indietro</button>
            {data.history.length === 0 ? <div className="text-center py-12 text-slate-400 text-sm italic">Nessuno storico disponibile</div> : data.history.map((h, i) => (
              <Card key={i} className="p-5 bg-white dark:bg-[#1A1830] border-none shadow-sm rounded-2xl">
                <div className="flex justify-between items-center mb-3"><h3 className="font-bold text-lg">{format(parseISO(h.month + '-01'), 'MMMM yyyy')}</h3><Badge className={h.saved >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}>{h.saved >= 0 ? '+' : ''}{h.saved.toFixed(0)} €</Badge></div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Settings;