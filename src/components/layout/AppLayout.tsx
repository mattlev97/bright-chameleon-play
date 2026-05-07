import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Plus, Settings as SettingsIcon, PieChart, Trophy, Anchor } from 'lucide-react';
import { cn } from '@/lib/utils';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background pb-24 max-w-md mx-auto border-x border-slate-200/50 dark:border-slate-800/50 shadow-sm relative">
      <main className="p-5 animate-in fade-in duration-500">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 dark:bg-[#122326]/95 backdrop-blur-xl border-t-2 border-[#3E7B85]/10 px-2 py-4 flex justify-around items-center z-50">
        <NavLink 
          to="/" 
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-all duration-300 flex-1",
            isActive ? "text-[#3E7B85]" : "text-slate-400 hover:text-[#3E7B85]"
          )}
        >
          {({ isActive }) => (
            <>
              <Anchor size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Porto</span>
            </>
          )}
        </NavLink>

        <NavLink 
          to="/summary" 
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-all duration-300 flex-1",
            isActive ? "text-[#3E7B85]" : "text-slate-400 hover:text-[#3E7B85]"
          )}
        >
          {({ isActive }) => (
            <>
              <PieChart size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Mappa</span>
            </>
          )}
        </NavLink>

        <div className="flex-1 flex justify-center">
          <NavLink 
            to="/add" 
            className="flex items-center justify-center -mt-14 w-14 h-14 rounded-2xl text-white shadow-2xl transition-all duration-300 active:scale-90 bg-[#E67E22] shadow-[#E67E22]/40 border-4 border-white dark:border-[#122326]"
          >
            <Plus size={32} strokeWidth={3} />
          </NavLink>
        </div>

        <NavLink 
          to="/trophies" 
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-all duration-300 flex-1",
            isActive ? "text-[#3E7B85]" : "text-slate-400 hover:text-[#3E7B85]"
          )}
        >
          {({ isActive }) => (
            <>
              <Trophy size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Tesori</span>
            </>
          )}
        </NavLink>

        <NavLink 
          to="/settings" 
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-all duration-300 flex-1",
            isActive ? "text-[#3E7B85]" : "text-slate-400 hover:text-[#3E7B85]"
          )}
        >
          {({ isActive }) => (
            <>
              <SettingsIcon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Log</span>
            </>
          )}
        </NavLink>
      </nav>
    </div>
  );
};

export default AppLayout;