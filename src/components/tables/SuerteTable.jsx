import { AnimatePresence, motion } from "framer-motion"
import { LuClover, LuLayers, LuPencil } from "react-icons/lu"

const SuerteTable = ({
  filteredSuertes,
  handleEdit,


}) => {
  return (
    <div className="bg-[#111615] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/[0.02] text-zinc-500 uppercase text-[11px] font-bold tracking-[0.15em]">
            <th className="p-7 pl-10">Nivel de Suerte</th>
            <th className="p-7 text-center">Premio en este Punto</th>
            <th className="p-7 text-center">Estado</th>
            <th className="p-7 text-right pr-10">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.03]">
          <AnimatePresence mode="wait">
            {filteredSuertes.length > 0 ? (
              filteredSuertes.map((suerte) => (
                <motion.tr
                  key={suerte.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="group hover:bg-white/[0.01] transition-colors"
                >
                  <td className="p-7 pl-10 font-black text-white uppercase text-sm italic flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-luck-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                    {suerte.descripcion}
                  </td>
                  <td className="p-7 text-center font-mono text-luck-gold font-black text-lg">
                    ${suerte.premio}
                  </td>
                  <td className="p-7 text-center">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${suerte.activo
                        ? 'bg-green-500/5 text-green-500 border-green-500/20'
                        : 'bg-red-500/5 text-red-500 border-red-500/20'
                        }`}
                    >
                      {suerte.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-7 pr-10 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(suerte)}
                        className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold transition-all"
                      >
                        <LuPencil size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <td colSpan="4" className="p-32 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative mb-6">
                      <LuClover size={60} className="text-zinc-800" />
                      <LuLayers
                        size={24}
                        className="absolute -bottom-2 -right-2 text-luck-gold/40"
                      />
                    </div>
                    <h3 className="text-white font-black uppercase tracking-[0.3em] text-xs mb-2">
                      Sin configuración de premios
                    </h3>
                    <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest max-w-[250px] mx-auto leading-relaxed">
                      No se encontraron premios para el punto de venta y categoría seleccionados.
                    </p>
                  </div>
                </td>
              </motion.tr>
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}

export default SuerteTable