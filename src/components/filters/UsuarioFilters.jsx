import { motion } from 'framer-motion'
import { LuFilter, LuMapPin, LuUserCog } from 'react-icons/lu'
const UsuarioFilters = ({
  roleFilter,
  setRoleFilter,
  roles,
  statusFilter,
  setStatusFilter,
  puntosVenta,
  puntoFilter,
  setPuntoFilter,
  filteredUsers,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-8 flex flex-wrap items-center gap-4"
    >
      {/* SELECT 1: POR ROLES */}
      <div className="relative w-full sm:w-56">
        <LuUserCog className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" size={16} />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-xs appearance-none cursor-pointer uppercase font-bold"
        >
          <option value="Todos">Todos los roles</option>
          {roles.map((rol) => (
            <option key={rol.id} value={rol.id}>
              {rol.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* SELECT 2: POR ESTADO */}
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

      {/* SELECT 3: POR PUNTO DE VENTA */}
      <div className="relative w-full sm:w-60">
        <LuMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" size={16} />
        <select
          value={puntoFilter}
          onChange={(e) => setPuntoFilter(e.target.value)}
          className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-xs appearance-none cursor-pointer uppercase font-bold"
        >
          <option value="Todos">Todos los puntos</option>
          {puntosVenta.map((punto) => (
            <option key={punto.id} value={punto.id}>
              {punto.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="ml-auto px-2 hidden lg:block">
        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
          {filteredUsers.length} Usuarios Filtrados
        </span>
      </div>
    </motion.div>
  )
}

export default UsuarioFilters
