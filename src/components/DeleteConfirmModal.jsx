import { Trash2, AlertTriangle } from 'lucide-react';

export default function DeleteConfirmModal({ link, onConfirm, onCancel }) {
  const isNote = link?.category === 'Text' || !link?.url;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white/90 dark:bg-[#0f0f13]/80 border border-black/10 dark:border-white/[0.08] rounded-[24px] w-full max-w-sm shadow-xl dark:shadow-[0_0_60px_rgba(0,0,0,0.5)] animate-slideUp p-8 ring-1 ring-inset ring-black/5 dark:ring-white/5 backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-400/20 dark:bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="text-center relative z-10">
          <div className="w-16 h-16 rounded-[20px] bg-red-100 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-6 border border-red-200 dark:border-red-500/20 shadow-sm dark:shadow-[0_0_20px_rgba(239,68,68,0.15)] ring-2 ring-red-50 dark:ring-red-500/10">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>

          <h3 className="text-slate-900 dark:text-white font-bold text-xl mb-2 tracking-tight">Silinməni Təsdiqləyin</h3>
          <p className="text-slate-500 dark:text-white/50 text-sm mb-2 font-medium">Bu {isNote ? 'qeydi' : 'keçidi'} silmək istədiyinizdən əminsiniz?</p>
          
          <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl p-3 mb-8">
            <p className="text-slate-800 dark:text-white/80 font-bold text-sm truncate">
              &ldquo;{link?.title}&rdquo;
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3.5 bg-black/[0.03] dark:bg-white/[0.03] text-slate-600 dark:text-white/50 rounded-xl hover:bg-black/[0.08] dark:hover:bg-white/[0.08] hover:text-slate-900 dark:hover:text-white/80 transition-all font-bold text-sm border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
            >
              Ləğv Et
            </button>
            <button
              onClick={() => onConfirm(link.id)}
              className="group flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-500/20 transition-all font-bold text-sm border border-red-200 dark:border-red-500/20 hover:border-red-300 dark:hover:border-red-500/40 hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
            >
              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
