const SuerteFilters = ({
  setActiveTab,
  cifras,
  activeTab
}) => {
  return (
    <div className="flex items-center gap-2 mb-8 bg-zinc-950/50 p-2 rounded-2xl border border-white/5 w-fit">
      {cifras.map((c) => (
        <button
          key={c.id}
          onClick={() => setActiveTab(c.cantidad)}
          className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === c.cantidad
            ? 'bg-luck-gold text-black shadow-lg shadow-luck-gold/20'
            : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
            }`}
        >
          {c.cantidad} Cifras
        </button>
      ))}
    </div>
  )
}

export default SuerteFilters