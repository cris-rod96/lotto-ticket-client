import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { LuDices, LuFilter, LuHash, LuInfo, LuLayoutGrid, LuTrophy, LuX } from 'react-icons/lu'

const SuertesDetailModal = ({ isOpen, onClose, puntoVenta }) => {
  useEffect(() => {
    puntoVenta
  }, [])
  const [filterCifras, setFilterCifras] = useState('all')

  // 1. Obtener tipos de cifras únicos para el filtro (ej: 2, 3)
  const tiposCifras = useMemo(() => {
    if (!puntoVenta?.DetallesSuertes) return []
    const cifras = puntoVenta.DetallesSuertes.map((d) => d.Suerte?.Cifra?.cantidad)
    return [...new Set(cifras)].sort((a, b) => a - b)
  }, [puntoVenta])

  // 2. Filtrar las suertes según la selección
  const suertesFiltradas = useMemo(() => {
    if (!puntoVenta?.DetallesSuertes) return []
    if (filterCifras === 'all') return puntoVenta.DetallesSuertes
    return puntoVenta.DetallesSuertes.filter((d) => d.Suerte?.Cifra?.cantidad === filterCifras)
  }, [puntoVenta, filterCifras])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        {/* Overlay con desenfoque */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Contenido del Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[85vh] bg-[#0b0f0e] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-luck-gold/10 border border-luck-gold/20 flex items-center justify-center text-luck-gold">
                <LuDices size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight uppercase">
                  Configuración de Suertes
                </h2>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="text-luck-gold">{puntoVenta?.nombre}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-800" />
                  {puntoVenta?.DetallesSuertes?.length || 0} Suertes asignadas
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/5 rounded-2xl text-zinc-500 hover:text-white transition-colors"
            >
              <LuX size={20} />
            </button>
          </div>

          {/* Filtros */}
          <div className="px-8 py-4 bg-white/[0.01] border-b border-white/5 flex items-center gap-3">
            <div className="text-zinc-500 mr-2">
              <LuFilter size={14} />
            </div>
            <button
              onClick={() => setFilterCifras('all')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                filterCifras === 'all'
                  ? 'bg-luck-gold text-black border-luck-gold'
                  : 'bg-white/5 text-zinc-500 border-white/5 hover:border-white/20'
              }`}
            >
              Todas
            </button>
            {tiposCifras.map((num) => (
              <button
                key={num}
                onClick={() => setFilterCifras(num)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                  filterCifras === num
                    ? 'bg-luck-gold text-black border-luck-gold'
                    : 'bg-white/5 text-zinc-500 border-white/5 hover:border-white/20'
                }`}
              >
                {num} Cifras
              </button>
            ))}
          </div>

          {/* Grid de Suertes */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suertesFiltradas.map((detalle) => (
                <motion.div
                  key={detalle.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group bg-[#111615] border border-white/5 hover:border-luck-gold/30 rounded-[1.5rem] p-5 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="px-3 py-1 bg-luck-gold/10 border border-luck-gold/20 rounded-lg">
                      <span className="text-luck-gold font-mono text-[10px] font-black">
                        {detalle.Suerte?.Cifra?.cantidad} CIFRAS
                      </span>
                    </div>
                    <div className="text-zinc-700">
                      <LuLayoutGrid size={14} />
                    </div>
                  </div>

                  <h3 className="text-white font-black text-xs uppercase tracking-tight mb-4 line-clamp-1">
                    {detalle.Suerte?.descripcion}
                  </h3>

                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase">Premio</span>
                      <span className="text-luck-gold font-mono text-xs font-black">
                        ${parseFloat(detalle.premio).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center px-1">
                      <div className="flex items-center gap-2 text-zinc-500">
                        <LuTrophy size={12} className="text-zinc-600" />
                        <span className="text-[9px] font-bold uppercase tracking-tighter">
                          Cupo Máx
                        </span>
                      </div>
                      <span className="text-zinc-300 font-mono text-[10px]">
                        ${detalle.Suerte?.Cifra?.cupoMaximoPorNumero}
                      </span>
                    </div>

                    <div className="flex justify-between items-center px-1">
                      <div className="flex items-center gap-2 text-zinc-500">
                        <LuInfo size={12} className="text-zinc-600" />
                        <span className="text-[9px] font-bold uppercase tracking-tighter">
                          Min. Ticket
                        </span>
                      </div>
                      <span className="text-zinc-300 font-mono text-[10px]">
                        ${detalle.Suerte?.Cifra?.valorMinimoTicket}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {suertesFiltradas.length === 0 && (
              <div className="h-64 flex flex-col items-center justify-center text-zinc-600">
                <LuHash size={40} className="mb-4 opacity-20" />
                <p className="text-xs font-black uppercase tracking-[0.2em]">
                  No hay suertes con este filtro
                </p>
              </div>
            )}
          </div>

          {/* Footer Informativo */}
          <div className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-center">
            <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">
              El Golpe de la Suerte &copy; {new Date().getFullYear()} - Gestión de Suertes Activas
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default SuertesDetailModal
