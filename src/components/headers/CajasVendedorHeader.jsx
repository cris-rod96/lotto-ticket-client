import Title from '@/components/Titlte'
import { LuHistory, LuStore, LuTicket } from 'react-icons/lu'

const CajasVendedorHeader = ({ usuario, filtroVista, setFiltroVista }) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6">
      <div className="w-full lg:w-auto">
        <Title titulo="MI TERMINAL" descripcion="RESUMEN DE OPERACIONES Y CONTROL DE VENTAS" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto items-center">
        {/* Indicador Fijo de Sucursal (Ya no es un select) */}
        <div className="relative min-w-[260px] w-full md:w-auto bg-[#0c0d0d] border border-white/10 py-3.5 pl-12 pr-6 rounded-2xl flex items-center shadow-inner">
          <LuStore className="absolute left-4 text-luck-gold" size={18} />
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">
              Punto de Venta
            </span>
            <span className="text-white text-[10px] font-black uppercase tracking-wider">
              {usuario?.PuntoVenta?.nombre || 'SUCURSAL ASIGNADA'}
            </span>
          </div>
        </div>

        {/* Selector de Vista (Switch) */}
        <div className="flex bg-[#0c0d0d] p-1 rounded-2xl border border-white/5 w-full md:w-auto">
          <button
            onClick={() => setFiltroVista('cajas')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              filtroVista === 'cajas'
                ? 'bg-luck-gold text-black shadow-lg shadow-luck-gold/10'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            <LuHistory size={14} /> Historial
          </button>

          <button
            onClick={() => setFiltroVista('movimientos')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              filtroVista === 'movimientos'
                ? 'bg-luck-gold text-black shadow-lg shadow-luck-gold/10'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            <LuTicket size={14} /> Mis Ventas
          </button>
        </div>
      </div>
    </div>
  )
}

export default CajasVendedorHeader
