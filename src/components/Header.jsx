import { ExternalLink, Plus, Sun, Moon } from 'lucide-react';

export default function Header({ linkCount, onAddClick, theme, toggleTheme }) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 sm:mb-12">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-3 sm:gap-4">
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-lime-400/40 blur-xl rounded-full" />
            <span className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-lime-500 flex items-center justify-center shadow-[0_0_30px_rgba(163,230,53,0.3)] ring-1 ring-black/5 dark:ring-white/20 overflow-hidden">
               <img src="https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUydnA1a3lzczhhb204NHJza2V6bmltdzNsc2R6d2ZlbmgzMzdlcW5wbiZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/l0FRolhJdFrBxpi2hg/200w.gif" alt="Logo" className="w-full h-full object-cover opacity-90 scale-125" />
            </span>
          </div>
          <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-white/90 dark:to-white/60 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">
            KenoBook
          </span>
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 sm:mt-3 sm:ml-[64px]">
          <p className="text-slate-500 dark:text-white/40 text-xs font-medium tracking-wide">
            {linkCount} {linkCount === 1 ? 'element' : 'element'} saxlanılıb
          </p>

          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-slate-300 dark:bg-white/10 hidden sm:block" />

          <a
            href="https://supabase.com/dashboard/org/wbjaggbwemnseozyrxph"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-white/30 hover:text-lime-600 dark:hover:text-lime-400 transition-colors duration-300"
          >
            Supabase Dashboard
            <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <button
          onClick={toggleTheme}
          className="group relative flex items-center justify-center w-12 h-12 bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 shadow-sm dark:shadow-xl ring-1 ring-inset ring-slate-200 dark:ring-white/5"
          title={theme === 'dark' ? 'Gündüz rejimi' : 'Gecə rejimi'}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform duration-500" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600 group-hover:-rotate-12 transition-transform duration-500" />
          )}
        </button>

        <button
          onClick={onAddClick}
          className="group relative flex items-center justify-center gap-2.5 flex-1 md:flex-none px-6 py-3.5 bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-2xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 shadow-sm dark:shadow-xl overflow-hidden ring-1 ring-inset ring-slate-200 dark:ring-white/5 hover:ring-lime-500/50 dark:hover:ring-lime-400/50 hover:shadow-[0_0_30px_rgba(163,230,53,0.1)] dark:hover:shadow-[0_0_40px_rgba(163,230,53,0.2)] hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-lime-500/0 via-lime-500/10 to-lime-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
          <Plus className="w-5 h-5 text-lime-600 dark:text-lime-400 transition-transform duration-300 group-hover:rotate-90 group-hover:drop-shadow-[0_0_8px_rgba(163,230,53,0.4)] dark:group-hover:drop-shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
          <span className="relative z-10 transition-colors group-hover:text-slate-900 dark:group-hover:text-lime-50">Əlavə Et</span>
        </button>
      </div>
    </header>
  );
}
