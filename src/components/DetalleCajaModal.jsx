import { useAuthStore } from '@/store/useAuthStore'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import {
  LuArrowDownLeft,
  LuArrowUpRight,
  LuChevronLeft,
  LuChevronRight,
  LuFilter,
  LuRotateCcw,
  LuX,
} from 'react-icons/lu'

const DetalleCajaModal = ({ isOpen, onClose, caja, formatCurrency }) => {
  const { user } = useAuthStore()
  const [modalDateFilter, setModalDateFilter] = useState('')
  const [filterMode, setFilterMode] = useState('Todos')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  const movimientosFiltrados = useMemo(() => {
    if (!caja?.Movimientos) return []
    setCurrentPage(1)
    return caja.Movimientos.filter((mov) => {
      const fechaMovimiento = new Date(mov.createdAt).toISOString().split('T')[0]
      const coincideFecha = modalDateFilter ? fechaMovimiento === modalDateFilter : true
      const coincideUsuario = filterMode === 'MisMovimientos' ? mov.UsuarioId === user?.id : true
      return coincideFecha && coincideUsuario
    })
  }, [caja, modalDateFilter, filterMode, user?.id])

  // Lógica para sumar montos totales por categoría
  const resumenCategorias = useMemo(() => {
    return movimientosFiltrados.reduce((acc, mov) => {
      const valor = parseFloat(mov.monto) || 0
      acc[mov.categoria] = (acc[mov.categoria] || 0) + valor
      return acc
    }, {})
  }, [movimientosFiltrados])

  const totalPages = Math.ceil(movimientosFiltrados.length / itemsPerPage)
  const paginatedMovimientos = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return movimientosFiltrados.slice(start, start + itemsPerPage)
  }, [movimientosFiltrados, currentPage])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-[#0a0c0c] border border-white/10 rounded-[2.5rem] w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto"
          >
            {/* CABECERA */}
            <div className="px-6 pt-6 pb-4 bg-gradient-to-b from-white/[0.05] to-transparent border-b border-white/10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                    Detalle de Sesión
                  </h2>
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                    ID: {caja.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-xl text-zinc-400 transition-all"
                >
                  <LuX size={20} />
                </button>
              </div>

              {/* FILTROS */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  {/* El icono ahora tiene z-index y pointer-events-none para que no interfiera */}
                  <input
                    type="date"
                    value={modalDateFilter}
                    onChange={(e) => setModalDateFilter(e.target.value)}
                    className="w-full bg-[#161a1a] border border-white/10 rounded-xl py-3 px-4 text-white text-[10px] font-bold focus:border-luck-gold outline-none 
    
                  [&::-webkit-calendar-picker-indicator]:invert 
                  [&::-webkit-calendar-picker-indicator]:brightness-0 
                  [&::-webkit-calendar-picker-indicator]:contrast-200
                  [&::-webkit-calendar-picker-indicator]:cursor-pointer
                  [&::-webkit-calendar-picker-indicator]:w-4
                  [&::-webkit-calendar-picker-indicator]:h-4"
                  />
                </div>
                <button
                  onClick={() =>
                    setFilterMode((prev) => (prev === 'Todos' ? 'MisMovimientos' : 'Todos'))
                  }
                  className={`px-6 py-3 rounded-xl border text-[10px] font-black uppercase flex items-center gap-2 transition-all ${filterMode === 'MisMovimientos' ? 'bg-luck-gold text-black border-luck-gold' : 'bg-[#161a1a] border-white/10 text-white'}`}
                >
                  <LuFilter size={14} /> {filterMode === 'Todos' ? 'Todos' : 'Mis Movimientos'}
                </button>
                <button
                  onClick={() => {
                    setModalDateFilter('')
                    setFilterMode('Todos')
                    setCurrentPage(1)
                  }}
                  className="px-3 py-3 rounded-xl border border-white/10 bg-[#161a1a] text-zinc-500 hover:text-luck-gold hover:border-luck-gold transition-all"
                >
                  <LuRotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* RESUMEN DE MONTOS */}
            <div className="px-6 py-3 flex gap-2 overflow-x-auto border-b border-white/5 bg-black/20">
              {Object.entries(resumenCategorias).map(([cat, total]) => (
                <div
                  key={cat}
                  className="flex-shrink-0 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2"
                >
                  <span className="text-[9px] font-black text-zinc-500 uppercase">{cat}:</span>
                  <span className="text-[9px] font-black text-luck-gold bg-luck-gold/10 px-1.5 py-0.5 rounded-md">
                    {formatCurrency(total)}
                  </span>
                </div>
              ))}
            </div>

            {/* CUERPO LISTA */}
            <div className="flex-1 overflow-y-auto px-6 py-2 space-y-2">
              {paginatedMovimientos.length > 0 ? (
                paginatedMovimientos.map((mov) => (
                  <div
                    key={mov.id}
                    className="flex justify-between items-center bg-white/[0.02] p-4 rounded-xl border border-white/5 hover:bg-white/[0.05] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${mov.tipo === 'Ingreso' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
                      >
                        {mov.tipo === 'Ingreso' ? (
                          <LuArrowUpRight size={16} />
                        ) : (
                          <LuArrowDownLeft size={16} />
                        )}
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-white uppercase">
                          {mov.categoria}
                        </p>
                        <p className="text-[9px] text-zinc-400 uppercase font-bold">
                          {mov.descripcion}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-black text-sm text-white">
                      {mov.tipo === 'Ingreso' ? '+' : '-'}
                      {formatCurrency(mov.monto)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-zinc-600 gap-2">
                  <LuFilter size={32} className="text-zinc-800" />
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Sin resultados
                  </p>
                </div>
              )}
            </div>

            {/* PAGINACIÓN */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-20 text-white"
                >
                  <LuChevronLeft size={16} />
                </button>
                <span className="text-[10px] font-black text-luck-gold uppercase bg-luck-gold/10 px-3 py-1 rounded-lg">
                  {currentPage} de {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-20 text-white"
                >
                  <LuChevronRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DetalleCajaModal
