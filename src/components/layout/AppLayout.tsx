import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 max-w-md mx-auto border-x border-slate-200 shadow-sm relative">
      <main className="p-4 animate-in fade-in duration-500">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/80 backdrop-blur-lg border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50">
        <NavLink 
          to="/" 
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-colors",
            isActive ? "text-green-600" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <Home size={24} />
          <span className="text-[10px] font-medium">Home</span>
        </NavLink>

        <NavLink 
          to="/add" 
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 -mt-8 bg-green-500 p-4 rounded-full text-white shadow-lg shadow-green-200 transition-transform active:scale-95",
            isActive ? "bg-green-600" : ""
          )}
        >
          <PlusCircle size={28} />
        </NavLink>

        <NavLink 
          to="/settings" 
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-colors",
            isActive ? "text-green-600" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <SettingsIcon size={24} />
          <span className="text-[10px] font-medium">Impostazioni</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default AppLayout;