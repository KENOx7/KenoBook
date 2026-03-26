import { useState, useEffect, useRef } from 'react';
import { Shield, KeyRound, AlertCircle, X } from 'lucide-react';

export default function PinPromptModal({ onSubmit, onCancel, actionHint }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('PIN kodu daxil edin');
      return;
    }
    
    const expectedPin = import.meta.env.VITE_SECURITY_PIN || '123456';
    if (pin === expectedPin) {
      onSubmit(pin);
    } else {
      setError('Yanlış PIN kod!');
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white/90 dark:bg-[#121216]/90 border border-black/10 dark:border-white/[0.08] rounded-[24px] w-full max-w-sm shadow-xl dark:shadow-[0_0_60px_rgba(0,0,0,0.5)] animate-slideUp p-8 ring-1 ring-inset ring-black/5 dark:ring-white/5 backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-400/20 dark:bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-slate-500 dark:text-white/30 hover:text-slate-900 dark:hover:text-white/80 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center relative z-10">
          <div className="w-16 h-16 rounded-[20px] bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center mx-auto mb-6 border border-amber-200 dark:border-amber-500/20 shadow-sm dark:shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-2 ring-amber-50 dark:ring-amber-500/10">
            <Shield className="w-8 h-8 text-amber-500" />
          </div>

          <h3 className="text-slate-900 dark:text-white font-bold text-xl mb-2 tracking-tight">Təhlükəsizlik Kodu</h3>
          <p className="text-slate-500 dark:text-white/50 text-sm mb-6 font-medium">
            {actionHint || "Bu əməliyyat üçün PIN kod tələb olunur."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <KeyRound className="w-5 h-5 text-amber-500/50" />
              </div>
              <input
                ref={inputRef}
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                className={`w-full bg-slate-50 dark:bg-[#0a0a0c] border ${error ? 'border-red-500/50' : 'border-black/10 dark:border-white/10'} rounded-xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all font-mono text-lg tracking-[0.2em] text-center`}
                placeholder="••••••"
                maxLength={20}
              />
            </div>

            {error && (
              <div className="flex items-center justify-center gap-2 text-red-400 text-sm font-medium bg-red-400/10 p-3 rounded-xl border border-red-400/20">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full relative group isolate overflow-hidden flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 text-black rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:bg-amber-400"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-[-1]" />
              Təsdiqlə (Giriş)
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
