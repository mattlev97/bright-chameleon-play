import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudget } from '../hooks/use-budget';
import AppLayout from '../components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { LogOut, Download, Trash2, Wallet, Info, PieChart } from 'lucide-react';
import { showSuccess } from '../utils/toast';
import { useBudgetContext } from '../context/BudgetContext';

const Settings = () => {
  const navigate = useNavigate();
  const { data, setSalary, resetData, updateSettings } = useBudget();
  const { getHistory } = useBudgetContext();
  const [exportModalOpen, setExportModalOpen] = React.useState(false);
  const [exportType, setExportType] = React.useState<'csv' | 'pdf'>('csv');
  const [savingsGoal, setSavingsGoal] = React.useState<number>(0);
  const [notificationEnabled, setNotificationEnabled] = React.useState<boolean>(false);
  const [recurringExpenses, setRecurringExpenses] = React.useState<Expense[]>([]);

  // Load recurring expenses on mount
  React.useEffect(() => {
    const allExpenses = data.expenses.filter(e => e.recurring);
    setRecurringExpenses(allExpenses);
  }, [data.expenses]);

  const handleExport = () => {
    if (exportType === 'csv') {
      exportCSV();
    } else {
      exportPDF();
    }
  };

  const exportCSV = () => {
    const csvRows = [
      ['Data', 'Descrizione', 'Categoria', 'Importo totale', 'Quota giornaliera', 'Giorni spalma', 'Ricorrente'],
      ...data.expenses.map(exp => [
        exp.startDate,
        exp.description,
        exp.category,
        exp.totalAmount,
        exp.dailyQuota,
        exp.spreadDays,
        exp.recurring ? 'true' : 'false',
      ]),
    ];
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const month = data.salary?.date?.slice(0, 7) || new Date().toISOString().slice(0, 7);
    link.href = url;
    link.download = `budget-${month}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showSuccess('CSV esportato con successo!');
  };

  const exportPDF = async () => {
    // Lazy load jsPDF
    const { jsPDF } = await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    const doc = new jsPDF();
    
    const month = data.salary?.date?.slice(0, 7) || new Date().toISOString().slice(0, 7);
    doc.setFont('Inter', 'bold');
    doc.text(`Daily Budget - ${month}`, 16, 20);
    
    // Summary box
    const totalSpent = data.expenses.reduce((sum, exp) => sum + exp.totalAmount, 0);
    const remaining = data.salary?.amount ? data.salary.amount - totalSpent : 0;
    doc.setFont('Inter', 'normal');
    doc.text(`Stipendio: € ${data.salary?.amount || 0}`, 16, 35);
    doc.text(`Totale speso: € ${totalSpent.toFixed(2)}`, 16, 42);
    doc.text(`Saldo rimanente: € ${remaining.toFixed(2)}`, 16, 49);
    doc.text(`Budget medio giornaliero: € ${data.stats?.dailyBudget?.toFixed(2) || 0}`, 16, 56);
    
    // Table header
    const startY = 70;
    doc.setFont('Inter', 'bold');
    doc.text('Data', 16, startY);
    doc.text('Descrizione', 40, startY);
    doc.text('Categoria', 80, startY);
    doc.text('Importo', 140, startY);
    doc.text('Quota', 180, startY);
    
    // Table rows
    let y = startY + 10;
    doc.setFont('Inter', 'normal');
    data.expenses.slice(0, 10).forEach(exp => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(exp.startDate, 16, y);
      doc.text(exp.description, 40, y);
      doc.text(exp.category, 80, y);
      doc.text(exp.totalAmount.toFixed(2), 140, y);
      y += 8;
    });
    
    doc.text(`Esportato il: ${new Date().toLocaleDateString()}`, 16, doc.internalPageHeight - 20);
    doc.save(`budget-${month}.pdf`);
    showSuccess('PDF esportato con successo!');
  };

  const handleReset = () => {
    if (confirm("Sei sicuro di voler azzerare tutti i dati? Questa azione non è reversibile.")) {
      resetData();
      navigate('/');
    }
  };

  const handleSaveGoal = () => {
    if (savingsGoal > 0 && data.salary) {
      const available = data.salary.amount - savingsGoal;
      if (available >= 0) {
        setSalary(available, data.salary.date);
        showSuccess('Obiettivo di risparmio impostato!');
      } else {
        alert('L\'obiettivo di risparmio non può superare lo stipendio.');
      }
    }
  };

  const handleDeleteRecurring = (expenseId: string) => {
    const nonRecurring = data.expenses.filter(e => !e.recurring);
    setData(prev => ({ ...prev, expenses: nonRecurring }));
    setRecurringExpenses(prev => prev.filter(e => e.id !== expenseId));
    showSuccess('Spesa ricorrente disattivata');
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);

  const renderRecurringList = () => (
    <div className="space-y-3">
      {recurringExpenses.length === 0 ? (
        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Nessuna spesa ricorrente attiva</p>
      ) : (
        <div className="space-y-2">
          {recurringExpenses.map(exp => (
            <div key={exp.id} className="flex items-start gap-3 bg-[#F4F6FB] dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100/50 dark:border-slate-800/50">
              <div className="flex items-center gap-3 w-12 h-12 rounded-full overflow-hidden">
                <span className="text-8xl">{exp.emoji}</span>
              </div>
              <div>
                <p className="font-medium text-[#1E1B3A] dark:text-[#F1F0FF]">{exp.description}</p>
                <p className="text-[12px] text-[#6B7280] dark:text-[#9CA3AF]">
                  Quota: {formatCurrency(exp.dailyQuota)} / gg                </p>
              </div>
              <Button 
                variant="secondary"
                className="ml-auto text-slate-300 hover:text-red-400 transition-colors"
                onClick={() => handleDeleteRecurring(exp.id)}
              >
                Disattiva
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const handleNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationEnabled(true);
        // Register service worker for notifications
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'REGISTER_NOTIFICATION',
            time: '09:00',
          });
        }
        showSuccess('Notifiche mattutine attive!');
      }
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 pt-2">
        <div className="flex items-center gap-3 px-1">
          <div className="bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] p-2 rounded-xl text-white shadow-lg shadow-[#6C63FF]/20">
            <Wallet size={20} />
          </div>
          <h1 className="text-2xl font-bold text-[#1E1B3A] dark:text-[#F1F0FF] tracking-tight">Impostazioni</h1>
        </div>

        {/* Savings Goal */}
        <Card className="p-6 bg-white dark:bg-[#1A1830] border-none shadow-xl rounded-3xl space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[#6C63FF] text-2xl font-bold">Obiettivo risparmio</span>
            </div>
            <div className="flex items-center gap-3">
              <Input 
                type="number"                 placeholder="0" 
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(parseInt(e.target.value))}
                className="pl-8 h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-transparent focus:border-[#6C63FF] focus:ring-0 transition-all font-bold w-64"
              />
              <span className="text-[#6C63FF] text-sm">€ da risparmiare questo mese</span>
            </div>
            <Button 
              className="flex-1 h-12 bg-gradient-to-r from-[#6C63FF] to-[#A78BFA] text-white rounded-xl font-bold shadow-lg shadow-[#6C63FF]/20 hover:opacity-90"
              onClick={handleSaveGoal}
            >
              Salva
            </Button>
          </div>
        </Card>

        {/* Morning Notification Toggle */}
        <Card className="p-6 bg-white dark:bg-[#1A1830] border-none shadow-xl rounded-3xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[#6C63FF] text-2xl font-bold">Notifica mattutina</span>
          </div>
          <div className="flex items-center gap-3">
            <Switch 
              checked={notificationEnabled}
              onCheckedChange={setNotificationEnabled}
              className="data-[state=checked]:bg-[#6C63FF]"
            />
            <span className="text-sm text-[#1E1B3A] dark:text-[#F1F0FF]">
              Ricevi il tuo budget ogni giorno alle 09:00
            </span>
          </div>
          {notificationEnabled && (
            <Button 
              variant="outline" 
              className="w-full h-12 rounded-xl bg-[#F3F4F6] dark:bg-slate-800 text-[#374151] dark:text-slate-300 font-bold border-none hover:bg-slate-200 dark:hover:bg-slate-700"
              onClick={handleNotificationPermission}
            >
              Attiva notifica
            </Button>
          )}
        </Card>

        {/* Recurring Expenses */}
        <Card className="p-6 bg-white dark:bg-[#1A1830] border-none shadow-xl rounded-3xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[#6C63FF] text-2xl font-bold">Spese ricorrenti</span>
          </div>
          {renderRecurringList()}
        </Card>

        {/* Export Section */}
        <Card className="p-6 bg-white dark:bg-[#1A1830] border-none shadow-xl rounded-3xl space-y-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[#6C63FF] text-2xl font-bold">Esporta dati</span>
            </div>
            <div className="flex items-center gap-3">
              <Select className="relative">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#1E1B3A] dark:text-[#F1F0FF]">Tipo:</span>
                  <select 
                    value={exportType} 
                    onChange={(e) => setExportType(e.target.value as 'csv' | 'pdf')}
                    className="pl-3 h-12 rounded-xl border-[1.5px] border-slate-200 dark:border-slate-800 bg-transparent focus:border-[#6C63FF] focus:ring-0 transition-all font-medium text-[#1E1B3A] dark:text-[#F1F0FF]"
                  >
                    <option value="csv">CSV</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>
              </Select>
              <Button 
                variant="outline" 
                className="w-24 h-12 rounded-xl bg-[#F3F4F6] dark:bg-slate-800 text-[#374151] dark:text-slate-300 font-bold border-none hover:bg-slate-200 dark:hover:bg-slate-700"
                onClick={handleExport}
              >
                Esporta
              </Button>
            </div>
          </div>
        </Card>

        {/* Reset & Logout */}
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full h-14 rounded-2xl border-slate-200 text-slate-600 font-bold justify-start gap-3 px-6"
            onClick={handleReset}
          >
            <Trash2 size={20} />
            Azzera tutto
          </Button>
          <Button 
            variant="secondary" 
            className="w-full h-14 rounded-2xl border-slate-200 text-slate-600 font-bold justify-start gap-3 px-6"
            onClick={() => navigate('/logout')}
          >
            <LogOut size={20} />
            Esci
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;