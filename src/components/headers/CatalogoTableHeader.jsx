import Title from "@/components/Titlte"
import { motion } from "framer-motion"
import { LuFilter, LuGlobe, LuPlus } from "react-icons/lu"

const CatalogoTableHeader = ({
  handleOpenModal,
  countryFilter,
  setCountryFilter,
  statusFilter,
  setStatusFilter,
  filtered
}) => {
  return (
    <>
      {/* SE CORRIGIÓ: Se cambió items-center por items-end para alinear el botón con la base del título */}
      <div className="flex justify-between items-center mb-10">
        <Title titulo="Catálogo de Juegos" descripcion="Definición de productos de lotería por región" />
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#EAB308' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOpenModal()}
          className="bg-luck-gold text-black font-black py-3.5 px-6 rounded-2xl flex items-center gap-2 uppercase text-xs shadow-lg shadow-luck-gold/10 transition-colors tracking-wider"
        >
          <LuPlus size={18} strokeWidth={3} /> Nuevo Juego
        </motion.button>
      </div>

      <motion.div className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-8 flex flex-wrap items-center gap-4">
        <div className="relative w-full sm:w-56">
          <LuGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" size={16} />
          <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-xs appearance-none cursor-pointer uppercase font-bold">
            <option value="Todos">Todos los países</option>
            <option value="EC">Ecuador</option>
            <option value="AR">Argentina</option>
          </select>
        </div>

        <div className="relative w-full sm:w-56">
          <LuFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" size={16} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-xs appearance-none cursor-pointer uppercase font-bold">
            <option value="Todos">Todos los estados</option>
            <option value="Activos">Activos</option>
            <option value="Inactivos">Inactivos</option>
          </select>
        </div>

        <div className="ml-auto px-2 hidden lg:block">
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{filtered.length} Juegos Filtrados</span>
        </div>
      </motion.div>
    </>
  )
}

export default CatalogoTableHeader