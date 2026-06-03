import Title from '@/components/Titlte'
import { LuFilter, LuStore } from 'react-icons/lu'

const CajasVendedorHeader = ({
  usuario,
  filtroVista,
  setFiltroVista,
  fechas,
  setFechas,
  onFiltrar,
}) => {
  return (
    <div className="flex flex-wrap justify-between items-end mb-8 gap-4">
      <Title titulo="MI TERMINAL" descripcion="RESUMEN DE OPERACIONES Y CONTROL DE VENTAS" />

      <div className="flex items-center gap-2 bg-[#0c0d0d] p-1 rounded-2xl border border-white/5 shadow-xl">
        <div className="flex items-center divide-x divide-white/5 px-2">
          <input
            type="date"
            value={fechas?.desde || ''}
            onChange={(e) => setFechas((prev) => ({ ...prev, desde: e.target.value }))}
            className="bg-transparent text-[9px] text-white font-bold p-2 outline-none w-24 uppercase"
          />
          <input
            type="date"
            value={fechas?.hasta || ''}
            onChange={(e) => setFechas((prev) => ({ ...prev, hasta: e.target.value }))}
            className="bg-transparent text-[9px] text-white font-bold p-2 outline-none w-24 uppercase"
          />
          {/* CORRECCIÓN: type="button" explícito */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault() // Detiene cualquier comportamiento por defecto
              onFiltrar()
            }}
            className="p-2 text-luck-gold hover:bg-white/5 rounded-lg transition-all"
          >
            <LuFilter size={14} />
          </button>
        </div>

        <div className="w-px h-6 bg-white/5" />

        <div className="flex items-center gap-2 px-3">
          <LuStore size={14} className="text-luck-gold" />
          <span className="text-[9px] font-black text-white uppercase truncate max-w-[100px]">
            {usuario?.PuntoVenta?.nombre || 'SUCURSAL'}
          </span>
        </div>

        <div className="flex bg-black p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setFiltroVista('cajas')}
            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${
              filtroVista === 'cajas' ? 'bg-luck-gold text-black' : 'text-zinc-600'
            }`}
          >
            Historial
          </button>
          <button
            type="button"
            onClick={() => setFiltroVista('movimientos')}
            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${
              filtroVista === 'movimientos' ? 'bg-luck-gold text-black' : 'text-zinc-600'
            }`}
          >
            Ventas
          </button>
        </div>
      </div>
    </div>
  )
}

export default CajasVendedorHeader
