import { motion, AnimatePresence } from "framer-motion"
import { LuChevronLeft, LuChevronRight, LuGlobe, LuInbox, LuPencil, LuTrash2 } from "react-icons/lu"
const CatalogoTableBody = ({
  containerVariants,
  rowVariants,
  currentData,
  handleOpenModal,
  handleDelete,
  currentPage,
  setCurrentPage,
  totalPages


}) => {
  return (
    <motion.div variants={containerVariants} className="bg-[#111615] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] text-zinc-500 uppercase text-[10px] font-black tracking-[0.18em] border-b border-white/5">
              <th className="p-5 pl-8">Nombre del Juego</th>
              <th className="p-5">País</th>
              <th className="p-5 text-center">Estado</th>
              <th className="p-5 text-right pr-8">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            <AnimatePresence mode="popLayout" initial={false}>
              {currentData.length > 0 ? (
                currentData.map((item) => (
                  <motion.tr key={item.id} variants={rowVariants} layout className="group hover:bg-white/[0.01] transition-colors">
                    <td className="p-5 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-luck-gold/10 border border-luck-gold/20 flex items-center justify-center text-luck-gold"><LuGlobe size={16} /></div>
                        <span className="text-white font-black text-sm tracking-tight">{item.nombre}</span>
                      </div>
                    </td>
                    <td className="p-5 text-zinc-400 text-xs font-bold uppercase tracking-wider">{item.pais === 'EC' ? 'Ecuador' : 'Argentina'}</td>
                    <td className="p-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${item.activo ? 'bg-green-500/5 text-green-500 border-green-500/20' : 'bg-red-500/5 text-red-500 border-red-500/20'}`}>
                        {item.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="p-5 pr-8">
                      <div className="flex justify-end gap-2.5">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleOpenModal(item)} className="p-2 bg-zinc-900/40 border border-white/5 rounded-lg text-zinc-500 hover:text-luck-gold transition-colors"><LuPencil size={15} /></motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 bg-zinc-900/40 border border-white/5 rounded-lg text-zinc-500 hover:text-red-500 transition-colors" onClick={() => handleDelete(item)}><LuTrash2 size={15} /></motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr><td colSpan="4" className="p-20 text-center"><LuInbox size={50} className="mx-auto text-luck-gold opacity-30" /><p className="text-[10px] font-black uppercase text-white mt-4 tracking-widest opacity-30">No se encontraron juegos</p></td></tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-5 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Página {currentPage} de {totalPages}</p>
          <div className="flex items-center gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-luck-gold transition-all"><LuChevronLeft size={16} /></button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-7 h-7 rounded-md text-[9px] font-black ${currentPage === i + 1 ? 'bg-luck-gold text-black' : 'text-zinc-500 hover:bg-white/5'}`}>{i + 1}</button>
              ))}
            </div>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-luck-gold transition-all"><LuChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default CatalogoTableBody