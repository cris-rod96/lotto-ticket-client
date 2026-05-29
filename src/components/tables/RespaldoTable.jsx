import usePaginationWindow from '@/hooks/usePaginationWindow'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LuChevronLeft,
  LuChevronRight,
  LuClipboard,
  LuCloudDownload,
  LuDatabase,
} from 'react-icons/lu'

const RespaldoTable = ({
  containerVariants,
  rowVariants,
  loading,
  currentData,
  currentPage,
  setCurrentPage,
  totalPages,
  handleCopiarLink,
}) => {
  const pageNumbers = usePaginationWindow(currentPage, totalPages)

  return (
    <motion.div
      variants={containerVariants}
      // min-h-[600px] evita que la tabla se encoja al cambiar de página o estar vacía
      className="bg-[#111615] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col min-h-[600px]"
    >
      {/* custom-scrollbar oculta la barra visual manteniendo el scroll */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] text-zinc-600 uppercase text-[9px] font-black tracking-[0.2em]">
              <th className="p-6 pl-10">Archivo de Respaldo</th>
              <th className="p-6 text-center">Entorno</th>
              <th className="p-6 text-center">Fecha de Creación</th>
              <th className="p-6 text-right pr-10">Descarga / Enlace</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.tr key="loading" exit={{ opacity: 0 }}>
                  <td
                    colSpan="4"
                    className="p-24 text-center text-zinc-500 font-black text-xs uppercase tracking-widest animate-pulse"
                  >
                    Cargando historial de copias...
                  </td>
                </motion.tr>
              ) : currentData.length > 0 ? (
                currentData.map((backup) => (
                  <motion.tr
                    key={backup.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="group hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="p-5 pl-10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-luck-gold/10 border border-luck-gold/20 flex items-center justify-center text-luck-gold">
                          <LuDatabase size={18} />
                        </div>
                        <div>
                          <p className="text-white font-bold text-xs uppercase max-w-xs md:max-w-md truncate">
                            {backup.nombre}
                          </p>
                          <p className="text-[10px] text-zinc-600 font-mono">
                            ID: {backup.id.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                          backup.entorno === 'production'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {backup.entorno === 'development' ? 'Desarrollo' : 'Producción'}
                      </span>
                    </td>
                    <td className="p-5 text-center text-zinc-400 font-mono text-xs">
                      {new Date(backup.createdAt).toLocaleString('es-EC', {
                        timeZone: 'America/Guayaquil',
                      })}
                    </td>
                    <td className="p-5 pr-10">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleCopiarLink(backup.url)}
                          className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-luck-gold transition-colors"
                        >
                          <LuClipboard size={16} />
                        </button>
                        <a
                          href={backup.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-emerald-500 transition-colors"
                        >
                          <LuCloudDownload size={16} />
                        </a>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td colSpan="4" className="p-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <LuDatabase size={32} className="text-zinc-800 mb-4" />
                      <h3 className="text-white font-black text-xs uppercase tracking-widest">
                        Sin registros
                      </h3>
                    </div>
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Paginación Inteligente */}
      {totalPages > 1 && (
        <div className="mt-auto p-5 border-t border-white/5 bg-white/[0.01] flex justify-between items-center select-none">
          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
            Pág {currentPage} de {totalPages}
          </span>
          <div className="flex gap-1 items-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 bg-zinc-900 rounded-lg text-zinc-500 hover:text-luck-gold disabled:opacity-10 transition-all"
            >
              <LuChevronLeft size={16} />
            </button>
            {pageNumbers.map((page, index) => (
              <button
                key={index}
                onClick={() =>
                  page !== 'ellipsis-left' && page !== 'ellipsis-right' && setCurrentPage(page)
                }
                className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${
                  currentPage === page
                    ? 'bg-luck-gold text-black'
                    : 'text-zinc-600 hover:bg-white/5'
                }`}
              >
                {typeof page === 'number' ? page : '...'}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 bg-zinc-900 rounded-lg text-zinc-500 hover:text-luck-gold disabled:opacity-10 transition-all"
            >
              <LuChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default RespaldoTable
