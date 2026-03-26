import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative group w-full max-w-xl">
      <div className="absolute inset-0 bg-lime-400/10 rounded-2xl blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-white/20 group-focus-within:text-lime-600 dark:group-focus-within:text-lime-400 transition-colors duration-300" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Keçid və ya qeydlərdə axtar..."
          className="w-full bg-white dark:bg-white/[0.03] backdrop-blur-xl border border-black/10 dark:border-white/[0.08] lg:dark:border-white/[0.05] rounded-2xl pl-12 pr-12 py-3.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:border-lime-500/40 focus:ring-4 focus:ring-lime-500/10 transition-all duration-300 ring-1 ring-inset ring-black/5 dark:ring-white/5 shadow-sm dark:shadow-2xl"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-slate-500 dark:text-white/40 hover:bg-black/10 dark:hover:bg-white/15 hover:text-slate-800 dark:hover:text-white transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
