import { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, Check } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'default', label: 'Tövsiyə edilən' },
  { value: 'newest', label: 'Ən yenilər' },
  { value: 'oldest', label: 'Ən köhnələr' },
  { value: 'a-z', label: 'A-Z' },
  { value: 'z-a', label: 'Z-A' },
];

export default function SortFilter({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative isolate" ref={dropdownRef}>
      
      {/* BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 border backdrop-blur-xl overflow-hidden shadow-sm dark:shadow-none ${
          isOpen 
            ? 'bg-lime-100 dark:bg-lime-400/10 border-lime-200 dark:border-lime-400/30 text-lime-700 dark:text-lime-400 shadow-[0_0_30px_rgba(163,230,53,0.25)] ring-1 ring-lime-200 dark:ring-lime-400/30 scale-[1.05]' 
            : 'bg-white dark:bg-white/[0.03] border-black/10 dark:border-white/[0.08] lg:dark:border-white/[0.05] text-slate-500 dark:text-white/40 hover:bg-slate-50 dark:hover:bg-white/[0.06] hover:text-slate-800 dark:hover:text-white/80 hover:border-black/20 dark:hover:border-white/[0.15] ring-1 ring-inset ring-black/5 dark:ring-white/5 hover:ring-black/10 dark:hover:ring-white/10'
        }`}
        title="Sıralama (Sort Filter)"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_center,rgba(163,230,53,0.15),transparent_70%)]" />

        {/* Icon */}
        <SlidersHorizontal 
          className={`w-5 h-5 relative z-10 transition-all duration-300 ${
            isOpen ? 'rotate-180 scale-110' : 'group-hover:scale-110'
          }`} 
        />
      </button>

      {/* DROPDOWN */}
      {isOpen && (
        <div className="absolute top-[calc(100%+10px)] right-0 sm:left-0 sm:right-auto lg:right-0 lg:left-auto w-60 
          backdrop-blur-2xl bg-white/95 dark:bg-white/[0.04] border border-black/10 dark:border-white/[0.08] rounded-2xl p-2 
          shadow-xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.8)] 
          animate-[fadeIn_0.25s_ease] 
          z-50 ring-1 ring-inset ring-black/5 dark:ring-white/10 origin-top-right overflow-hidden"
        >

          {/* Background */}
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,rgba(163,230,53,0.08),transparent_60%)] pointer-events-none" />

          {/* HEADER */}
          <div className="relative px-3 pb-2 pt-1 mb-2 border-b border-black/5 dark:border-white/[0.05]">
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-slate-400 dark:text-white/30">
              <SlidersHorizontal className="w-3 h-3" /> Sıralama Seçimləri
            </p>
          </div>
          
          {/* OPTIONS */}
          <div className="relative space-y-1">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  value === opt.value
                    ? 'bg-lime-50 dark:bg-lime-400/10 text-lime-700 dark:text-lime-400 shadow-sm dark:shadow-[0_0_15px_rgba(163,230,53,0.15)] ring-1 ring-lime-200 dark:ring-transparent'
                    : 'text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 rounded-xl bg-[radial-gradient(circle_at_left,rgba(163,230,53,0.12),transparent_70%)]" />

                <span className="relative z-10">{opt.label}</span>

                {value === opt.value ? (
                  <Check className="w-4 h-4 text-lime-400 relative z-10" />
                ) : (
                  <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(8px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>

    </div>
  );
}