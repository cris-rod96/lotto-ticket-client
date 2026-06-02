import usePaginationWindow from '@/hooks/usePaginationWindow'
import { AnimatePresence } from 'framer-motion'
import { LuChevronLeft, LuChevronRight, LuImage, LuInbox, LuTrophy } from 'react-icons/lu'

const ResultadoVendedorTable = ({
  currentData,
  loading,
  handlePrepareFlyer,
  totalPages,
  currentPage,
  setCurrentPage,
}) => {
  const pageNumbers = usePaginationWindow(currentPage, totalPages)

  return (
    <div className="bg-[#111615] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col min-h-[600px]">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] text-zinc-400 uppercase text-[10px] font-black tracking-[0.2em]">
              <th className="p-6">Sorteo</th>
              <th className="p-6">Fecha / Hora</th>
              <th className="p-6">Ventas</th>
              <th className="p-6">Total Premios</th>
              <th className="p-6">Monto por Pagar</th>
              <th className="p-6">Utilidad</th>
              <th className="p-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            <AnimatePresence mode="wait">
              {loading ? (
                <tr key="loading">
                  <td
                    colSpan="7"
                    className="p-32 text-center text-zinc-500 font-black tracking-[0.2em]"
                  >
                    <div className="flex flex-col items-center justify-center min-h-[300px]">
                      CARGANDO DATOS...
                    </div>
                  </td>
                </tr>
              ) : currentData && currentData.length > 0 ? (
                currentData.map((res) => {
                  const sorteo = res?.Sorteo || {}
                  const cat = sorteo?.Catalogo || {}
                  const cifra = sorteo?.Cifra || {} // Accedemos a la cifra aquí

                  // Cálculo de Utilidad
                  const ventas = parseFloat(res.totalVentas || 0)
                  const premios = parseFloat(res.totalPremios || 0)
                  const utilidad = ventas - premios

                  return (
                    <tr key={res.id} className="hover:bg-white/[0.01]">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-luck-gold/10 flex items-center justify-center text-luck-gold border border-luck-gold/20">
                            <LuTrophy size={20} />
                          </div>
                          <div>
                            <p className="text-white font-bold">{cat.nombre || 'N/A'}</p>
                            <p className="text-[10px] text-zinc-500">
                              № {sorteo.numero || '---'} ({cifra.cantidad || 0} cifras)
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 font-bold">
                        {sorteo.fechaSorteo || '---'}
                        <span className="block text-[10px] text-zinc-500">
                          {sorteo.horaSorteo || '---'}
                        </span>
                      </td>
                      <td className="p-6 font-black">${ventas.toFixed(2)}</td>
                      <td className="p-6 text-emerald-400 font-black">${premios.toFixed(2)}</td>
                      <td className="p-6 text-luck-gold font-black">
                        ${parseFloat(res.montoPorPagar || 0).toFixed(2)}
                      </td>

                      {/* Celda de Utilidad */}
                      <td
                        className={`p-6 font-black ${
                          utilidad > 0
                            ? 'text-emerald-500'
                            : utilidad < 0
                              ? 'text-rose-500'
                              : 'text-zinc-500'
                        }`}
                      >
                        ${utilidad.toFixed(2)}
                      </td>

                      <td className="p-6 flex justify-end gap-2">
                        <button
                          onClick={() => handlePrepareFlyer(res)}
                          className="p-3 bg-zinc-900 rounded-xl text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        >
                          <LuImage size={18} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr key="empty">
                  <td colSpan="7" className="h-[400px]">
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <LuInbox size={80} className="mb-4 text-luck-gold opacity-30" />
                      <p className="text-sm font-black uppercase tracking-[0.4em] text-white opacity-40">
                        No hay registros
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Paginación... */}
      {totalPages > 1 && (
        <div className="mt-auto p-6 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex items-center gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2.5 bg-zinc-900 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-20"
            >
              <LuChevronLeft size={20} />
            </button>
            <div className="flex gap-1">
              {pageNumbers.map((page, i) => (
                <button
                  key={i}
                  onClick={() => typeof page === 'number' && setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-[10px] font-black ${currentPage === page ? 'bg-luck-gold text-black' : 'text-zinc-500 hover:bg-white/5'}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2.5 bg-zinc-900 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-20"
            >
              <LuChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResultadoVendedorTable
