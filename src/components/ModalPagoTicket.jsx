import { useEffect, useState } from 'react'
import {
  LuCircleCheck,
  LuDollarSign,
  LuLoader,
  LuStore,
  LuTriangleAlert,
  LuX,
} from 'react-icons/lu'

const ModalPagoTicket = ({
  isOpen,
  onClose,
  ticket,
  puntosVenta,
  onConfirm,
  handlePrintComprobante,
}) => {
  const [puntoVentaId, setPuntoVentaId] = useState('')
  const [cajaId, setCajaId] = useState('')
  const [cajasDisponibles, setCajasDisponibles] = useState([])
  const [loading, setLoading] = useState(false)

  // 1. Al abrir el modal, pre-seleccionamos y fijamos estrictamente el PV del ticket
  useEffect(() => {
    if (ticket?.PuntoVentaId) {
      setPuntoVentaId(ticket.PuntoVentaId)
      setCajaId('') // Reseteamos la caja seleccionada por si cambia de ticket
    }
  }, [ticket])

  // 2. Filtrar automáticamente las cajas abiertas de ese Punto de Venta específico (UUIDv4 Strings)
  useEffect(() => {
    if (puntoVentaId && puntosVenta.length > 0) {
      // Comparación directa de strings para UUIDv4
      const pv = puntosVenta.find((p) => p.id === puntoVentaId)
      const cajasAbiertas = pv?.Cajas?.filter((c) => c.estado === 'Abierta') || []

      setCajasDisponibles(cajasAbiertas)

      // Si solo hay una caja abierta, la auto-seleccionamos para ahorrar clicks
      if (cajasAbiertas.length === 1) {
        setCajaId(cajasAbiertas[0].id)
      }
    } else {
      setCajasDisponibles([])
    }
  }, [puntoVentaId, puntosVenta])

  const handleExecutePayment = async () => {
    if (!cajaId || !puntoVentaId || !ticket?.id) return

    setLoading(true)
    try {
      const data = await onConfirm(ticket.id, puntoVentaId, cajaId)

      // Si el pago se procesó bien y retorna el ticket, disparamos la impresión
      if (data && data.ticket) {
        await handlePrintComprobante(data.ticket)
      }
    } catch (err) {
      console.error('Error en el flujo de confirmación e impresión:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1a1f1e] border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-white font-black italic text-xl uppercase">Procesar Pago</h3>
            <p className="text-zinc-500 text-xs font-bold uppercase mt-1">
              Ticket: #{ticket.codigo}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-zinc-500 hover:text-white disabled:opacity-20"
          >
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

          {/* Selección de Punto de Venta (DESHABILITADO / FIJO) */}
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 mb-2 block tracking-wider">
              Punto de Venta Origen (Automático)
            </label>
            <div className="relative opacity-60">
              <LuStore className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" />
              <select
                disabled={true}
                value={puntoVentaId}
                className="w-full bg-black/60 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-zinc-400 text-sm font-bold focus:outline-none appearance-none cursor-not-allowed uppercase"
              >
                {puntosVenta.map((pv) => (
                  <option key={pv.id} value={pv.id}>
                    {pv.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selección de Caja Abierta */}
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 mb-2 block tracking-wider">
              Seleccionar Caja Abierta
            </label>
            <div className="relative">
              <LuDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" />
              <select
                disabled={loading || cajasDisponibles.length === 0}
                value={cajaId}
                onChange={(e) => setCajaId(e.target.value)}
                className={`w-full bg-black/40 border rounded-xl py-3 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-luck-gold/50 appearance-none cursor-pointer ${
                  cajasDisponibles.length === 0
                    ? 'border-red-500/30 text-red-400'
                    : 'border-white/10'
                }`}
              >
                {cajasDisponibles.length === 0 ? (
                  <option value="">No hay cajas disponibles</option>
                ) : (
                  <>
                    <option value="">Seleccione una caja...</option>
                    {cajasDisponibles.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} (Saldo: ${c.saldoActual})
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            {/* ALERTA DE CAJAS NO DISPONIBLES */}
            {cajasDisponibles.length === 0 && (
              <div className="mt-2.5 flex items-start gap-2 bg-red-500/5 border border-red-500/10 rounded-xl p-3">
                <LuTriangleAlert className="text-red-500 shrink-0 mt-0.5" size={14} />
                <p className="text-[10px] text-red-400 font-bold uppercase tracking-wide leading-relaxed">
                  Atención: Esta sucursal no tiene ninguna caja abierta en este turno. Abre una caja
                  en este punto antes de liquidar el premio.
                </p>
              </div>
            )}
          </div>

          {/* Botón de Acción Principal */}
          <button
            disabled={!cajaId || loading || cajasDisponibles.length === 0}
            onClick={handleExecutePayment}
            className="w-full bg-luck-gold disabled:opacity-20 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 uppercase text-xs italic transition-all hover:enabled:scale-[1.02]"
          >
            {loading ? (
              <LuLoader className="animate-spin" size={18} />
            ) : (
              <LuCircleCheck size={18} strokeWidth={3} />
            )}
            {loading ? 'Procesando...' : 'Confirmar Desembolso'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalPagoTicket
