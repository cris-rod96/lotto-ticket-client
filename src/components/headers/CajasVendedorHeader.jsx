import Title from '@/components/Titlte'
import { motion } from 'framer-motion'
import { LuCalendar, LuStore } from 'react-icons/lu'

const CajasVendedorHeader = ({
  usuario,
  filtroVista,
  setFiltroVista,
  fechas,
  setFechas,
  onFiltrar,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-8 shadow-xl flex flex-wrap justify-between items-center gap-4"
    >
      {/* Título */}
      <Title titulo="MI TERMINAL" descripcion="RESUMEN DE OPERACIONES Y CONTROL DE VENTAS" />

      {/* Contenedor de Filtros Unificado */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Inputs de Fecha Estilizados */}
        <div className="relative w-36">
          <LuCalendar
            className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold"
            size={16}
          />
          <input
            type="date"
            value={fechas?.desde || ''}
            onChange={(e) => setFechas((prev) => ({ ...prev, desde: e.target.value }))}
            className="w-full bg-[#1a1f1e] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white text-[11px] font-bold uppercase cursor-pointer outline-none focus:border-luck-gold/50 transition-all custom-date-input"
          />
        </div>

        <div className="relative w-36">
          <LuCalendar
            className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold"
            size={16}
          />
          <input
            type="date"
            value={fechas?.hasta || ''}
            onChange={(e) => setFechas((prev) => ({ ...prev, hasta: e.target.value }))}
            className="w-full bg-[#1a1f1e] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white text-[11px] font-bold uppercase cursor-pointer outline-none focus:border-luck-gold/50 transition-all custom-date-input"
          />
        </div>

        {/* Botón Filtrar */}
        <button
          onClick={onFiltrar}
          className="bg-luck-gold/10 border border-luck-gold/20 text-luck-gold hover:bg-luck-gold hover:text-black transition-all rounded-2xl px-6 py-3.5 text-[11px] font-black uppercase tracking-widest"
        >
          Filtrar
        </button>

        {/* Info Sucursal */}
        <div className="flex items-center gap-2 px-4 py-3.5 bg-[#1a1f1e] rounded-2xl border border-white/5">
          <LuStore size={16} className="text-luck-gold" />
          <span className="text-[11px] font-black text-white uppercase">
            {usuario?.PuntoVenta?.nombre || 'SUCURSAL'}
          </span>
        </div>

        {/* Switch Vista */}
        <div className="flex bg-[#0c0d0d] p-1 rounded-2xl border border-white/5">
          <button
            onClick={() => setFiltroVista('cajas')}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
              filtroVista === 'cajas' ? 'bg-luck-gold text-black' : 'text-zinc-500 hover:text-white'
            }`}
          >
            Historial
          </button>
          <button
            onClick={() => setFiltroVista('movimientos')}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
              filtroVista === 'movimientos'
                ? 'bg-luck-gold text-black'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            Ventas
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default CajasVendedorHeader
