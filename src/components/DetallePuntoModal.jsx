import { AnimatePresence, motion } from 'framer-motion'
import { LuHash, LuInbox, LuTicket, LuUsers, LuX } from 'react-icons/lu'

const DetallePuntoModal = ({ isOpen, onClose, title, data, type }) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-3xl bg-[#0d1110] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-luck-gold/10 border border-luck-gold/20 flex items-center justify-center text-luck-gold">
                {type === 'usuarios' ? <LuUsers size={24} /> : <LuTicket size={24} />}
              </div>
              <div>
                <h2 className="text-white font-black text-xl uppercase tracking-tight">{title}</h2>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                  {type === 'usuarios' ? 'Personal asignado' : 'Historial de ventas'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/5 rounded-2xl text-zinc-500 transition-colors"
            >
              <LuX size={24} />
            </button>
          </div>

          {/* Body - Scrollable Area */}
          <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {data && data.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                    {type === 'usuarios' ? (
                      <>
                        <th className="p-4">Nombre / Alias</th>
                        <th className="p-4 text-center">Estado</th>
                      </>
                    ) : (
                      <>
                        <th className="p-4">Código</th>
                        <th className="p-4 text-center">Dinero Apostado</th>
                        <th className="p-4 text-center">Resultado</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {data.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                      {type === 'usuarios' ? (
                        <>
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="text-white font-bold text-sm">
                                {item.nombresCompletos}
                              </span>
                              <span className="text-zinc-500 font-mono text-[10px] italic">
                                @{item.alias}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span
                              className={`text-[9px] px-3 py-1 rounded-full font-black uppercase ${
                                item.activo
                                  ? 'text-green-500 bg-green-500/5'
                                  : 'text-red-500 bg-red-500/5'
                              }`}
                            >
                              {item.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <LuHash className="text-luck-gold" size={12} />
                              <span className="text-white font-mono font-bold">{item.codigo}</span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex flex-col items-center">
                              <span className="text-luck-gold font-black italic text-base">
                                ${' '}
                                {item.DetallesTickets?.reduce(
                                  (acc, det) => acc + parseFloat(det.montoApostado),
                                  0
                                ).toFixed(2) || '0.00'}
                              </span>
                              <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-tighter">
                                Total Jugado
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span
                                className={`text-[9px] px-3 py-1 rounded-full font-black uppercase border ${
                                  item.resultado === 'Ganador'
                                    ? 'border-green-500/20 text-green-400 bg-green-500/5'
                                    : item.resultado === 'Pendiente'
                                      ? 'border-zinc-500/20 text-zinc-400 bg-white/5'
                                      : 'border-red-500/20 text-red-400 bg-red-500/5'
                                }`}
                              >
                                {item.resultado}
                              </span>
                              {item.resultado === 'Ganador' && (
                                <span className="text-[10px] text-green-500/80 font-mono font-bold">
                                  Premio: ${item.montoTotalPremio}
                                </span>
                              )}
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-20 text-center opacity-20">
                <LuInbox size={40} className="mx-auto mb-2 text-luck-gold" />
                <p className="text-[10px] font-black uppercase tracking-widest text-white">
                  No hay datos registrados
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-end">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-zinc-900 border border-white/10 rounded-2xl text-white font-black uppercase text-[10px] hover:bg-zinc-800 transition-all"
            >
              Cerrar Vista
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default DetallePuntoModal
