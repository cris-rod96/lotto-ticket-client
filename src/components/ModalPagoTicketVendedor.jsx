import { cajaAPI } from '@/api/index.api'
import { useEffect, useState } from 'react'
import { LuCircleCheck, LuDollarSign, LuX } from 'react-icons/lu'

const ModalPagoTicketVendedor = ({ isOpen, onClose, ticket, usuario, onConfirm }) => {
  const [caja, setCaja] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && usuario?.PuntoVentaId) {
      setLoading(true)
      // Solo consultamos la caja activa para obtener su ID y procesar el pago
      cajaAPI
        .obtenerCajaAbierta(usuario.PuntoVentaId)
        .then((res) => setCaja(res.data.caja))
        .catch(() => setCaja(null))
        .finally(() => setLoading(false))
    }
  }, [isOpen, usuario])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-[#0c0d0d] border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
        {/* Header simple */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <LuDollarSign size={20} />
            </div>
            <div>
              <h3 className="text-white font-black italic text-xl uppercase tracking-tighter">
                Confirmar Pago
              </h3>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-0.5">
                Ticket: #{ticket?.codigo}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
          >
            <LuX size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Monto del Premio */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] p-6 text-center">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] block mb-2">
              Valor a entregar al cliente
            </span>
            <span className="text-5xl font-black text-white italic tracking-tighter">
              ${parseFloat(ticket?.montoTotalPremio).toFixed(2)}
            </span>
          </div>

          {/* Info del Punto de Venta */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                Sucursal:
              </span>
              <span className="text-[9px] font-black text-luck-gold uppercase italic">
                {usuario?.PuntoVenta?.nombre || 'Terminal Activa'}
              </span>
            </div>
          </div>

          {/* Botón de Acción Directa */}
          <button
            disabled={loading || !caja?.id}
            onClick={() => onConfirm(ticket.id, usuario.PuntoVentaId, caja.id)}
            className="w-full bg-luck-gold hover:bg-yellow-500 disabled:opacity-20 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 uppercase text-[11px] italic tracking-widest transition-all shadow-lg shadow-luck-gold/10 active:scale-95"
          >
            {loading ? (
              <span className="animate-pulse">Sincronizando...</span>
            ) : (
              <>
                <LuCircleCheck size={20} strokeWidth={3} />
                Registrar Desembolso
              </>
            )}
          </button>

          {/* Mensaje de error solo si la base de datos no encuentra caja alguna para esa sucursal */}
          {!caja?.id && !loading && (
            <p className="text-[9px] text-red-500 font-black uppercase text-center">
              Error de sistema: No se detectó una caja activa para este punto.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModalPagoTicketVendedor
