import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudget } from '../hooks/use-budget';
import AppLayout from '../components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Download, Trash2, FileText, History, Target, Repeat, Bell, Anchor, Ship } from 'lucide-react';
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
    link.setAttribute('download', `log-bordo-${format(new Date(), 'MM-yyyy')}.csv`);
    link.click();
    showSuccess("Log CSV esportato!");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF() as any;
    doc.setFontSize(20);
    doc.setTextColor(62, 123, 133);
    doc.text('Log di Bordo - DailyBudget', 14, 22);
    const totalSpent = data.expenses.reduce((acc, e) => acc + e.totalAmount, 0);
    doc.autoTable({
      startY: 40,
      head: [['Voce', 'Valore']],
      body: [['Rifornimento', `EUR ${data.salary?.amount || 0}`], ['Totale Carichi', `EUR ${totalSpent.toFixed(2)}`], ['Residuo', `EUR ${(data.salary?.amount || 0) - totalSpent}`]],
      theme: 'striped',
      headStyles: { fillColor: [62, 123, 133] }
    });
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Data', 'Descrizione', 'Cat', 'Importo']],
      body: data.expenses.map(e => [e.startDate, e.description, e.category, `EUR ${e.totalAmount}`]),
      headStyles: { fillColor: [62, 123, 133] }
    });
    doc.save(`log-bordo-${format(new Date(), 'MM-yyyy')}.pdf`);
    showSuccess("Log PDF esportato!");
  };

  return (
    <AppLayout>
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="bg-[#3E7B85] p-2.5 rounded-xl text-white shadow-lg shadow-[#3E7B85]/20">
              <Anchor size={22} />
            </div>
            <h1 className="text-2xl font-bold text-[#1A2A2D] dark:text-[#F4EBD0] tracking-tighter uppercase">Log di Bordo</h1>
          </div>
          <button onClick={() => setShowHistory(!showHistory)} className="p-2 bg-[#3E7B85]/10 rounded-xl text-[#3E7B85] active:scale-90 transition-transform"><History size={20} /></button>
        </div>

        {!showHistory ? (
          <>
            {/* Riserva di Sicurezza */}
            <Card className="p-6 border-none shadow-sm bg-white dark:bg-[#122326] rounded-[28px] space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#E67E22]" />
              <div className="flex items-center gap-3 text-[#E67E22]">
                <Target size={20} />
                <h2 className="font-bold text-sm uppercase tracking-widest">Riserva di Sicurezza</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Quota da accantonare</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
                    <Input 
                      type="number" 
                      value={data.settings.savingsGoal === null ? '' : data.settings.savingsGoal}
                      placeholder="Inserisci cifra..."
                      className="pl-8 h-12 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-transparent font-bold"
                      onChange={(e) => updateSettings({ savingsGoal: e.target.value === '' ? null : parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Carichi Ricorrenti */}
            <Card className="p-6 border-none shadow-sm bg-white dark:bg-[#122326] rounded-[28px] space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#3E7B85]" />
              <div className="flex items-center gap-3 text-[#3E7B85]"><Repeat size={20} /><h2 className="font-bold text-sm uppercase tracking-widest">Carichi Ricorrenti</h2></div>
              <div className="space-y-3">
                {data.expenses.filter(e => e.recurring).length === 0 ? <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Nessun carico fisso</p> : data.expenses.filter(e => e.recurring).map(e => (
                  <div key={e.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div><p className="text-xs font-bold text-[#1A2A2D] dark:text-[#F4EBD0]">{e.description}</p><p className="text-[9px] font-bold text-slate-400 uppercase">€ {e.totalAmount} / mese</p></div>
                    <button onClick={() => deleteExpense(e.id)} className="text-[#8B2635] p-1.5 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Notifiche */}
            <Card className="p-6 border-none shadow-sm bg-white dark:bg-[#122326] rounded-[28px] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[#3E7B85]"><Bell size={20} /><h2 className="font-bold text-sm uppercase tracking-widest">Segnali Radio</h2></div>
                <Switch checked={data.settings.notificationsEnabled} onCheckedChange={(val) => updateSettings({ notificationsEnabled: val })} className="data-[state=checked]:bg-[#3E7B85]" />
              </div>
            </Card>

            {/* Esportazione */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-14 rounded-2xl border-2 border-slate-100 dark:border-slate-800 font-bold gap-2 text-xs uppercase tracking-widest" onClick={handleExportCSV}><FileText size={18} className="text-[#3E7B85]" />CSV</Button>
              <Button variant="outline" className="h-14 rounded-2xl border-2 border-slate-100 dark:border-slate-800 font-bold gap-2 text-xs uppercase tracking-widest" onClick={handleExportPDF}><Download size={18} className="text-[#E67E22]" />PDF</Button>
            </div>

            <Button variant="outline" className="w-full h-14 rounded-2xl border-2 border-[#8B2635]/20 text-[#8B2635] font-bold justify-start gap-3 px-6 uppercase tracking-widest text-xs" onClick={() => { if (confirm("Azzera tutto il log di bordo?")) { resetData(); navigate('/'); } }}><Trash2 size={20} />Azzera tutti i dati</Button>
          </>
        ) : (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <button onClick={() => setShowHistory(false)} className="text-[10px] font-bold text-[#3E7B85] uppercase tracking-[0.2em] flex items-center gap-2">← Torna al Log</button>
            {data.history.length === 0 ? <div className="text-center py-12 text-slate-400 text-xs font-bold uppercase tracking-widest italic">Nessuno storico disponibile</div> : data.history.map((h, i) => (
              <Card key={i} className="p-5 bg-white dark:bg-[#122326] border-none shadow-sm rounded-2xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Ship size={18} className="text-[#3E7B85]" />
                  <h3 className="font-bold text-sm uppercase tracking-tighter">{format(parseISO(h.month + '-01'), 'MMMM yyyy')}</h3>
                </div>
                <Badge className={h.saved >= 0 ? 'bg-green-100 text-green-600 border-none' : 'bg-red-100 text-red-600 border-none'}>{h.saved >= 0 ? '+' : ''}{h.saved.toFixed(0)} €</Badge>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Settings;