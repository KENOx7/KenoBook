const PRESET_CATEGORIES = ['GitHub', 'AI', 'Video', 'Mətn (Qeyd)', 'Digər'];

export default function CategoryFilter({ categories, selected, onChange }) {
  const sortedCategories = [
    'Hamısı',
    ...PRESET_CATEGORIES,
    ...categories.filter((c) => !['All', 'Hamısı', ...PRESET_CATEGORIES].includes(c)),
  ];

  const currentSelected = selected === 'All' ? 'Hamısı' : selected;

  return (
    <div className="flex items-center gap-2.5 pb-2 pt-2 px-1 flex-nowrap lg:flex-wrap">
      {sortedCategories.map((cat) => {
        const isSelected = currentSelected === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat === 'Hamısı' ? 'All' : cat)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 border backdrop-blur-md shrink-0 ${
              isSelected
                ? 'bg-lime-100 dark:bg-lime-400/10 text-lime-700 dark:text-lime-400 border-lime-200 dark:border-lime-400/30 shadow-sm dark:shadow-[0_0_20px_rgba(163,230,53,0.15)] scale-[1.02] ring-1 ring-lime-200 dark:ring-lime-400/20'
                : 'bg-white dark:bg-white/[0.02] text-slate-500 dark:text-white/40 border-black/5 dark:border-white/[0.05] hover:bg-slate-50 dark:hover:bg-white/[0.06] hover:text-slate-800 dark:hover:text-white/70 hover:border-black/10 dark:hover:border-white/[0.1] hover:-translate-y-0.5 shadow-sm dark:shadow-none'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
