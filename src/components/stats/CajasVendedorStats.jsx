import { LuUser, LuWallet } from 'react-icons/lu'

const CajasVendedorStats = ({ user, isCajaAbierta, caja, formatter }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      {/* Vendedor */}
      <div className="bg-[#111615] border border-white/5 p-8 rounded-[2.5rem] shadow-xl flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-luck-gold/10 flex items-center justify-center text-luck-gold border border-luck-gold/10">
          <LuUser size={32} />
        </div>
        <div>
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">
            Vendedor Asignado
          </span>
          <p className="text-white font-black text-xl uppercase tracking-tight">
            {user?.nombresCompletos || 'Usuario en Turno'}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`w-2 h-2 rounded-full ${isCajaAbierta ? 'bg-green-500 animate-pulse' : 'bg-zinc-700'}`}
            />
            <span className="text-[10px] text-luck-gold font-bold uppercase tracking-widest italic">
              {isCajaAbierta ? 'Punto de Venta Activo' : 'Sesión Finalizada'}
            </span>
          </div>
        </div>
      </div>

      {/* Saldo */}
      <div className="bg-[#111615] border border-white/5 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <LuWallet size={120} className="text-luck-gold" />
        </div>
        <span className="text-[10px] font-black text-luck-gold uppercase tracking-widest block mb-2">
          Efectivo Disponible en Caja
        </span>
        <p className="text-4xl font-mono font-black text-white tracking-tighter">
          {formatter.format(caja?.saldoActual || 0)}
        </p>
        <div className="flex gap-6 mt-4 pt-4 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[8px] text-zinc-600 font-black uppercase">Monto Apertura</span>
            <span className="text-xs text-zinc-400 font-mono font-bold">
              {formatter.format(caja?.montoApertura || 0)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-zinc-600 font-black uppercase">Inyecciones Hoy</span>
            <span className="text-xs text-green-500 font-mono font-bold">
              +{formatter.format(caja?.totalInyecciones || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CajasVendedorStats
