import { useState, useEffect } from 'react';
import { useLinks } from './hooks/useLinks';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import LinkCard from './components/LinkCard';
import LinkForm from './components/LinkForm';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import PinPromptModal from './components/PinPromptModal';
import SortFilter from './components/SortFilter';
import ParticleBackground from './components/ParticleBackground';
import { Loader2, Plus, Sparkles, AlertCircle, LayoutGrid, List } from 'lucide-react';

export default function App() {
  const {
    links,
    allLinks,
    loading,
    error,
    categories,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    addLink,
    updateLink,
    deleteLink,
  } = useLinks();

  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [deletingLink, setDeletingLink] = useState(null);
  const [pinPrompt, setPinPrompt] = useState({ isOpen: false, action: null, payload: null, callback: null, hint: '' });
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('kenobook_view') || 'grid');
  const [theme, setTheme] = useState(() => localStorage.getItem('kenobook_theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('kenobook_view', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('kenobook_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const sortedLinks = [...(links || [])].sort((a, b) => {
    if (sortBy === 'default') {
      if (a.is_favorite && !b.is_favorite) return -1;
      if (!a.is_favorite && b.is_favorite) return 1;
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    }
    if (sortBy === 'newest') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    if (sortBy === 'oldest') return new Date(a.created_at || 0) - new Date(b.created_at || 0);
    if (sortBy === 'a-z') return (a.title || '').localeCompare(b.title || '');
    if (sortBy === 'z-a') return (b.title || '').localeCompare(a.title || '');
    return 0;
  });

  const executeSecureAction = (actionType, payload, callback, hint = '') => {
    const isUnlocked = localStorage.getItem('admin_unlocked') === 'true';
    if (isUnlocked) {
      callback();
      return;
    }

    if (actionType === 'add') {
      const added = parseInt(localStorage.getItem('guest_links_added') || '0', 10);
      if (added < 5) {
        callback();
        return;
      }
      hint = 'Spam limiti dolub (5/5). Zəhmət olmasa təhlükəsizlik kodunu daxil edin.';
    }

    setPinPrompt({ isOpen: true, action: actionType, payload, callback, hint });
  };

  const handlePinSuccess = (pin) => {
    localStorage.setItem('admin_unlocked', 'true');
    pinPrompt.callback();
    setPinPrompt({ isOpen: false, action: null, payload: null, callback: null, hint: '' });
  };

  const handleAddClick = () => {
    executeSecureAction('add', null, () => setShowForm(true));
  };

  const handleEditClick = (link) => {
    executeSecureAction('edit', link, () => setEditingLink(link), 'Redaktə etmək üçün PIN kodu daxil edin.');
  };

  const handleDeleteClick = (link) => {
    executeSecureAction('delete', link, () => setDeletingLink(link), 'Silmək üçün PIN kodu daxil edin.');
  };

  const handleAdd = async (data) => {
    await addLink(data);
    setShowForm(false);

    if (localStorage.getItem('admin_unlocked') !== 'true') {
      const added = parseInt(localStorage.getItem('guest_links_added') || '0', 10);
      localStorage.setItem('guest_links_added', (added + 1).toString());
    }
  };

  const handleUpdate = async (data) => {
    await updateLink(editingLink.id, data);
    setEditingLink(null);
  };

  const handleDeleteConfirm = async (id) => {
    await deleteLink(id);
    setDeletingLink(null);
  };

  const handleToggleFavorite = async (id, isFavorite) => {
    await updateLink(id, { is_favorite: isFavorite });
  };

  const renderCard = (link, index) => (
    <div 
      key={link.id} 
      className="animate-cardIn w-full" 
      style={{ animationDelay: `${(index % 12) * 50}ms` }}
    >
      <LinkCard
        link={link}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070709] text-slate-900 dark:text-white transition-colors duration-500 selection:bg-lime-500/30 selection:text-lime-50">

      <ParticleBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-16">
        <Header linkCount={allLinks.length} onAddClick={handleAddClick} theme={theme} toggleTheme={toggleTheme} />

        <div className="relative z-40 flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-3 w-full xl:w-auto flex-1">
            <div className="flex-1">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <SortFilter value={sortBy} onChange={setSortBy} />
            <div className="hidden sm:flex bg-white dark:bg-[#1a1a24] border border-black/5 dark:border-white/[0.08] shadow-sm dark:shadow-none rounded-xl p-1 gap-1 flex-shrink-0">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-black/5 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/80 hover:bg-black/5 dark:hover:bg-white/5'}`}
                title="Şəbəkə (Grid)"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-black/5 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/80 hover:bg-black/5 dark:hover:bg-white/5'}`}
                title="Siyahı (List)"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 overflow-x-auto -mx-5 px-5 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.length > 1 && (
              <CategoryFilter
                categories={categories}
                selected={categoryFilter}
                onChange={setCategoryFilter}
              />
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-5">
            <Loader2 className="w-10 h-10 text-lime-500 dark:text-lime-400 animate-spin" />
            <span className="text-slate-400 dark:text-white/40 text-sm font-bold tracking-widest uppercase">Məlumatlar Yüklənir...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="bg-white/80 dark:bg-[#121216]/80 backdrop-blur-xl border border-red-500/20 rounded-[32px] p-10 max-w-lg mx-auto text-center ring-1 ring-inset ring-red-500/10 shadow-[0_0_60px_rgba(239,68,68,0.1)] relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-red-500/20 blur-3xl pointer-events-none" />

              <div className="w-16 h-16 rounded-[24px] bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(239,68,68,0.1)] dark:shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
              </div>
              <p className="text-slate-900 dark:text-white font-black text-2xl tracking-tight mb-3">Baza Tapılmadı</p>
              <p className="text-slate-500 dark:text-white/60 text-sm leading-relaxed mb-8">
                Görünür ki, Supabase layihəniz aktiv deyil. Layihə avtomatik olaraq dondurulmuş ola bilər.
              </p>

              <a
                href={'https://supabase.com/dashboard/project/wbjaggbwemnseozyrxph'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white rounded-2xl text-sm font-bold transition-all duration-300 ring-1 ring-inset ring-black/5 dark:ring-white/10 hover:ring-black/10 dark:hover:ring-white/30"
              >
                Supabase İdarə Panelinə Keçid
              </a>
            </div>
          </div>
        ) : links.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="text-center max-w-md">
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 bg-lime-400/20 dark:bg-lime-400/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full rounded-[32px] bg-white dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.08] flex items-center justify-center shadow-lg dark:shadow-2xl backdrop-blur-xl ring-1 ring-inset ring-black/5 dark:ring-white/5">
                  <Sparkles className="w-10 h-10 text-lime-500 dark:text-lime-400" />
                </div>
              </div>

              <h3 className="text-slate-900 dark:text-white text-2xl font-black tracking-tight mb-4">
                {searchQuery || categoryFilter !== 'All'
                  ? 'Nəticə Tapılmadı'
                  : 'Siyahı Boşdur'}
              </h3>
              <p className="text-slate-500 dark:text-white/40 text-sm leading-relaxed mb-10">
                {searchQuery || categoryFilter !== 'All'
                  ? 'Axtarış sözünü və ya filteri dəyişib yenidən yoxlayın.'
                  : 'Yeni bir keçid və ya mətn qeydi əlavə edərək dəftərçənizi yaratmağa başlayın.'}
              </p>

              {!searchQuery && categoryFilter === 'All' && (
                <button
                  onClick={handleAddClick}
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-white/[0.03] text-slate-800 dark:text-white rounded-2xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-white/[0.08] transition-all duration-500 overflow-hidden ring-1 ring-inset ring-black/5 dark:ring-white/10 hover:ring-lime-400/50 shadow-xl dark:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-lime-400/0 via-lime-400/10 to-lime-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  <Plus className="w-5 h-5 text-lime-500 dark:text-lime-400 group-hover:rotate-90 transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(163,230,53,0.3)] dark:drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]" />
                  <span className="relative z-10 transition-colors duration-300">İLK QEYDİNİ YARAT</span>
                </button>
              )}
            </div>
          </div>
        ) : viewMode === 'list' ? (
          <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
            {sortedLinks.map((link, i) => (
              <div key={link.id} className="animate-cardIn w-full" style={{ animationDelay: `${(i % 12) * 50}ms` }}>
                <LinkCard link={link} onEdit={handleEditClick} onDelete={handleDeleteClick} onToggleFavorite={handleToggleFavorite} />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Mobil */}
            <div className="flex sm:hidden flex-col gap-6">
              {sortedLinks.map((link, i) => (
                <div key={link.id} className="animate-cardIn w-full" style={{ animationDelay: `${(i % 12) * 50}ms` }}>
                  <LinkCard link={link} onEdit={handleEditClick} onDelete={handleDeleteClick} onToggleFavorite={handleToggleFavorite} />
                </div>
              ))}
            </div>

            <div className="hidden sm:grid lg:hidden grid-cols-2 gap-6 items-start">
              <div className="flex flex-col gap-6">
                {sortedLinks.filter((_, i) => i % 2 === 0).map(link => (
                  <div key={link.id} className="animate-cardIn w-full" style={{ animationDelay: `${(sortedLinks.indexOf(link) % 12) * 50}ms` }}>
                    <LinkCard link={link} onEdit={handleEditClick} onDelete={handleDeleteClick} onToggleFavorite={handleToggleFavorite} />
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-6">
                {sortedLinks.filter((_, i) => i % 2 === 1).map(link => (
                  <div key={link.id} className="animate-cardIn w-full" style={{ animationDelay: `${(sortedLinks.indexOf(link) % 12) * 50}ms` }}>
                    <LinkCard link={link} onEdit={handleEditClick} onDelete={handleDeleteClick} onToggleFavorite={handleToggleFavorite} />
                  </div>
                ))}
              </div>
            </div>

            {/* PC */}
            <div className="hidden lg:grid grid-cols-3 gap-6 items-start">
              <div className="flex flex-col gap-6">
                {sortedLinks.filter((_, i) => i % 3 === 0).map(link => (
                  <div key={link.id} className="animate-cardIn w-full" style={{ animationDelay: `${(sortedLinks.indexOf(link) % 12) * 50}ms` }}>
                    <LinkCard link={link} onEdit={handleEditClick} onDelete={handleDeleteClick} onToggleFavorite={handleToggleFavorite} />
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-6">
                {sortedLinks.filter((_, i) => i % 3 === 1).map(link => (
                  <div key={link.id} className="animate-cardIn w-full" style={{ animationDelay: `${(sortedLinks.indexOf(link) % 12) * 50}ms` }}>
                    <LinkCard link={link} onEdit={handleEditClick} onDelete={handleDeleteClick} onToggleFavorite={handleToggleFavorite} />
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-6">
                {sortedLinks.filter((_, i) => i % 3 === 2).map(link => (
                  <div key={link.id} className="animate-cardIn w-full" style={{ animationDelay: `${(sortedLinks.indexOf(link) % 12) * 50}ms` }}>
                    <LinkCard link={link} onEdit={handleEditClick} onDelete={handleDeleteClick} onToggleFavorite={handleToggleFavorite} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <LinkForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
      )}

      {editingLink && (
        <LinkForm
          link={editingLink}
          onSubmit={handleUpdate}
          onCancel={() => setEditingLink(null)}
        />
      )}

      {deletingLink && (
        <DeleteConfirmModal
          link={deletingLink}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingLink(null)}
        />
      )}

      {pinPrompt.isOpen && (
        <PinPromptModal
          actionHint={pinPrompt.hint}
          onSubmit={handlePinSuccess}
          onCancel={() => setPinPrompt({ isOpen: false, action: null, payload: null, callback: null, hint: '' })}
        />
      )}
    </div>
  );
}
