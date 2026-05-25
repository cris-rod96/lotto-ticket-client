import { AnimatePresence, motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { LuX, LuSearch, LuChevronLeft, LuChevronRight, LuMapPin, LuInbox, LuUsers } from 'react-icons/lu'

const UsuariosPorRolModal = ({ isOpen, onClose, rolNombre, usuarios = [] }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredUsuarios = useMemo(() => {
    return usuarios.filter(u =>
      u.nombresCompletos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.alias?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [usuarios, searchTerm])

  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage)
  const paginatedData = filteredUsuarios.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

        <motion.div
          layout
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-2xl bg-[#0d1110] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-luck-gold/10 border border-luck-gold/20 flex items-center justify-center text-luck-gold">
                <LuUsers size={20} />
              </div>
              <div>
                <h2 className="text-white font-black text-lg uppercase tracking-tight">{rolNombre}</h2>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{filteredUsuarios.length} usuarios asignados</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl text-zinc-500 transition-colors"><LuX size={20} /></button>
          </div>

          {/* Search */}
          <div className="px-8 pt-8">
            <div className="relative">
              <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input type="text" placeholder="Buscar por nombre o alias..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }} className="w-full bg-[#1a1f1e] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs text-white outline-none focus:border-luck-gold/50 transition-all" />
            </div>
          </div>

          {/* Contenedor animado */}
          <motion.div layout className="px-8 py-8 flex flex-col gap-3 min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {paginatedData.length > 0 ? (
                paginatedData.map(u => (
                  <motion.div
                    layout
                    key={u.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex justify-between items-center hover:bg-white/[0.04] transition-colors"
                  >
                    <div>
                      <p className="text-white font-black text-sm">{u.nombresCompletos}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">@{u.alias}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-luck-gold text-[10px] font-black uppercase tracking-wider">{u.PuntosVentum?.nombre || 'Sin sucursal'}</p>
                      <p className="text-[9px] text-zinc-600 font-bold flex items-center justify-end gap-1 uppercase"><LuMapPin size={10} />{u.PuntosVentum?.ubicacion || 'N/A'}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center opacity-20">
                  <LuInbox size={48} className="mb-4 text-luck-gold" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Sin resultados</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer */}
          <div className="p-8 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
            <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Pág {currentPage} de {totalPages || 1}</span>
            {totalPages > 1 && (
              <div className="flex gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-white transition-colors"><LuChevronLeft size={16} /></button>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-white transition-colors"><LuChevronRight size={16} /></button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default UsuariosPorRolModal