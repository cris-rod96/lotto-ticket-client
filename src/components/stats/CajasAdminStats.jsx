import { LuUser, LuWallet } from 'react-icons/lu'

const CajasAdminStats = ({ caja, esCajaAbierta, formatter }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      <div className="bg-[#111615] border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-6 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-luck-gold/10 flex items-center justify-center text-luck-gold border border-luck-gold/10">
          <LuUser size={32} />
        </div>
        <div>
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">
            Cajero Asignado
          </span>
          <p className="text-white font-black text-xl uppercase tracking-tight">
            {caja?.Usuario?.nombresCompletos || 'SIN SESIÓN ACTIVA'}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`w-2 h-2 rounded-full ${esCajaAbierta ? 'bg-green-500 animate-pulse' : 'bg-zinc-700'}`}
            ></span>
            <span className="text-[10px] text-luck-gold font-bold uppercase tracking-widest italic">
              {esCajaAbierta ? 'Punto Operativo' : 'Sucursal Cerrada'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[#111615] border border-white/5 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <LuWallet size={120} className="text-luck-gold" />
        </div>
        <span className="text-[10px] font-black text-luck-gold uppercase tracking-widest block mb-2">
          Efectivo en Caja
        </span>
        <p className="text-4xl font-mono font-black text-white tracking-tighter">
          {formatter.format(caja?.saldoActual || 0)}
        </p>
        <div className="flex gap-6 mt-4 pt-4 border-t border-white/5 text-[9px] font-black uppercase italic text-zinc-500">
          <span>Apertura: {formatter.format(caja?.montoApertura || 0)}</span>
          <span className="text-green-600">
            Inyecciones: {formatter.format(caja?.totalInyecciones || 0)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CajasAdminStats
