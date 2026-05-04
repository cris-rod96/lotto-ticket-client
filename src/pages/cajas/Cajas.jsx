import CajaOperacionesModal from '@/components/CajaOperacionesModal' // Usando tu componente Modal corregido
import Title from '@/components/Titlte'
import { useState } from 'react'
import { LuArrowUpRight, LuCircleX, LuHistory, LuPlus, LuUser, LuWallet } from 'react-icons/lu'

const Cajas = () => {
  const [modalType, setModalType] = useState(null) // 'abrir', 'cerrar', 'inyectar'

  // Datos de ejemplo basados en tu modelo de Sequelize
  const [cajaActiva] = useState({
    id: '1',
    usuario: 'Administrador',
    puntoVenta: 'Matriz Principal',
    montoApertura: 150.0,
    saldoActual: 1240.5,
    totalInyecciones: 200.0,
    estado: 'Abierta',
  })

  return (
    <div className="w-full pb-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end mb-10">
        <Title
          titulo="CONTROL DE CAJAS"
          descripcion="SUPERVISIÓN FINANCIERA Y FLUJO DE EFECTIVO EN TIEMPO REAL"
        />
        <div className="flex gap-3">
          <button
            onClick={() => setModalType('inyectar')}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-black py-3 px-6 rounded-2xl flex items-center gap-2 transition-all active:scale-95 uppercase text-[10px] tracking-widest border border-white/5"
          >
            <LuPlus className="text-luck-gold" size={18} /> Inyectar Dinero
          </button>
          <button
            onClick={() => setModalType('cerrar')}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black py-3 px-6 rounded-2xl flex items-center gap-2 transition-all active:scale-95 uppercase text-[10px] tracking-widest border border-red-500/20"
          >
            <LuCircleX size={18} /> Cerrar Caja
          </button>
        </div>
      </div>

      {/* Widget de Estado de Caja Actual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#111615] border border-white/5 p-6 rounded-[2rem] shadow-xl">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-4">
            Información del Turno
          </span>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-luck-gold/10 flex items-center justify-center text-luck-gold border border-luck-gold/10">
              <LuUser size={24} />
            </div>
            <div>
              <p className="text-white font-bold text-sm uppercase">Carlos Vera</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">
                Punto: Matriz GYE
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#111615] border border-white/5 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <LuWallet size={80} className="text-luck-gold" />
          </div>
          <span className="text-[10px] font-black text-luck-gold uppercase tracking-widest block mb-4">
            Saldo Actual en Efectivo
          </span>
          <p className="text-3xl font-mono font-black text-white tracking-tighter">$1,240.50</p>
          <span className="text-[9px] text-zinc-600 font-bold uppercase mt-2 block">
            Base: $150.00 | Inyecciones: $200.00
          </span>
        </div>

        <div className="bg-luck-gold p-6 rounded-[2rem] shadow-lg shadow-luck-gold/10 flex flex-col justify-center items-center group cursor-pointer hover:bg-yellow-600 transition-all">
          <LuArrowUpRight
            size={32}
            className="text-black mb-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
          />
          <span className="text-black font-black text-xs uppercase tracking-[0.2em]">
            Ver Movimientos
          </span>
        </div>
      </div>

      {/* Historial de Cajas - Estilo Cifras */}
      <div className="bg-[#111615] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <LuHistory size={16} className="text-luck-gold" /> Historial de Sesiones
          </h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-zinc-500 uppercase text-[9px] font-black tracking-[0.2em]">
              <th className="p-6 pl-10">Fecha / N°</th>
              <th className="p-6">Apertura</th>
              <th className="p-6">Cierre</th>
              <th className="p-6">Diferencia</th>
              <th className="p-6 text-right pr-10">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {[1, 2].map((i) => (
              <tr key={i} className="group hover:bg-white/[0.01] transition-colors">
                <td className="p-6 pl-10">
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm">04 MAY 2026</span>
                    <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">
                      Caja #30{i}
                    </span>
                  </div>
                </td>
                <td className="p-6 text-zinc-400 font-mono text-sm font-bold">$150.00</td>
                <td className="p-6 text-zinc-400 font-mono text-sm font-bold">$1,450.00</td>
                <td className="p-6">
                  <span className="text-green-500 font-mono font-black text-xs">+$0.00</span>
                </td>
                <td className="p-6 text-right pr-10">
                  <button className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold transition-all">
                    <LuHistory size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modales Dinámicos */}
      {modalType && <CajaOperacionesModal type={modalType} onClose={() => setModalType(null)} />}
    </div>
  )
}

export default Cajas
