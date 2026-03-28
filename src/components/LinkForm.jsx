import { useState, useEffect } from 'react';
import { Link2, Type, Hash, Star, X, Sparkles, Bold, Italic, Heading, List, Code, Link as LinkIcon, Edit2, Plus } from 'lucide-react';
import { fetchAndTranslateMetadata } from '../services/metadata';

const PRESET_CATEGORIES = ['GitHub', 'AI', 'Video', 'Mətn (Qeyd)', 'Digər'];

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

export default function LinkForm({ link, onSubmit, onCancel }) {
  const isEditing = !!link;
  const [formData, setFormData] = useState(() => {
    if (!isEditing) {
      try {
        const saved = localStorage.getItem('kenobook_draft');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse draft', e);
      }
    }
    return {
      title: link?.title || '',
      url: link?.url || '',
      description: link?.description || '',
      category: link?.category || 'GitHub',
      is_favorite: link?.is_favorite || false,
    };
  });

  useEffect(() => {
    if (!isEditing) {
      localStorage.setItem('kenobook_draft', JSON.stringify(formData));
    }
  }, [formData, isEditing]);
  
  const [customCategory, setCustomCategory] = useState('');
  const [useCustom, setUseCustom] = useState(
    link?.category && !PRESET_CATEGORIES.includes(link.category) && link.category !== 'Text' && link.category !== 'AI'
  );
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);

  const isNote = formData.category === 'Mətn (Qeyd)' || formData.category === 'Text';

  useEffect(() => {
    if (isNote && errors.url) {
      setErrors((prev) => ({ ...prev, url: undefined }));
    }
  }, [isNote, errors.url]);

  const activeTab = isNote ? 'text' : 'link';

  const handleTabSwitch = (tab) => {
    if (tab === 'text') {
      setFormData((prev) => ({ ...prev, category: 'Mətn (Qeyd)', url: '' }));
      setUseCustom(false);
      setCustomCategory('');
    } else {
      setFormData((prev) => ({ ...prev, category: 'GitHub' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Başlıq tələb olunur';
    
    if (!isNote) {
      if (!formData.url.trim()) newErrors.url = 'URL tələb olunur';
      else if (!isValidUrl(formData.url)) newErrors.url = 'Düzgün URL daxil edin';
    }
    
    return newErrors;
  };

  const handleAutoFill = async () => {
    if (!formData.url.trim() || !isValidUrl(formData.url)) {
      setErrors((prev) => ({ ...prev, url: 'Avto-doldurmaq üçün düzgün URL daxil edin' }));
      return;
    }
    
    setIsFetchingMeta(true);
    setErrors((prev) => ({ ...prev, url: undefined, submit: undefined }));
    
    try {
      const meta = await fetchAndTranslateMetadata(formData.url);
      setFormData((prev) => ({
        ...prev,
        title: meta.title || prev.title,
        description: meta.description || prev.description
      }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: err.message }));
    } finally {
      setIsFetchingMeta(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitting(true);
    
    try {
      const finalCategory = useCustom 
        ? (customCategory.trim() || 'Digər') 
        : formData.category;
        
      const data = {
        ...formData,
        category: finalCategory,
        url: (isNote && !formData.url.trim()) ? '' : formData.url,
      };
      
      await onSubmit(data);
      if (!isEditing) localStorage.removeItem('kenobook_draft');
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const insertMarkdown = (prefix, suffix = '') => {
    const textarea = document.getElementById('markdown-editor');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = formData.description || '';
    const selectedText = currentText.substring(start, end);
    
    const insertContent = selectedText || (suffix ? 'mətni yazın' : 'Mətn');
    
    const newText = currentText.substring(0, start) + prefix + insertContent + suffix + currentText.substring(end);
    handleChange('description', newText);
    
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + prefix.length, end + prefix.length);
      } else {
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + insertContent.length);
      }
    }, 0);
  };

  const handleCancel = () => {
    if (!isEditing) localStorage.removeItem('kenobook_draft');
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0f]/80 dark:bg-[#0a0a0f]/80 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="bg-white/90 dark:bg-[#121216]/90 border border-black/10 dark:border-white/[0.08] rounded-[32px] w-full max-w-2xl shadow-2xl dark:shadow-[0_0_80px_rgba(0,0,0,0.8)] animate-slideUp relative overflow-hidden ring-1 ring-inset ring-black/5 dark:ring-white/5 backdrop-blur-3xl">
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-black/5 dark:border-white/[0.04]">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400/20 dark:bg-lime-500/10 flex items-center justify-center ring-1 ring-lime-400/30 dark:ring-lime-500/20 shadow-[0_0_15px_rgba(163,230,53,0.2)]">
              {isEditing ? <Edit2 className="w-5 h-5 text-lime-600 dark:text-lime-400" /> : <Plus className="w-5 h-5 text-lime-600 dark:text-lime-400" />}
            </div>
            {isEditing 
              ? (isNote ? 'Qeydi Yenilə' : 'Keçidi Yenilə') 
              : (isNote ? 'Yeni Qeyd' : 'Yeni Keçid')}
          </h2>
          <button
            onClick={handleCancel}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 sm:space-y-6 relative [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-transparent">
          
          {/* Type Selection Tabs */}
            {!isEditing && (
              <div className="flex bg-black/[0.03] dark:bg-white/[0.03] p-1 rounded-2xl border border-black/5 dark:border-white/5 relative isolate">
                <div
                  className="absolute inset-y-1 left-1 w-[calc(50%-4px)] bg-white dark:bg-white/10 rounded-xl shadow-sm transition-all duration-300 ease-out z-[-1]"
                  style={{ transform: activeTab === 'text' ? 'translateX(calc(100% + 4px))' : 'translateX(0)' }}
                />
                <button
                  type="button"
                  onClick={() => handleTabSwitch('link')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-colors duration-300 ${
                    activeTab === 'link' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/80'
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  Veb Keçid
                </button>
                <button
                  type="button"
                  onClick={() => handleTabSwitch('text')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-colors duration-300 ${
                    activeTab === 'text' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/80'
                  }`}
                >
                  <Type className="w-4 h-4" />
                  Mətn Qeydi
                </button>
              </div>
            )}

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-slate-600 dark:text-white/60 text-xs font-bold tracking-wider uppercase mb-2 ml-1">
                Başlıq <span className="text-red-500/80">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500/50 transition-all font-medium text-[15px] shadow-inner dark:shadow-none"
                placeholder="Məs. React Rəsmi Sənədlər"
              />
              {errors.title && (
                <p className="flex items-center gap-1.5 text-red-500 dark:text-red-400 text-sm mt-2 ml-1 font-medium bg-red-500/10 py-1.5 px-3 rounded-lg border border-red-500/20 max-w-max">
                  <AlertCircle className="w-4 h-4" /> {errors.title}
                </p>
              )}
            </div>

            {/* URL (Only if Veb Keçid mode) */}
            {!isNote && (
              <div>
                <label className="block text-slate-600 dark:text-white/60 text-xs font-bold tracking-wider uppercase mb-2 ml-1">
                  URL Mənzili <span className="text-red-500/80">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500/50 transition-all font-medium text-[15px] shadow-inner dark:shadow-none font-mono text-sm"
                  placeholder="https://..."
                />
                {errors.url && (
                  <p className="flex items-center gap-1.5 text-red-500 dark:text-red-400 text-sm mt-2 ml-1 font-medium bg-red-500/10 py-1.5 px-3 rounded-lg border border-red-500/20 max-w-max">
                    <AlertCircle className="w-4 h-4" /> {errors.url}
                  </p>
                )}
              </div>
            )}

            {/* Description (Shared, optional for links, required for notes) */}
            <div>
              <label className="block text-slate-600 dark:text-white/60 text-xs font-bold tracking-wider uppercase mb-2 ml-1">
                {isNote ? (
                  <>Mətn Məzmunu <span className="text-red-500/80">*</span></>
                ) : (
                  'Qısa Açıqlama'
                )}
              </label>
              
              <div className="relative group/editor">
                <div className="absolute top-0 inset-x-0 h-11 bg-slate-100 dark:bg-[#07070a] border border-b border-black/10 dark:border-white/5 rounded-t-2xl flex items-center px-4 gap-2 z-10 transition-colors">
                  <button type="button" onClick={() => insertMarkdown('**', '**')} className="p-1.5 text-slate-500 dark:text-white/40 hover:text-lime-600 dark:hover:text-lime-300 hover:bg-lime-500/10 dark:hover:bg-lime-400/10 rounded-md transition-all duration-300" title="Qalın yazı"><Bold className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => insertMarkdown('*', '*')} className="p-1.5 text-slate-500 dark:text-white/40 hover:text-lime-600 dark:hover:text-lime-300 hover:bg-lime-500/10 dark:hover:bg-lime-400/10 rounded-md transition-all duration-300" title="Maili (Italic)"><Italic className="w-3.5 h-3.5" /></button>
                  <div className="w-[1px] h-3.5 bg-black/10 dark:bg-white/10 mx-1" />
                  <button type="button" onClick={() => insertMarkdown('### ')} className="p-1.5 text-slate-500 dark:text-white/40 hover:text-lime-600 dark:hover:text-lime-300 hover:bg-lime-500/10 dark:hover:bg-lime-400/10 rounded-md transition-all duration-300" title="Başlıq"><Heading className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => insertMarkdown('- ')} className="p-1.5 text-slate-500 dark:text-white/40 hover:text-lime-600 dark:hover:text-lime-300 hover:bg-lime-500/10 dark:hover:bg-lime-400/10 rounded-md transition-all duration-300" title="Alt-alta siyahı"><List className="w-3.5 h-3.5" /></button>
                  <div className="w-[1px] h-3.5 bg-black/10 dark:bg-white/10 mx-1" />
                  <button type="button" onClick={() => insertMarkdown('`', '`')} className="p-1.5 text-slate-500 dark:text-white/40 hover:text-lime-600 dark:hover:text-lime-300 hover:bg-lime-500/10 dark:hover:bg-lime-400/10 rounded-md transition-all duration-300" title="Kod bloku"><Code className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => insertMarkdown('[', '](url)')} className="p-1.5 text-slate-500 dark:text-white/40 hover:text-lime-600 dark:hover:text-lime-300 hover:bg-lime-500/10 dark:hover:bg-lime-400/10 rounded-md transition-all duration-300" title="Link yerləşdir"><LinkIcon className="w-3.5 h-3.5" /></button>
                </div>
                <textarea
                  required={isNote}
                  id="markdown-editor"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full h-32 bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl pt-14 pb-4 px-5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500/50 transition-all resize-none shadow-inner dark:shadow-none text-[14px] leading-relaxed [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-black/10 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full"
                  placeholder={isNote ? "Qeydinizi bura yazın... (Markdown dəstəklənir)" : "Nə üçün saxlayırsınız? (Markdown dəstəklənir)"}
                />
                {isNote && (
                  <div className="absolute top-4 right-4 z-20">
                    <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 bg-lime-500/10 text-lime-600 dark:text-lime-400 rounded-md border border-lime-500/20">
                      Markdown Düymələri
                    </span>
                  </div>
                )}
              </div>
              {errors.description && (
                <p className="flex items-center gap-1.5 text-red-500 dark:text-red-400 text-sm mt-2 ml-1 font-medium bg-red-500/10 py-1.5 px-3 rounded-lg border border-red-500/20 max-w-max">
                  <AlertCircle className="w-4 h-4" /> {errors.description}
                </p>
              )}
            </div>

            {/* Category (Only if Veb Keçid mode) */}
            {!isNote && (
              <div>
                <div className="flex items-center justify-between mb-2 ml-1">
                  <label className="text-slate-600 dark:text-white/60 text-xs font-bold tracking-wider uppercase">
                    Kateqoriya <span className="text-red-500/80">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setUseCustom(!useCustom);
                      setCustomCategory('');
                      if (useCustom) setFormData(prev => ({ ...prev, category: 'Digər' }));
                    }}
                    className="text-lime-600 dark:text-lime-400 text-xs font-bold hover:text-lime-500 transition-colors uppercase tracking-wide"
                  >
                    {useCustom ? 'STANDART SEÇ' : 'YENİSİNİ YAZ'}
                  </button>
                </div>

                {useCustom ? (
                  <input
                    type="text"
                    required
                    value={customCategory}
                    onChange={(e) => {
                      setCustomCategory(e.target.value);
                      setFormData(prev => ({ ...prev, category: e.target.value }));
                    }}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500/50 transition-all font-medium text-[15px] shadow-inner dark:shadow-none"
                    placeholder="Kateqoriya adını daxil edin"
                  />
                ) : (
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500/50 transition-all font-medium text-[15px] cursor-pointer shadow-inner dark:shadow-none"
                    >
                      {PRESET_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-white dark:bg-[#12121a] py-2 font-medium">
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                      <ChevronDown className="w-5 h-5 text-slate-500 dark:text-white/40" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            {/* Favorite */}
            <button
              type="button"
              onClick={() => handleChange('is_favorite', !formData.is_favorite)}
              className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-300 ${
                formData.is_favorite 
                  ? 'bg-lime-400/10 border-lime-400/30 text-lime-400 ring-1 ring-lime-400/20' 
                  : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white/80'
              }`}
            >
              <Star className={`w-5 h-5 transition-transform duration-500 ${formData.is_favorite ? 'fill-lime-400 scale-110 drop-shadow-[0_0_10px_rgba(163,230,53,0.8)]' : 'group-hover:scale-110'}`} />
              <span className="text-xs font-bold tracking-wide">SEVİMLİ DEYİL / BƏLİ</span>
            </button>

            {/* Auto-fill button for links */}
            {!isNote && (
              <button
                type="button"
                onClick={handleAutoFill}
                disabled={isFetchingMeta || !formData.url.trim()}
                className="group flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-500/20"
              >
                {isFetchingMeta ? (
                  <span className="animate-pulse">Gözlənilir...</span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    Avto-Doldur
                  </>
                )}
              </button>
            )}
          </div>

          {/* Error */}
          {errors.submit && (
            <div className="flex items-center gap-2 text-red-500 dark:text-red-400 text-sm font-medium bg-red-500/10 p-4 rounded-xl border border-red-500/20">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-black/5 dark:border-white/[0.04]">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-4 bg-black/[0.03] dark:bg-white/[0.03] text-slate-600 dark:text-white/50 rounded-xl hover:bg-black/[0.08] dark:hover:bg-white/[0.08] hover:text-slate-900 dark:hover:text-white transition-all font-bold text-sm border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 w-1/3"
            >
              Ləğv Et
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="group relative flex-1 overflow-hidden rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-lime-500 via-emerald-500 to-lime-500 group-hover:scale-[1.05] transition-transform duration-500" />
              <div className="relative px-6 py-4 text-black font-black text-sm tracking-wide shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                {submitting
                  ? 'GÖZLƏYİN...'
                  : isEditing
                  ? 'YENİLƏ'
                  : (isNote ? 'QEYDİ YADDA SAXLA' : 'LİNKİ YADDA SAXLA')}
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
