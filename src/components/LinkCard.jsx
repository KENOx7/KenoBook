import { useState } from 'react';
import { ExternalLink, Copy, Edit2, Trash2, CheckCircle2, Type, Hash, Star } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const CATEGORY_COLORS = {
  'GitHub': 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20',
  'AI': 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20',
  'Video': 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
  'Mətn (Qeyd)': 'bg-lime-500/10 text-lime-700 dark:text-lime-400 border-lime-500/20',
  'Digər': 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20',
  GitHub: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20',
  AI: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20',
  Video: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
  Text: 'bg-lime-500/10 text-lime-700 dark:text-lime-400 border-lime-500/20',
};

function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20';
}

function getDomain(url) {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

function getYoutubeVideoId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function getVimeoVideoId(url) {
  if (!url) return null;
  const regExp = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export default function LinkCard({
  link,
  onEdit,
  onDelete,
  onToggleFavorite,
}) {
  const [copied, setCopied] = useState(false);
  
  const isNote = link.category === 'Mətn (Qeyd)' || link.category === 'Text' || !link.url;
  
  const youtubeId = !isNote ? getYoutubeVideoId(link.url) : null;
  const vimeoId = !isNote && !youtubeId ? getVimeoVideoId(link.url) : null;

  const handleCopy = async () => {
    try {
      const textToCopy = isNote ? `${link.title}\n\n${link.description}` : link.url;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
    }
  };

  return (
    <div className={`group relative isolate [transform:translateZ(0)] border border-black/5 dark:border-white/[0.08] rounded-[24px] p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] ring-1 ring-inset ${
      isNote 
        ? 'bg-[#f7fee7] dark:bg-[#0d120a] hover:border-lime-500/30 ring-lime-500/10 hover:ring-lime-500/30 hover:shadow-[0_0_30px_rgba(163,230,53,0.15)]' 
        : 'bg-white dark:bg-[#0f0f13] hover:border-black/10 dark:hover:border-white/15 ring-black/5 dark:ring-white/5 hover:ring-black/10 dark:hover:ring-white/15'
    }`}>
      
      <div className="flex items-center justify-between mb-4">
        <span
          className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${getCategoryColor(
            link.category
          )}`}
        >
          {isNote ? <Type className="w-3 h-3" /> : <Hash className="w-3 h-3" />}
          {link.category || 'Təsnif edilməmiş'}
        </span>
        
        <button
          onClick={() => onToggleFavorite(link.id, !link.is_favorite)}
          className="text-slate-400 dark:text-white/20 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-400/10 p-2 rounded-xl transition-all duration-300 group/star"
          title={link.is_favorite ? 'Sevimlilərdən çıxar' : 'Sevimlilərə əlavə et'}
        >
          <Star 
            className={`w-4.5 h-4.5 transition-transform duration-500 ${
              link.is_favorite 
                ? 'fill-amber-400 text-amber-500 dark:text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)] dark:drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]' 
                : 'group-hover/star:scale-110'
            }`} 
          />
        </button>
      </div>

      {/* Title */}
      <h3 className={`font-black text-lg mb-2 leading-tight line-clamp-2 transition-colors duration-300 ${
        isNote ? 'text-lime-800 dark:text-lime-50 group-hover:text-lime-600 dark:group-hover:text-lime-300' : 'text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-white/90'
      }`}>
        {link.title}
      </h3>

      {/* Domain */}
      {!isNote && (
        <p className="flex items-center gap-2 text-slate-500 dark:text-white/30 text-[11px] font-bold tracking-wider mb-3 uppercase truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-lime-500/50 dark:bg-lime-400/50 shadow-[0_0_8px_rgba(163,230,53,0.5)]" />
          {getDomain(link.url)}
        </p>
      )}

      {/* Video */}
      {youtubeId && (
        <div className="w-full aspect-video mt-2 mb-4 rounded-xl overflow-hidden border border-black/5 dark:border-white/5 ring-1 ring-black/5 dark:ring-white/10 shadow-md dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:border-lime-500/30 transition-colors duration-500">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; compute-pressure"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      )}

      {vimeoId && (
        <div className="w-full aspect-video mt-2 mb-4 rounded-xl overflow-hidden border border-black/5 dark:border-white/5 ring-1 ring-black/5 dark:ring-white/10 shadow-md dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:border-lime-500/30 transition-colors duration-500">
          <iframe
            width="100%"
            height="100%"
            src={`https://player.vimeo.com/video/${vimeoId}`}
            title="Vimeo video player"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      )}



      {/* Description */}
      {link.description && (
        <div className={`mt-3 mb-5 pl-3 border-l-2 ${isNote ? 'border-lime-500/30' : 'border-black/10 dark:border-white/10'}`}>
          <div className={`text-[13px] leading-relaxed ${
            isNote ? 'text-lime-800 dark:text-lime-100/70' : 'text-slate-600 dark:text-white/40 line-clamp-4'
          }`}>
            {isNote ? (
              <div className="prose-custom overflow-hidden max-h-[300px] hover:overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-lime-500/20 [&::-webkit-scrollbar-track]:bg-transparent pr-1 relative">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({node, ...props}) => <p className="mb-2.5 last:mb-0" {...props} />,
                  a: ({node, ...props}) => <a className="text-lime-400 hover:text-lime-300 underline underline-offset-2 break-all font-bold" target="_blank" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-outside ml-4 mb-2.5 space-y-1" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-4 mb-2.5 space-y-1" {...props} />,
                  li: ({node, ...props}) => <li className="" {...props} />,
                  code: ({node, className, children, ...props}) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      <pre className="bg-slate-100 dark:bg-[#07070a] p-3 rounded-xl overflow-x-auto text-[11.5px] my-3 border border-black/5 dark:border-white/5 font-mono leading-relaxed">
                        <code className="text-lime-700 dark:text-lime-200" {...props}>{children}</code>
                      </pre>
                    ) : (
                      <code className="bg-lime-500/10 text-lime-700 dark:text-lime-300 px-1.5 py-0.5 rounded text-[11.5px] font-mono border border-lime-500/20" {...props}>{children}</code>
                    );
                  },
                  strong: ({node, ...props}) => <strong className="font-bold text-lime-600 dark:text-lime-400" {...props} />,
                  h1: ({node, ...props}) => <h1 className="text-lg font-black text-lime-700 dark:text-lime-300 mb-3 mt-5" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-base font-bold text-lime-700 dark:text-lime-300 mb-2.5 mt-4" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-sm font-bold text-lime-700 dark:text-lime-300 mb-2 mt-3" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-lime-500/40 pl-3.5 py-0.5 my-3 italic text-lime-700/60 dark:text-lime-200/50 font-medium" {...props} />
                }}
              >
                {link.description}
              </ReactMarkdown>
              </div>
            ) : (
              link.description
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mt-auto pt-4 border-t border-black/5 dark:border-white/[0.04]">
        
        {!isNote && (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn relative isolate overflow-hidden [transform:translateZ(0)] flex items-center gap-2 px-4 py-2 bg-lime-500/10 dark:bg-lime-400/10 text-lime-700 dark:text-lime-400 rounded-xl text-xs font-bold hover:text-black dark:hover:text-[#07070a] transition-all duration-300 ring-1 ring-lime-500/20 dark:ring-lime-400/20 shadow-sm dark:shadow-[0_0_15px_rgba(163,230,53,0.1)] hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(163,230,53,0.4)]"
          >
            {/* Animasiyalı arxa fonu */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-lime-400 rounded-full origin-center scale-0 group-hover/btn:scale-100 transition-transform duration-500 ease-out z-0 pointer-events-none" />
            
            <span className="relative z-10 flex items-center gap-2">
              Aç
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </span>
          </a>
        )}

        <button
          onClick={handleCopy}
          className={`group/btn relative isolate overflow-hidden [transform:translateZ(0)] flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ring-1 ${
            copied
              ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30'
              : 'bg-black/[0.02] dark:bg-white/[0.02] text-slate-500 dark:text-white/40 hover:text-slate-800 dark:hover:text-white/80 ring-black/5 dark:ring-white/5 hover:ring-black/10 dark:hover:ring-white/10'
          }`}
          title={isNote ? "Mətni kopyala" : "URL kopyala"}
        >
          {/* Animasiyalı arxa fonu */}
          {!copied && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-black/[0.05] dark:bg-white/[0.08] rounded-full origin-center scale-0 group-hover/btn:scale-100 transition-transform duration-500 ease-out z-0 pointer-events-none" />
          )}

          <span className="relative z-10 flex items-center gap-2">
            {copied ? (
              <>
                Kopyalandı
                <CheckCircle2 className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Kopyala
                <Copy className="w-3.5 h-3.5" />
              </>
            )}
          </span>
        </button>

        <div className="flex-1" />

        {/* Edit/Delete Icons */}
        <div className="flex items-center gap-1 bg-black/[0.02] dark:bg-white/[0.02] rounded-xl p-1 border border-black/[0.05] dark:border-white/[0.04] ring-1 ring-black/5 dark:ring-white/5 isolate [transform:translateZ(0)]">
          <button
            onClick={() => onEdit(link)}
            className="p-2 text-slate-400 dark:text-white/30 hover:text-lime-600 dark:hover:text-lime-400 hover:bg-lime-500/10 dark:hover:bg-lime-400/10 hover:shadow-[0_0_10px_rgba(163,230,53,0.1)] dark:hover:shadow-[0_0_10px_rgba(163,230,53,0.2)] rounded-lg transition-all duration-300 relative overflow-hidden group/iconbtn"
            title="Redaktə et"
          >
            <div className="absolute inset-0 bg-lime-400/20 scale-0 group-hover/iconbtn:scale-100 transition-transform duration-300 rounded-lg origin-center z-[-1]" />
            <Edit2 className="w-4 h-4 relative z-10" />
          </button>

          <button
            onClick={() => onDelete(link)}
            className="p-2 text-slate-400 dark:text-white/30 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/10 hover:shadow-[0_0_10px_rgba(239,68,68,0.1)] dark:hover:shadow-[0_0_10px_rgba(239,68,68,0.2)] rounded-lg transition-all duration-300 relative overflow-hidden group/iconbtn"
            title="Sil"
          >
            <div className="absolute inset-0 bg-red-400/20 scale-0 group-hover/iconbtn:scale-100 transition-transform duration-300 rounded-lg origin-center z-[-1]" />
            <Trash2 className="w-4 h-4 relative z-10" />
          </button>
        </div>

      </div>
    </div>
  );
}
