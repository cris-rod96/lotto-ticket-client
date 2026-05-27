import { motion } from 'framer-motion'
import { LuFilter, LuMapPin } from 'react-icons/lu'
const PuntoVentaFilters = ({
  locationFilter,
  setLocationFilter,
  uniqueLocations,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <motion.div className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-8 flex flex-wrap items-center gap-4">
      <div className="relative w-full sm:w-56">
        <LuMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" size={16} />
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-xs appearance-none cursor-pointer uppercase font-bold"
        >
          <option value="Todos">Todas las ubicaciones</option>
          {uniqueLocations.map((loc, idx) => (
            <option key={idx} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>
      <div className="relative w-full sm:w-56">
        <LuFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" size={16} />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-xs appearance-none cursor-pointer uppercase font-bold"
        >
          <option value="Todos">Todos los estados</option>
          <option value="Activos">Activos</option>
          <option value="Inactivos">Inactivos</option>
        </select>
      </div>
    </motion.div>
  )
}

export default PuntoVentaFilters
