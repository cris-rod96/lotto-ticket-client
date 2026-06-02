import { useState } from 'react'
import { LuCircleCheck, LuDollarSign, LuInfo, LuLoader, LuX } from 'react-icons/lu'

const ModalPagoTicketVendedor = ({
  isOpen,
  onClose,
  ticket,
  usuario,
  onConfirm,
  caja,
  handlePrintComprobante,
}) => {
  const [loading, setLoading] = useState(false)

  // Mapa para definir el orden de las suertes
  const ordenSuertes = {
    'PRIMERA SUERTE': 1,
    'SEGUNDA SUERTE': 2,
    'TERCERA SUERTE': 3,
    'CUARTA SUERTE': 4,
    'QUINTA SUERTE': 5,
    'SEXTA SUERTE': 6,
    'SEPTIMA SUERTE': 7,
    'OCTAVA SUERTE': 8,
  }

  // Filtramos jugadas premiadas
  const jugadasGanadoras =
    ticket?.DetallesTickets?.filter((d) => parseFloat(d.montoPremio) > 0) || []

  // Ordenamos usando el mapa
  const jugadasOrdenadas = [...jugadasGanadoras].sort((a, b) => {
    const drA = ticket.Sorteo?.Resultado?.DetallesResultados?.find(
      (d) => d.numeroGanador === a.numeroJugado
    )
    const drB = ticket.Sorteo?.Resultado?.DetallesResultados?.find(
      (d) => d.numeroGanador === b.numeroJugado
    )
    const valA = ordenSuertes[drA?.Suerte?.descripcion] || 99
    const valB = ordenSuertes[drB?.Suerte?.descripcion] || 99
    return valA - valB
  })

  const handleExecutePayment = async () => {
    setLoading(true)
    try {
      const data = await onConfirm(ticket.id, usuario.PuntoVentaId, caja.id)
      if (data && data.ticket) {
        await handlePrintComprobante(data.ticket)
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-[#0c0d0d] border border-white/10 w-full max-w-md rounded-[2.5rem] p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <LuDollarSign size={20} />
            </div>
            <div>
              <h3 className="text-white font-black italic text-lg uppercase tracking-tighter">
                Confirmar Pago
              </h3>
              <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">
                Ticket: #{ticket?.codigo}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <LuX size={24} />
          </button>
        </div>

        {/* Monto Total */}
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] p-5 text-center mb-4">
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] block mb-1">
            Total a entregar
          </span>
          <span className="text-4xl font-black text-white italic tracking-tighter">
            ${parseFloat(ticket?.montoTotalPremio || 0).toFixed(2)}
          </span>
        </div>

        {/* Desglose Scrollable */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <LuInfo size={12} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Desglose detallado:
            </span>
          </div>

          {jugadasOrdenadas.map((jugada, idx) => {
            const dr = ticket.Sorteo?.Resultado?.DetallesResultados?.find(
              (d) => d.numeroGanador === jugada.numeroJugado
            )
            const factor = dr?.Suerte?.DetallesSuertes?.[0]?.prem
              ? parseFloat(dr.Suerte.DetallesSuertes[0].prem)
              : 0
            const nombreSuerte = dr?.Suerte?.descripcion || 'PREMIO'

            return (
              <div
                key={idx}
                className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl flex justify-between items-center hover:bg-white/[0.06] transition-colors"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-black text-white uppercase tracking-wider">
                    {nombreSuerte}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    N° {jugada.numeroJugado} • Apuesta: $
                    {parseFloat(jugada.montoApostado).toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-emerald-500 font-black block">
                    PAGA (x{factor.toFixed(0)})
                  </span>
                  <span className="text-lg font-black text-white italic">
                    ${parseFloat(jugada.montoPremio).toFixed(2)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Botón de Acción */}
        <button
          disabled={!caja?.id || loading}
          onClick={handleExecutePayment}
          className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-30 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 uppercase text-[12px] italic tracking-widest transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)]"
        >
          {loading ? (
            <LuLoader className="animate-spin" size={20} />
          ) : (
            <LuCircleCheck size={20} strokeWidth={3} />
          )}
          {loading ? 'Procesando...' : 'Registrar Desembolso'}
        </button>
      </div>
    </div>
  )
}

export default ModalPagoTicketVendedor
