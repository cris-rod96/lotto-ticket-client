import { AnimatePresence, motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { LuUsers, LuTicket, LuX, LuSearch, LuChevronLeft, LuChevronRight, LuDollarSign, LuInbox } from 'react-icons/lu'

const DetallePuntoModal = ({ isOpen, onClose, title, data = {}, type }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // 1. Extraer el array correcto según el tipo
  const listData = useMemo(() => {
    if (type === 'usuarios') return data.Usuarios || []
    if (type === 'tickets') return data.Tickets || []
    return []
  }, [data, type])

  // 2. Calcular movimientos de caja (Ventas vs Egresos)
  const getUsuarioStats = (usuarioId) => {
    const movimientos = data.Cajas?.flatMap((caja) => caja.Movimientos) || []
    const userMoves = movimientos.filter((m) => m.UsuarioId === usuarioId)

    const ventas = userMoves
      .filter((m) => m.tipo === 'Ingreso')
      .reduce((acc, m) => acc + parseFloat(m.monto || 0), 0)

    const egresos = userMoves
      .filter((m) => m.tipo === 'Egreso')
      .reduce((acc, m) => acc + parseFloat(m.monto || 0), 0)

    return { ventas, egresos }
  }

  // 3. Filtrado dinámico
  const filteredData = listData.filter((item) => {
    const search = searchTerm.toLowerCase()
    return type === 'usuarios'
      ? item.nombresCompletos?.toLowerCase().includes(search) || item.alias?.toLowerCase().includes(search)
      : item.codigo?.toLowerCase().includes(search)
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-5xl bg-[#0d1110] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-luck-gold/10 border border-luck-gold/20 flex items-center justify-center text-luck-gold">
                {type === 'usuarios' ? <LuUsers size={22} /> : <LuTicket size={22} />}
              </div>
              <div>
                <h2 className="text-white font-black text-lg uppercase tracking-tight">{title}</h2>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{filteredData.length} registros</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="bg-[#1a1f1e] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white outline-none w-48"
                />
              </div>
              <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl text-zinc-500 transition-colors">
                <LuX size={20} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {paginatedData.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                    <th className="p-4">Identificación</th>
                    {type === 'usuarios' ? (
                      <>
                        <th className="p-4 text-center">Ventas</th>
                        <th className="p-4 text-center">Egresos</th>
                        <th className="p-4 text-center">Estado</th>
                      </>
                    ) : (
                      <th className="p-4 text-center">Resultado</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {paginatedData.map((item) => {
                    const stats = type === 'usuarios' ? getUsuarioStats(item.id) : null
                    return (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="text-white font-bold text-sm">{type === 'usuarios' ? item.nombresCompletos : item.codigo}</div>
                          <div className="text-zinc-500 text-[10px] uppercase font-bold">{type === 'usuarios' ? `@${item.alias}` : 'Ticket'}</div>
                        </td>
                        {type === 'usuarios' ? (
                          <>
                            <td className="p-4 text-center text-green-400 font-black text-xs">${stats.ventas.toFixed(2)}</td>
                            <td className="p-4 text-center text-red-400 font-black text-xs">${stats.egresos.toFixed(2)}</td>
                            <td className="p-4 text-center">
                              <span className={`text-[9px] px-3 py-1 rounded-full font-black ${item.activo ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
                                {item.activo ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                          </>
                        ) : (
                          <td className="p-4 text-center">
                            <span className="flex items-center justify-center gap-1 text-luck-gold font-black text-xs">
                              <LuDollarSign size={12} />
                              {item.DetallesTickets?.reduce((a, b) => a + parseFloat(b.montoApostado || 0), 0).toFixed(2)}
                            </span>
                            <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold ${item.resultado === 'Ganador' ? 'text-green-400' : 'text-zinc-400'}`}>
                              {item.resultado}
                            </span>
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center opacity-20">
                <LuInbox size={40} className="mb-2 text-luck-gold" />
                <p className="text-[10px] font-black uppercase tracking-widest text-white">Sin datos</p>
              </div>
            )}
          </div>

          {/* Footer Paginación */}
          <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Pág {currentPage} de {totalPages || 1}</span>
            {totalPages > 1 && (
              <div className="flex gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 bg-zinc-900 rounded-lg text-zinc-500 hover:text-white"><LuChevronLeft size={16} /></button>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 bg-zinc-900 rounded-lg text-zinc-500 hover:text-white"><LuChevronRight size={16} /></button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default DetallePuntoModal