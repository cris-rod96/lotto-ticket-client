import { useEffect, useState } from 'react'
import { LuCircleCheck, LuDollarSign, LuStore, LuX } from 'react-icons/lu'

const ModalPagoTicket = ({ isOpen, onClose, ticket, puntosVenta, onConfirm }) => {
  const [puntoVentaId, setPuntoVentaId] = useState('')
  const [cajaId, setCajaId] = useState('')
  const [cajasDisponibles, setCajasDisponibles] = useState([])

  // Al abrir el modal, pre-seleccionamos el PV donde se vendió el ticket
  useEffect(() => {
    if (ticket) {
      setPuntoVentaId(ticket.PuntoVentaId)
    }
  }, [ticket])

  // Aquí filtrarías las cajas según el Punto de Venta seleccionado
  useEffect(() => {
    console.log(puntosVenta)
    if (puntoVentaId) {
      // Supongamos que tus puntos de venta traen sus cajas o las buscas de tu estado global
      const pv = puntosVenta.find((p) => p.id === puntoVentaId)
      setCajasDisponibles(pv?.Cajas?.filter((c) => c.estado === 'Abierta') || [])
    }
  }, [puntoVentaId, puntosVenta])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1a1f1e] border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-white font-black italic text-xl uppercase italic">Procesar Pago</h3>
            <p className="text-zinc-500 text-xs font-bold uppercase mt-1">
              Ticket: #{ticket.codigo}
            </p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <LuX size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Info del Premio */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex justify-between items-center">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
              Total a Pagar
            </span>
            <span className="text-2xl font-black text-white italic">
              ${parseFloat(ticket.montoTotalPremio).toFixed(2)}
            </span>
          </div>

          {/* Selección de Punto de Venta */}
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 mb-2 block">
              Punto de Venta Origen
            </label>
            <div className="relative">
              <LuStore className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" />
              <select
                value={puntoVentaId}
                onChange={(e) => setPuntoVentaId(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-luck-gold/50 appearance-none"
              >
                {puntosVenta.map((pv) => (
                  <option key={pv.id} value={pv.id}>
                    {pv.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selección de Caja */}
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 mb-2 block">
              Seleccionar Caja Abierta
            </label>
            <div className="relative">
              <LuDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" />
              <select
                value={cajaId}
                onChange={(e) => setCajaId(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-luck-gold/50 appearance-none"
              >
                <option value="">Seleccione una caja...</option>
                {cajasDisponibles.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} (Saldo: ${c.saldoActual})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            disabled={!cajaId}
            onClick={() => onConfirm(ticket.id, puntoVentaId, cajaId)}
            className="w-full bg-luck-gold disabled:opacity-30 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 uppercase text-xs italic transition-all hover:scale-[1.02]"
          >
            <LuCircleCheck size={18} strokeWidth={3} /> Confirmar Desembolso
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalPagoTicket
