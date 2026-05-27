import { motion } from 'framer-motion'
import { LuClock, LuFilter } from 'react-icons/lu'
const ResultadoFilters = ({
  filteredResults,
  setJornadaFilter,
  jornadaFilter,
  utilidadFilter,
  setUtilidadFilter,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-6 shadow-xl flex flex-col sm:flex-row items-center gap-4"
    >
      {/* SELECT 1: JORNADAS CORREGIDAS */}
      <div className="relative w-full sm:w-64">
        <LuClock className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" size={18} />
        <select
          value={jornadaFilter}
          onChange={(e) => setJornadaFilter(e.target.value)}
          className="w-full bg-[#1a1f1e] border border-white/10 rounded-2xl py-3.5 pl-12 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-sm appearance-none cursor-pointer uppercase font-bold"
        >
          <option value="Todos" className="bg-[#1a1f1e] text-white">
            Todas las jornadas
          </option>
          <option value="Matutina" className="bg-[#1a1f1e] text-white">
            Matutina
          </option>
          <option value="Vespertina" className="bg-[#1a1f1e] text-white">
            Vespertina
          </option>
          <option value="Nocturna" className="bg-[#1a1f1e] text-white">
            Nocturna
          </option>
        </select>
      </div>

      {/* SELECT 2: RENDIMIENTO / UTILIDAD NETA */}
      <div className="relative w-full sm:w-64">
        <LuFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" size={18} />
        <select
          value={utilidadFilter}
          onChange={(e) => setUtilidadFilter(e.target.value)}
          className="w-full bg-[#1a1f1e] border border-white/10 rounded-2xl py-3.5 pl-12 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-sm appearance-none cursor-pointer uppercase font-bold"
        >
          <option value="Todos" className="bg-[#1a1f1e] text-white">
            Todas las utilidades
          </option>
          <option value="Positiva" className="bg-[#1a1f1e] text-white">
            Ganancia (Positiva)
          </option>
          <option value="Negativa" className="bg-[#1a1f1e] text-white">
            Pérdida (Negativa)
          </option>
        </select>
      </div>

      <div className="ml-auto px-4 hidden sm:block">
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
          {filteredResults.length} Registros Filtrados
        </span>
      </div>
    </motion.div>
  )
}

export default ResultadoFilters
