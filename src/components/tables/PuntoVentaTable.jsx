import { AnimatePresence, motion } from 'framer-motion'
import {
  LuChevronLeft,
  LuChevronRight,
  LuDices,
  LuDollarSign,
  LuPencil,
  LuRefreshCw,
  LuStore,
  LuTicket,
  LuTrash2,
  LuUsers,
} from 'react-icons/lu'

const PuntoVentaTable = ({
  containerVariants,
  rowVariants,
  currentData,
  currentPage,
  setCurrentPage,
  totalPages,
  loading,
  openDetailView,
  onVerSuertes, // Prop independiente para abrir el modal de suertes en caliente
  handleEdit,
  handleDeletePunto,
  handleRestorePunto,
}) => {
  return (
    <motion.div
      variants={containerVariants}
      className="bg-[#111615] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] text-zinc-500 uppercase text-[10px] font-black tracking-[0.18em] border-b border-white/5">
              <th className="p-5 pl-8">Punto de Venta</th>
              <th className="p-5">Ubicación</th>
              <th className="p-5 text-center">Usuarios</th>
              <th className="p-5 text-center">Tickets</th>
              <th className="p-5 text-center">Suertes</th>
              <th className="p-5 text-center">Recaudado</th>
              <th className="p-5 text-center">Estado</th>
              <th className="p-5 text-right pr-8">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            <AnimatePresence mode="popLayout" initial={false}>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="p-16 text-center text-zinc-600 font-black text-xs uppercase"
                  >
                    Cargando...
                  </td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((punto) => (
                  <motion.tr
                    key={punto.id}
                    variants={rowVariants}
                    layout
                    className="group hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="p-5 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-luck-gold/10 border border-luck-gold/20 flex items-center justify-center text-luck-gold">
                          <LuStore size={16} />
                        </div>
                        <span className="text-white font-black text-sm tracking-tight lowercase first-letter:uppercase">
                          {punto.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 text-zinc-400 text-xs">{punto.ubicacion}</td>

                    {/* COLUMNA: USUARIOS */}
                    <td className="p-5 text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => openDetailView(punto, 'usuarios')}
                        className="flex items-center justify-center gap-2 text-zinc-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:border-luck-gold/40 transition-all mx-auto cursor-pointer"
                      >
                        <LuUsers size={13} className="text-luck-gold" />
                        <span className="font-mono text-[11px] font-bold">
                          {punto.Usuarios?.length || 0}
                        </span>
                      </motion.button>
                    </td>

                    {/* COLUMNA: TICKETS (Corregido: Lee el contador directo de Postgres) */}
                    <td className="p-5 text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => openDetailView(punto, 'tickets')}
                        className="flex items-center justify-center gap-2 text-zinc-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:border-luck-gold/40 transition-all mx-auto cursor-pointer"
                      >
                        <LuTicket size={13} className="text-luck-gold" />
                        <span className="font-mono text-[11px] font-bold">
                          {punto.totalTickets || 0}
                        </span>
                      </motion.button>
                    </td>

                    {/* COLUMNA: VER SUERTES */}
                    <td className="p-5 text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => onVerSuertes(punto)}
                        className="flex items-center justify-center gap-2 text-zinc-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:border-luck-gold/40 transition-all mx-auto cursor-pointer"
                      >
                        <LuDices size={13} className="text-luck-gold" />
                        <span className="font-mono text-[11px] font-bold">Ver suertes</span>
                      </motion.button>
                    </td>

                    {/* COLUMNA: RECAUDADO (Corregido: Renderiza la suma de dinero apostado calculada nativamente) */}
                    <td className="p-5 text-center text-luck-gold font-mono font-bold text-xs">
                      <div className="flex items-center justify-center gap-1">
                        <LuDollarSign size={13} />
                        {Number(punto.totalRecaudado || 0).toFixed(2)}
                      </div>
                    </td>

                    {/* COLUMNA: ESTADO */}
                    <td className="p-5 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${punto.activo ? 'bg-green-500/5 text-green-500 border-green-500/20' : 'bg-red-500/5 text-red-500 border-red-500/20'}`}
                      >
                        {punto.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    {/* COLUMNA: ACCIONES */}
                    <td className="p-5 pr-8">
                      <div className="flex justify-end gap-2.5">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleEdit(punto)}
                          className="p-2 bg-zinc-900/40 border border-white/5 rounded-lg text-zinc-500 hover:text-luck-gold cursor-pointer"
                        >
                          <LuPencil size={15} />
                        </motion.button>
                        {punto.activo ? (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleDeletePunto(punto)}
                            className="p-2 bg-zinc-900/40 border border-white/5 rounded-lg text-zinc-500 hover:text-red-500 cursor-pointer"
                          >
                            <LuTrash2 size={15} />
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleRestorePunto(punto)}
                            className="p-2 bg-zinc-900/40 border border-white/5 rounded-lg text-zinc-500 hover:text-green-500 cursor-pointer"
                          >
                            <LuRefreshCw size={15} />
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="p-20 text-center text-zinc-500 text-xs font-black uppercase"
                  >
                    No se encontraron puntos de venta
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="p-5 border-t border-white/5 bg-white/[0.01] flex justify-between items-center text-[9px]">
          <span className="text-zinc-500 font-black uppercase tracking-widest">
            Pág {currentPage} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 bg-zinc-900 rounded-lg text-zinc-500 hover:text-luck-gold disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <LuChevronLeft size={16} />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 bg-zinc-900 rounded-lg text-zinc-500 hover:text-luck-gold disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <LuChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default PuntoVentaTable
