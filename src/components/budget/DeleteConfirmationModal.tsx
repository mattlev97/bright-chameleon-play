import React from 'react';
import { Button } from '@/components/ui/button';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  expenseName: string;
}

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, expenseName }: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/45 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative bg-white dark:bg-[#1A1830] w-full max-w-xs rounded-[20px] p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200 ease-out">
        <h3 className="text-lg font-bold text-[#1E1B3A] dark:text-[#F1F0FF] mb-2">
          Elimina spesa
        </h3>
        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed mb-6">
          Sei sicuro di voler eliminare <span className="font-bold text-[#1E1B3A] dark:text-[#F1F0FF]">'{expenseName}'</span>? Questa azione non può essere annullata.
        </p>
        
        <div className="flex gap-3">
          <Button 
            variant="secondary"
            className="flex-1 h-12 rounded-xl bg-[#F3F4F6] dark:bg-slate-800 text-[#374151] dark:text-slate-300 font-bold border-none hover:bg-slate-200 dark:hover:bg-slate-700"
            onClick={onClose}
          >
            Annulla
          </Button>
          <Button 
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#A78BFA] text-white font-bold border-none shadow-lg shadow-[#6C63FF]/20 hover:opacity-90"
            onClick={onConfirm}
          >
            Elimina
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;