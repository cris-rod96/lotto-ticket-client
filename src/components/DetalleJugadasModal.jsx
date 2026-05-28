import { AnimatePresence, motion } from 'framer-motion'
import { LuSparkles, LuTicket, LuX } from 'react-icons/lu'

const DetalleJugadasModal = ({ isOpen, onClose, ticket }) => {
  if (!isOpen || !ticket) return null

  // Calcular totales rápido
  const totalJugadas = ticket.DetallesTickets?.length || 0
  const montoTotal =
    ticket.DetallesTickets?.reduce((acc, cur) => acc + parseFloat(cur.montoApostado || 0), 0) || 0

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        {/* Fondo interactivo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Contenedor del Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-[#0c0d0d] border border-white/10 w-full max-w-md rounded-[2rem] overflow-hidden flex flex-col shadow-2xl relative z-10"
        >
          {/* HEADER */}
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-luck-gold/10 flex items-center justify-center text-luck-gold border border-luck-gold/20">
                <LuTicket size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase italic tracking-tight">
                  Desglose del Ticket
                </h3>
                <p className="text-luck-gold text-[10px] font-mono tracking-wider uppercase">
                  #{ticket.codigo}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all"
            >
              <LuX size={18} />
            </button>
          </div>

          {/* LISTA DE JUGADAS */}
          <div className="p-6 flex-1 max-h-[40vh] overflow-y-auto space-y-2 custom-scroll-minimal">
            <span className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.2em] block mb-3">
              Números e Inversión
            </span>

            {ticket.DetallesTickets && ticket.DetallesTickets.length > 0 ? (
              ticket.DetallesTickets.map((detalle, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  key={detalle.id || idx}
                  className="flex justify-between items-center bg-[#111615] border border-white/[0.03] p-3.5 rounded-xl hover:border-white/5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-black border border-white/5 flex items-center justify-center text-luck-gold font-black text-base font-mono italic shadow-inner">
                      {detalle.numeroJugado}
                    </div>
                    <div>
                      <p className="text-zinc-500 text-[8px] font-black uppercase tracking-tighter">
                        Línea #{idx + 1}
                      </p>
                      <p className="text-white/80 text-[10px] font-medium flex items-center gap-1">
                        <LuSparkles size={10} className="text-luck-gold/60" /> Jugada Activa
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-white tracking-tight font-mono">
                    ${parseFloat(detalle.montoApostado).toFixed(2)}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-6 text-zinc-600 text-xs italic uppercase font-bold">
                Sin jugadas registradas
              </div>
            )}
          </div>

          {/* FOOTER TOTALES */}
          <div className="p-6 bg-zinc-900/40 border-t border-white/5 rounded-t-[1.5rem] flex justify-between items-center">
            <div>
              <p className="text-zinc-500 text-[8px] font-black uppercase tracking-widest mb-0.5">
                Total Apostado
              </p>
              <p className="text-2xl font-black text-white tracking-tighter italic font-mono">
                ${montoTotal.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <span className="bg-white/5 border border-white/5 text-zinc-400 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider block">
                {totalJugadas} {totalJugadas === 1 ? 'Jugada' : 'Jugadas'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default DetalleJugadasModal
