import { movimientoAPI } from '@/api/index.api'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  LuActivity,
  LuArrowDownRight,
  LuArrowUpRight,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuFilter,
  LuInbox,
  LuWallet,
  LuX,
} from 'react-icons/lu'
import Swal from 'sweetalert2'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
}

const rowVariants = {
  hidden: { x: -8, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.99, transition: { duration: 0.12 } },
}

const ActividadUsuarioModal = ({ isOpen, onClose, usuario }) => {
  const [loading, setLoading] = useState(false)
  const [movimientos, setMovimientos] = useState([])

  // FILTROS INTERNOS DEL MODAL
  const [catFilter, setCatFilter] = useState('Todos')
  const [metodoFilter, setMetodoFilter] = useState('Todos')

  // PAGINACIÓN INTERNA
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  useEffect(() => {
    if (isOpen && usuario) {
      setLoading(true)
      movimientoAPI
        .listarPorUsuario(usuario.id)
        .then((res) => {
          setMovimientos(res.data?.movimientos || [])
        })
        .catch((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al obtener información',
            text: err.response?.data?.message || 'Error al recuperar movimientos de auditoría',
          })
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [isOpen, usuario, movimientoAPI])

  // CÁLCULO DE MÉTRICAS EN TIEMPO REAL
  const metricas = useMemo(() => {
    let totalVendido = 0
    let totalPremiosPagados = 0

    movimientos.forEach((m) => {
      const valor = parseFloat(m.monto) || 0
      if (m.categoria === 'Venta Ticket') {
        totalVendido += valor
      } else if (m.categoria === 'Pago Premio') {
        totalPremiosPagados += valor
      }
    })

    return {
      totalVendido,
      totalPremiosPagados,
      balance: totalVendido - totalPremiosPagados,
    }
  }, [movimientos])

  // FILTRADO MULTI-CRITERIO
  const filteredMovimientos = useMemo(() => {
    return movimientos.filter((m) => {
      const matchesCat = catFilter === 'Todos' || m.categoria === catFilter
      const matchesMetodo = metodoFilter === 'Todos' || m.metodoPago === metodoFilter
      return matchesCat && matchesMetodo
    })
  }, [movimientos, catFilter, metodoFilter])

  // PAGINACIÓN
  const totalPages = Math.ceil(filteredMovimientos.length / itemsPerPage)

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredMovimientos.slice(start, start + itemsPerPage)
  }, [filteredMovimientos, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [catFilter, metodoFilter])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-[#0c0d0d] border border-white/10 w-full max-w-5xl rounded-[2rem] overflow-hidden flex flex-col shadow-2xl"
        >
          {/* HEADER */}
          <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 border border-sky-500/20">
                <LuActivity size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Auditoría General de Operaciones
                </h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                  Auditando a:{' '}
                  <span className="text-luck-gold font-black">{usuario?.nombresCompletos}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all"
            >
              <LuX size={18} />
            </button>
          </div>

          {/* CUERPO DEL MODAL */}
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-140px)] space-y-6">
            {/* METRICAS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#111615] border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/10">
                  <LuArrowUpRight size={18} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">
                    Total Ventas
                  </p>
                  <p className="text-lg font-black text-white font-mono">
                    ${metricas.totalVendido.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="bg-[#111615] border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/10">
                  <LuArrowDownRight size={18} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">
                    Premios Liquidados
                  </p>
                  <p className="text-lg font-black text-white font-mono">
                    ${metricas.totalPremiosPagados.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="bg-[#111615] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-luck-gold/10 flex items-center justify-center text-luck-gold border border-luck-gold/10">
                    <LuWallet size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">
                      Balance Neto
                    </p>
                    <p
                      className={`text-lg font-black font-mono ${metricas.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                    >
                      ${metricas.balance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BARRA DE FILTROS ESTILIZADA DE CORRECCIÓN (Simétrica a tu módulo principal) */}
            <div className="bg-[#111615] border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* SELECT 1: CATEGORÍAS */}
              <div className="relative w-full sm:w-64">
                <LuFilter
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold pointer-events-none"
                  size={15}
                />
                <select
                  value={catFilter}
                  onChange={(e) => setCatFilter(e.target.value)}
                  className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-xs appearance-none cursor-pointer uppercase font-bold tracking-wider"
                >
                  <option value="Todos">Todas las categorías</option>
                  <option value="Venta Ticket">Ventas de Tickets</option>
                  <option value="Pago Premio">Premios Pagados</option>
                  <option value="Gasto Operativo">Gastos Operativos</option>
                  <option value="Ajuste de Caja">Ajustes de Caja</option>
                </select>
                <LuChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                  size={14}
                />
              </div>

              {/* SELECT 2: MÉTODOS DE PAGO */}
              <div className="relative w-full sm:w-64">
                <LuWallet
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold pointer-events-none"
                  size={15}
                />
                <select
                  value={metodoFilter}
                  onChange={(e) => setMetodoFilter(e.target.value)}
                  className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-xs appearance-none cursor-pointer uppercase font-bold tracking-wider"
                >
                  <option value="Todos">Todos los métodos</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>
                </select>
                <LuChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                  size={14}
                />
              </div>

              {/* CONTADOR DE REGISTROS ALINEADO */}
              <div className="sm:ml-auto px-2 self-center">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  {filteredMovimientos.length} operaciones encontradas
                </span>
              </div>
            </div>

            {/* TABLA DE REGISTROS */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-[#111615] border border-white/5 rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.01] text-zinc-500 uppercase text-[9px] font-black tracking-widest border-b border-white/5">
                      <th className="p-4 pl-6">Fecha / Hora</th>
                      <th className="p-4">Operación</th>
                      <th className="p-4">Método</th>
                      <th className="p-4">Descripción / Referencia</th>
                      <th className="p-4 text-right pr-6">Monto</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/[0.02]">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {loading ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="p-12 text-center animate-pulse text-zinc-600 font-black text-xs tracking-wider uppercase"
                          >
                            Cargando historial operativo...
                          </td>
                        </tr>
                      ) : currentData.length > 0 ? (
                        currentData.map((mov) => {
                          const esIngreso = mov.tipo === 'Ingreso'
                          return (
                            <motion.tr
                              key={mov.id}
                              variants={rowVariants}
                              layout
                              className="hover:bg-white/[0.01] transition-colors"
                            >
                              <td className="p-4 pl-6">
                                <div className="text-white font-mono text-xs font-bold">
                                  {new Date(mov.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false,
                                  })}
                                </div>
                                <div className="text-[9px] text-zinc-500 font-mono mt-0.5">
                                  {new Date(mov.createdAt).toLocaleDateString()}
                                </div>
                              </td>

                              <td className="p-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${
                                    esIngreso ? 'text-emerald-400' : 'text-red-400'
                                  }`}
                                >
                                  {esIngreso ? (
                                    <LuArrowUpRight size={12} />
                                  ) : (
                                    <LuArrowDownRight size={12} />
                                  )}
                                  {mov.categoria}
                                </span>
                              </td>

                              <td className="p-4">
                                <span className="text-xs text-zinc-300 font-medium bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-md">
                                  {mov.metodoPago}
                                </span>
                              </td>

                              <td className="p-4">
                                <p className="text-xs text-zinc-400 max-w-xs truncate italic">
                                  {mov.descripcion || '—'}
                                </p>
                                {mov.referencia && (
                                  <span className="text-[9px] font-mono text-zinc-500 block mt-0.5">
                                    Ref: {mov.referencia}
                                  </span>
                                )}
                              </td>

                              <td className="p-4 text-right pr-6 font-mono text-xs font-black">
                                <span className={esIngreso ? 'text-emerald-400' : 'text-red-400'}>
                                  {esIngreso ? '+' : '-'}${parseFloat(mov.monto).toFixed(2)}
                                </span>
                              </td>
                            </motion.tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td colSpan="5" className="p-16 text-center">
                            <div className="flex flex-col items-center justify-center opacity-30">
                              <LuInbox size={40} className="mb-2 text-luck-gold" />
                              <p className="text-[10px] font-black uppercase tracking-widest text-white">
                                Sin movimientos registrados
                              </p>
                              <p className="text-[9px] font-medium text-zinc-500 mt-0.5">
                                No hay transacciones que coincidan con el filtro
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* PAGINACIÓN INTERNA */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                    Página {currentPage} de {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="p-1.5 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-luck-gold disabled:opacity-10 transition-all"
                    >
                      <LuChevronLeft size={14} />
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="p-1.5 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-luck-gold disabled:opacity-10 transition-all"
                    >
                      <LuChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* FOOTER */}
          <div className="p-4 border-t border-white/5 bg-white/[0.01] flex justify-end">
            <button
              onClick={onClose}
              className="bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-white font-black py-2 px-4 rounded-xl uppercase text-[10px] tracking-wider transition-all"
            >
              Cerrar Auditoría
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ActividadUsuarioModal
