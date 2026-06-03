import {
  LuChevronLeft,
  LuChevronRight,
  LuCircleAlert,
  LuHistory,
  LuTrendingDown,
  LuTrendingUp,
} from 'react-icons/lu'

const CajasVendedorTable = ({
  data,
  currentPage,
  totalPages,
  onPageChange,
  formatter,
  tipoVista,
  soloMisMovimientos,
  setSoloMisMovimientos,
  userId,
  onSelectCaja,
}) => {
  const esMovimientos = tipoVista === 'movimientos'
  const tieneDatos = data && data.length > 0

  return (
    <div className="bg-[#111615] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
      {/* Header Compacto */}
      <div className="px-6 py-4 border-b border-white/5 bg-black/20 flex justify-between items-center">
        <div>
          <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
            <LuHistory size={14} className="text-luck-gold" />
            {esMovimientos ? 'Registro de Operaciones' : 'Historial de Cajas'}
          </h3>
        </div>

        <div className="flex items-center gap-4">
          {esMovimientos && (
            <button
              onClick={() => setSoloMisMovimientos(!soloMisMovimientos)}
              className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase transition-all ${
                soloMisMovimientos
                  ? 'bg-luck-gold/10 border-luck-gold/30 text-luck-gold'
                  : 'border-white/5 text-zinc-500'
              }`}
            >
              {soloMisMovimientos ? 'Solo Mío' : 'Todo'}
            </button>
          )}

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 disabled:opacity-20"
              >
                <LuChevronLeft size={14} />
              </button>
              <span className="text-[9px] font-black text-white px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 disabled:opacity-20"
              >
                <LuChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabla Compacta */}
      {tieneDatos ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[8px] text-zinc-600 uppercase tracking-widest bg-black/30">
                <th className="p-4 pl-6">Fecha</th>
                <th className="p-4">Operación</th>
                <th className="p-4 text-center">Responsable</th>
                <th className="p-4">Descripción</th>
                <th className="p-4 text-right pr-6">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {data.map((item) => {
                const isIngreso = item.tipo === 'Ingreso'
                const esMio = item.UsuarioId === userId
                return (
                  <tr
                    key={item.id}
                    onClick={() => !esMovimientos && onSelectCaja(item)}
                    className={`group hover:bg-white/[0.02] ${!esMovimientos ? 'cursor-pointer' : ''}`}
                  >
                    <td className="p-4 pl-6">
                      <span className="text-white font-bold text-[10px] block">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-[8px] text-zinc-600 font-bold">
                        {new Date(item.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                    <td className="p-4">
                      <div
                        className={`flex items-center gap-2 text-[10px] font-bold uppercase ${isIngreso ? 'text-emerald-500' : 'text-red-500'}`}
                      >
                        {esMovimientos ? (
                          isIngreso ? (
                            <LuTrendingUp size={12} />
                          ) : (
                            <LuTrendingDown size={12} />
                          )
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-luck-gold" />
                        )}
                        {esMovimientos ? item.categoria : item.estado}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black uppercase ${esMio ? 'bg-luck-gold/10 text-luck-gold' : 'bg-white/5 text-zinc-500'}`}
                      >
                        {item.Usuario?.nombresCompletos || 'Sistema'}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-400 text-[10px] italic max-w-[150px] truncate">
                      {esMovimientos ? item.descripcion : `Caja #${item.id.slice(0, 4)}`}
                    </td>
                    <td
                      className={`p-4 text-right pr-6 font-mono text-[11px] font-bold ${esMovimientos ? (isIngreso ? 'text-emerald-500' : 'text-red-500') : 'text-white'}`}
                    >
                      {esMovimientos && (isIngreso ? '+' : '-')}{' '}
                      {formatter.format(parseFloat(item.monto || item.saldoActual || 0))}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center text-zinc-600">
          <LuCircleAlert size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-[9px] uppercase font-bold tracking-widest">
            Sin registros encontrados
          </p>
        </div>
      )}
    </div>
  )
}

export default CajasVendedorTable
