import { AnimatePresence, motion } from 'framer-motion'
import {
  LuChevronLeft,
  LuChevronRight,
  LuEye,
  LuFileText,
  LuImage,
  LuInbox,
  LuTrendingDown,
  LuTrendingUp,
  LuTrophy,
} from 'react-icons/lu'
const ResultadoTable = ({
  containerVariants,
  rowVariants,
  loading,
  currentData,
  handleOpenDetalle,
  handlePrepareFlyer,
  handleGenerarReporteGanadores,
  totalPages,
  currentPage,
  setCurrentPage,
}) => {
  return (
    <motion.div
      variants={containerVariants}
      className="bg-[#111615] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] text-zinc-400 uppercase text-[10px] font-black tracking-[0.2em]">
              <th className="p-6">Sorteo</th>
              <th className="p-6">Fecha / Hora</th>
              <th className="p-6">Ventas</th>
              <th className="p-6">Premios</th>
              <th className="p-6">Utilidad Neta</th>
              <th className="p-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            <AnimatePresence mode="popLayout" initial={false}>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-20 text-center animate-pulse text-zinc-500 font-black italic"
                  >
                    CARGANDO...
                  </td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((res) => {
                  const sorteo = res.Sorteo
                  const recaudado = parseFloat(sorteo?.montoRecaudado || 0)
                  const premios = parseFloat(sorteo?.montoPorPagar || 0)
                  const utilidad = parseFloat(sorteo?.utilidadNeta || 0)
                  const esPositivo = utilidad >= 0

                  return (
                    <motion.tr
                      key={res.id}
                      variants={rowVariants}
                      layout
                      className="group hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-luck-gold/10 flex items-center justify-center text-luck-gold border border-luck-gold/20">
                            <LuTrophy size={20} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white font-bold text-base uppercase">
                              {sorteo?.Catalogo?.nombre} - {sorteo?.jornada}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-black">
                              № {sorteo?.numero} ({sorteo?.Cifra?.cantidad} cifras)
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-zinc-300 font-bold">
                        {sorteo?.fechaSorteo}{' '}
                        <span className="block text-[10px] text-zinc-500">
                          {sorteo?.horaSorteo}
                        </span>
                      </td>
                      <td className="p-6 text-white font-black italic tracking-tighter">
                        ${recaudado.toFixed(2)}
                      </td>
                      <td className="p-6 text-luck-gold font-black italic tracking-tighter">
                        ${premios.toFixed(2)}
                      </td>
                      <td className="p-6">
                        <div
                          className={`flex items-center gap-2 font-black italic ${esPositivo ? 'text-emerald-400' : 'text-red-400'}`}
                        >
                          {esPositivo ? <LuTrendingUp size={18} /> : <LuTrendingDown size={18} />}$
                          {utilidad.toFixed(2)}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenDetalle(res)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-400 hover:text-luck-gold transition-all uppercase text-[10px] font-black"
                            title="Detalles"
                          >
                            <LuEye size={16} />
                          </button>
                          <button
                            onClick={() => handlePrepareFlyer(res)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-white/5 rounded-xl text-emerald-400 hover:border-emerald-400/30 transition-all uppercase text-[10px] font-black"
                            title="Flyer"
                          >
                            <LuImage size={16} />
                          </button>
                          <button
                            onClick={() => handleGenerarReporteGanadores(res)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-white/5 rounded-xl text-blue-400 hover:text-blue-300 transition-all uppercase text-[10px] font-black"
                            title="Reporte PDF"
                          >
                            <LuFileText size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })
              ) : (
                /* ESTADO VACÍO */
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td colSpan="6" className="p-32 text-center">
                    <div className="flex flex-col items-center justify-center opacity-20">
                      <LuInbox size={60} className="mb-4 text-luck-gold" />
                      <p className="text-xs font-black uppercase tracking-[0.4em] text-white">
                        No se encontraron registros
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-2">
                        Prueba cambiando los selectores de filtro
                      </p>
                    </div>
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex items-center gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-10 disabled:hover:text-zinc-500 transition-all"
            >
              <LuChevronLeft size={20} />
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${
                    currentPage === i + 1
                      ? 'bg-luck-gold text-black'
                      : 'text-zinc-500 hover:bg-white/5'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-10 disabled:hover:text-zinc-500 transition-all"
            >
              <LuChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default ResultadoTable
