import { AnimatePresence, motion } from 'framer-motion'
import {
  LuChevronLeft,
  LuChevronRight,
  LuEye,
  LuInbox,
  LuMapPin,
  LuPencil,
  LuRefreshCw,
  LuTrash2,
  LuUserCog,
  LuUsers,
} from 'react-icons/lu'
const UsuarioTable = ({
  containerVariants,
  rowVariants,
  loading,
  currentData,
  handleDeleteUser,
  handleEdit,
  handleRestoreUser,
  handleViewActivity,
  currentPage,
  setCurrentPage,
  totalPages,
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
              <th className="p-5 pl-8">Usuario</th>
              <th className="p-5">Alias</th>
              <th className="p-5">Rol</th>
              <th className="p-5">Punto Venta</th>
              <th className="p-5 text-center">Estado</th>
              <th className="p-5 text-right pr-8">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.02]">
            <AnimatePresence mode="popLayout" initial={false}>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-16 text-center animate-pulse text-zinc-600 font-black text-xs tracking-widest uppercase"
                  >
                    Cargando registros...
                  </td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((user) => (
                  <motion.tr
                    key={user.id}
                    variants={rowVariants}
                    layout
                    className="group hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="p-5 pl-8">
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="w-9 h-9 rounded-xl bg-luck-gold/10 border border-luck-gold/20 flex items-center justify-center text-luck-gold shrink-0"
                        >
                          <LuUsers size={16} />
                        </motion.div>
                        <span className="text-white font-black text-sm tracking-tight lowercase first-letter:uppercase">
                          {user.nombresCompletos}
                        </span>
                      </div>
                    </td>

                    <td className="p-5 text-zinc-400 font-mono text-xs tracking-wider">
                      {user.alias}
                    </td>

                    <td className="p-5">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <LuUserCog size={13} className="text-luck-gold/70" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                          {user.Role?.nombre || '—'}
                        </span>
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <LuMapPin size={13} className="text-zinc-600" />
                        <span className="text-xs text-zinc-400">
                          {user.PuntosVentum?.nombre || 'Sin punto'}
                        </span>
                      </div>
                    </td>

                    <td className="p-5 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                          user.activo
                            ? 'bg-green-500/5 text-green-500 border-green-500/20'
                            : 'bg-red-500/5 text-red-500 border-red-500/20'
                        }`}
                      >
                        {user.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    <td className="p-5 pr-8">
                      <div className="flex justify-end gap-2.5">
                        {/* NUEVO BOTÓN: VER ACTIVIDAD / RENDIMIENTO */}
                        <motion.button
                          whileHover={{ scale: 1.05, backgroundColor: 'rgba(56,189,248,0.08)' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewActivity(user)}
                          className="p-2 bg-zinc-900/40 border border-white/5 rounded-lg text-zinc-500 hover:text-sky-400 transition-colors"
                          title="Ver Actividad y Rendimiento"
                        >
                          <LuEye size={15} />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.04)' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(user)}
                          className="p-2 bg-zinc-900/40 border border-white/5 rounded-lg text-zinc-500 hover:text-luck-gold transition-colors"
                        >
                          <LuPencil size={15} />
                        </motion.button>

                        {user.activo ? (
                          <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(239,68,68,0.08)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteUser(user)}
                            className="p-2 bg-zinc-900/40 border border-white/5 rounded-lg text-zinc-500 hover:text-red-500 transition-colors"
                          >
                            <LuTrash2 size={15} />
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(34,197,94,0.08)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRestoreUser(user)}
                            className="p-2 bg-zinc-900/40 border border-white/5 rounded-lg text-zinc-500 hover:text-green-500 transition-colors"
                          >
                            <LuRefreshCw size={15} />
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td colSpan="6" className="p-24 text-center">
                    <div className="flex flex-col items-center justify-center opacity-30">
                      <LuInbox size={50} className="mb-3 text-luck-gold" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                        No se encontraron usuarios
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mt-1">
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
        <div className="p-5 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
            Página {currentPage} de {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-luck-gold disabled:opacity-10 transition-all"
            >
              <LuChevronLeft size={16} />
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-md text-[9px] font-black transition-all ${
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
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-luck-gold disabled:opacity-10 transition-all"
            >
              <LuChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default UsuarioTable
