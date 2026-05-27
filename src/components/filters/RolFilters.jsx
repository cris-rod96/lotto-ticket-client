import { motion } from 'framer-motion'
import { LuSearch } from 'react-icons/lu'
const RolFilters = ({ searchTerm, setSearchTerm, filteredRoles }) => {
  return (
    <motion.div className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-8 flex justify-between items-center gap-4">
      <div className="relative w-full max-w-sm">
        <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" size={16} />
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-luck-gold/50 text-xs transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-4">
        {filteredRoles.length} Roles
      </span>
    </motion.div>
  )
}

export default RolFilters
