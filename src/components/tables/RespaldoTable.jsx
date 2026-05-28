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
  return (
    <motion.div
      variants={containerVariants}
      className="bg-[#111615] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
    >
      <div className="overflow-x-auto">
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
            <AnimatePresence mode="popLayout" initial={false}>
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-24 text-center text-zinc-500 font-black text-xs uppercase tracking-widest animate-pulse"
                  >
                    Cargando historial de copias...
                  </td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((backup) => (
                  <motion.tr
                    key={backup.id}
                    variants={rowVariants}
                    layout
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
                        {/* Botón para copiar enlace al portapapeles */}
                        <button
                          onClick={() => handleCopiarLink(backup.url)}
                          title="Copiar enlace de descarga"
                          className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-luck-gold transition-colors"
                        >
                          <LuClipboard size={16} />
                        </button>
                        {/* Enlace de descarga directo */}
                        <a
                          href={backup.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Descargar archivo .sql"
                          className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-emerald-500 transition-colors flex items-center justify-center"
                        >
                          <LuCloudDownload size={16} />
                        </a>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-16 text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center max-w-sm mx-auto"
                    >
                      {/* Icono Premium con Ondas de Fondo */}
                      <div className="relative mb-5 flex items-center justify-center">
                        <div className="absolute w-16 h-16 bg-luck-gold/5 rounded-full blur-xl animate-pulse" />
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#1a1f1e] to-[#111615] border border-white/5 flex items-center justify-center text-luck-gold/40 shadow-inner">
                          <LuDatabase size={24} className="animate-pulse duration-1000" />
                        </div>
                      </div>

                      {/* Textos Informativos */}
                      <h3 className="text-white font-black text-xs uppercase tracking-wider mb-1">
                        Sin copias de seguridad
                      </h3>
                      <p className="text-[11px] text-zinc-500 max-w-[280px] leading-relaxed">
                        No se registran respaldos en el sistema para los criterios de filtrado
                        seleccionados.
                      </p>
                    </motion.div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="p-5 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
            Pág {currentPage} de {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 bg-zinc-900 rounded-lg text-zinc-500 hover:text-luck-gold disabled:opacity-30 disabled:pointer-events-none"
            >
              <LuChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-[10px] font-bold ${
                  currentPage === i + 1
                    ? 'bg-luck-gold text-black'
                    : 'text-zinc-600 hover:bg-white/5'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 bg-zinc-900 rounded-lg text-zinc-500 hover:text-luck-gold disabled:opacity-30 disabled:pointer-events-none"
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
