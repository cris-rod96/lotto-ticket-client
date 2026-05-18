import { LuDollarSign, LuGhost, LuPrinter, LuTicket, LuTrophy, LuX } from 'react-icons/lu'

const DetalleResultadoModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null

  // 1. Agrupamos los ganadores por Ticket ID usando la estructura real del objeto
  const ticketsGanadoresMap = data.DetallesResultados?.reduce((acc, det) => {
    det.Ganadores?.forEach((g) => {
      const ticketId = g.Ticket?.id
      if (!ticketId) return

      if (!acc[ticketId]) {
        acc[ticketId] = {
          info: g.Ticket, // Aquí vienen los DetallesTickets con numeroJugad y montoAposta
          suertesGanadas: [],
          totalTicket: 0,
        }
      }
      acc[ticketId].suertesGanadas.push({
        nombreSuerte: det.Suerte?.descripcion,
        numeroGanadorSuerte: det.numeroGanador,
        montoPremio: parseFloat(g.montoPremio),
      })
      acc[ticketId].totalTicket += parseFloat(g.montoPremio)
    })
    return acc
  }, {})

  const ticketsAgrupados = Object.values(ticketsGanadoresMap || {})
  const totalSorteo = ticketsAgrupados.reduce((sum, t) => sum + t.totalTicket, 0)
  const hayGanadores = ticketsAgrupados.length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-[#0f1211] border border-white/10 w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
              <LuTrophy className="text-luck-gold" size={28} /> Auditoría de Premios
            </h2>
            <p className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.2em] mt-1">
              {data.Sorteo?.Catalogo?.nombre} • № {data.Sorteo?.numero} • {data.Sorteo?.fechaSorteo}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-zinc-600 transition-colors"
          >
            <LuX size={32} />
          </button>
        </div>

        {/* Contenido principal */}
        <div className="p-8 overflow-y-auto flex-1 bg-[#0a0c0b] space-y-6">
          {hayGanadores ? (
            ticketsAgrupados.map((ticket, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/20 border border-white/5 rounded-3xl overflow-hidden"
              >
                {/* Cabecera del Ticket */}
                <div className="p-6 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-luck-gold/10 rounded-2xl border border-luck-gold/20">
                      <LuTicket className="text-luck-gold" size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 font-black uppercase block">
                        Ticket ID
                      </span>
                      <span className="text-white font-mono font-bold text-xl tracking-[0.2em]">
                        {ticket.info?.codigo}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-luck-gold font-black uppercase block italic">
                      Total Ganado
                    </span>
                    <span className="text-luck-gold font-black text-4xl tracking-tighter">
                      ${ticket.totalTicket.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Lista de Suertes que ganó este ticket */}
                  <div className="flex flex-wrap gap-3">
                    {ticket.suertesGanadas.map((sg, sgIdx) => (
                      <div
                        key={sgIdx}
                        className="bg-black/40 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3"
                      >
                        <div className="flex flex-col">
                          <span className="text-[8px] text-zinc-500 font-black uppercase">
                            {sg.nombreSuerte}
                          </span>
                          <span className="text-sm font-black text-white">
                            № {sg.numeroGanadorSuerte}
                          </span>
                        </div>
                        <div className="w-px h-6 bg-white/10" />
                        <span className="text-luck-gold font-black text-lg">
                          ${sg.montoPremio.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Detalle de todos los números que el cliente jugó en ese ticket */}
                  <div className="bg-black/60 p-5 rounded-2xl border border-white/5">
                    <span className="text-[10px] text-zinc-500 font-black uppercase block mb-4 tracking-widest">
                      Contenido Jugado (Ticket Completo)
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                      {ticket.info?.DetallesTickets?.map((jugada, jIdx) => {
                        // Verificamos si este número específico fue uno de los ganadores
                        const esGanador = ticket.suertesGanadas.some(
                          (sg) => sg.numeroGanadorSuerte === jugada.numeroJugad
                        )
                        return (
                          <div
                            key={jIdx}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                              esGanador
                                ? 'bg-luck-gold border-luck-gold shadow-lg shadow-luck-gold/20'
                                : 'bg-zinc-900/40 border-white/10'
                            }`}
                          >
                            <span
                              className={`text-xl font-mono font-black ${esGanador ? 'text-black' : 'text-zinc-200'}`}
                            >
                              {jugada.numeroJugad}
                            </span>
                            <span
                              className={`text-[9px] font-black mt-1 ${esGanador ? 'text-black/60' : 'text-zinc-500'}`}
                            >
                              ${parseFloat(jugada.montoAposta || 0).toFixed(2)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Mensaje cuando no hay ganadores */
            <div className="h-full flex flex-col items-center justify-center py-20 text-center">
              <div className="relative mb-6">
                <LuTrophy className="text-white/5" size={160} />
                <LuGhost
                  className="text-zinc-700 absolute bottom-4 right-4 animate-bounce"
                  size={48}
                />
              </div>
              <h3 className="text-white font-black text-xl uppercase italic tracking-tighter">
                Sin Ganadores Registrados
              </h3>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2 max-w-xs mx-auto">
                No se encontraron tickets premiados para los resultados de este sorteo.
              </p>
            </div>
          )}
        </div>

        {/* Footer con Total General */}
        <div className="p-8 bg-[#070908] border-t border-white/10 flex justify-between items-center">
          <div>
            <span className="text-[11px] text-zinc-500 font-black uppercase tracking-widest">
              Premios a Pagar
            </span>
            <div className="flex items-center gap-2 mt-1">
              <LuDollarSign className="text-luck-gold" size={28} />
              <span className="text-5xl font-black text-luck-gold tracking-tighter">
                {totalSorteo.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex gap-4">
            {hayGanadores && (
              <button
                onClick={() => window.print()}
                className="px-8 py-4 border border-white/10 text-zinc-400 font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-white/5 transition-all flex items-center gap-2"
              >
                <LuPrinter size={20} /> Imprimir
              </button>
            )}
            <button
              onClick={onClose}
              className="px-12 py-4 bg-white text-black font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-luck-gold transition-all active:scale-95 shadow-xl shadow-white/5"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetalleResultadoModal
