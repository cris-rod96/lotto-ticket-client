import { motion } from 'framer-motion'
import { LuCalendar, LuX } from 'react-icons/lu'

const RespaldoFilters = ({ filterDate, setFilterDate, totalItems }) => {
  return (
    <motion.div className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-8 flex justify-between items-center gap-4">
      <div className="flex items-center gap-3 w-full max-w-md">
        {/* Contenedor del Selector de Fecha */}
        <div className="relative w-full max-w-[180px]">
          <LuCalendar
            className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold pointer-events-none z-10"
            size={16}
          />
          <input
            type="date"
            onClick={(e) => e.target.showPicker?.()}
            className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-luck-gold/50 text-xs transition-all scheme-dark cursor-pointer font-mono 
            [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>

        {/* Botón Limpiar estilizado */}
        {filterDate && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={() => setFilterDate('')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-luck-gold/10 border border-white/5 hover:border-luck-gold/20 rounded-xl text-[10px] font-black text-luck-gold hover:text-white uppercase tracking-widest transition-all"
          >
            <LuX size={12} strokeWidth={3} />
            Limpiar
          </motion.button>
        )}
      </div>

      {/* Contador de registros (AHORA DINÁMICO DEL SERVIDOR) */}
      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-4 whitespace-nowrap">
        {totalItems} {totalItems === 1 ? 'Respaldo encontrado' : 'Respaldos encontrados'}
      </span>
    </motion.div>
  )
}

export default RespaldoFilters
