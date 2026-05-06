import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Plus, Settings as SettingsIcon, PieChart, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background pb-24 max-w-md mx-auto border-x border-slate-200/50 dark:border-slate-800/50 shadow-sm relative">
      <main className="p-5 animate-in fade-in duration-500">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 dark:bg-[#1A1830]/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 px-2 py-4 flex justify-around items-center z-50">
        <NavLink 
          to="/" 
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-all duration-300 flex-1",
            isActive ? "text-[#6C63FF]" : "text-[#9CA3AF] hover:text-slate-600"
          )}
        >
          {({ isActive }) => (
            <>
              <Home size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Home</span>
            </>
          )}
        </NavLink>

        <NavLink 
          to="/summary" 
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-all duration-300 flex-1",
            isActive ? "text-[#6C63FF]" : "text-[#9CA3AF] hover:text-slate-600"
          )}
        >
          {({ isActive }) => (
            <>
              <PieChart size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Analisi</span>
            </>
          )}
        </NavLink>

        <div className="flex-1 flex justify-center">
          <NavLink 
            to="/add" 
            className="flex items-center justify-center -mt-14 w-14 h-14 rounded-full text-white shadow-xl transition-all duration-300 active:scale-90 bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] shadow-[#6C63FF]/40"
          >
            <Plus size={32} strokeWidth={2.5} />
          </NavLink>
        </div>

        <NavLink 
          to="/trophies" 
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-all duration-300 flex-1",
            isActive ? "text-[#6C63FF]" : "text-[#9CA3AF] hover:text-slate-600"
          )}
        >
          {({ isActive }) => (
            <>
              <Trophy size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Trofei</span>
            </>
          )}
        </NavLink>

        <NavLink 
          to="/settings" 
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-all duration-300 flex-1",
            isActive ? "text-[#6C63FF]" : "text-[#9CA3AF] hover:text-slate-600"
          )}
        >
          {({ isActive }) => (
            <>
              <SettingsIcon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Menu</span>
            </>
          )}
        </NavLink>
      </nav>
    </div>
  );
};

export default AppLayout;