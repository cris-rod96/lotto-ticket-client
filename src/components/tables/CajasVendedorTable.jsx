import {
  LuChevronLeft,
  LuChevronRight,
  LuCircleAlert,
  LuHistory,
  LuTrendingDown,
  LuTrendingUp,
  LuUser,
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
    <div className="bg-[#111615] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
      {/* Header de la Tabla */}
      <div className="p-8 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
        <div>
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
            <LuHistory size={16} className="text-luck-gold" />
            {esMovimientos ? 'Registro de Operaciones' : 'Historial de Cajas'}
          </h3>
          <p className="text-[9px] text-zinc-500 uppercase font-bold mt-1 tracking-widest">
            {esMovimientos
              ? 'Detalle de entradas y salidas de efectivo'
              : 'Listado de sesiones registradas'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {esMovimientos && (
            <button
              onClick={() => setSoloMisMovimientos(!soloMisMovimientos)}
              className={`px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                soloMisMovimientos
                  ? 'bg-luck-gold/10 border-luck-gold/30 text-luck-gold'
                  : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              {soloMisMovimientos ? 'Viendo: Solo Mío' : 'Viendo: Todo'}
            </button>
          )}

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="p-2 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-20 transition-all"
              >
                <LuChevronLeft size={16} />
              </button>
              <span className="text-[10px] font-black text-white px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="p-2 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-20 transition-all"
              >
                <LuChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabla */}
      {tieneDatos ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-zinc-500 uppercase text-[9px] font-black tracking-[0.2em] bg-zinc-900/50">
                <th className="p-6 pl-10">Fecha / Hora</th>
                <th className="p-6">Operación</th>
                <th className="p-6 text-center">Responsable</th>
                <th className="p-6">Descripción</th>
                <th className="p-6 text-right pr-10">Monto</th>
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
                    className={`group hover:bg-white/[0.02] transition-colors ${!esMovimientos ? 'cursor-pointer' : ''}`}
                  >
                    <td className="p-6 pl-10">
                      <span className="text-white font-bold text-sm block">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">
                        {new Date(item.createdAt).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="p-6">
                      <div
                        className={`flex items-center gap-2 font-black text-[10px] uppercase ${isIngreso ? 'text-emerald-500' : 'text-red-500'}`}
                      >
                        {esMovimientos ? (
                          isIngreso ? (
                            <LuTrendingUp size={14} />
                          ) : (
                            <LuTrendingDown size={14} />
                          )
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-luck-gold" />
                        )}
                        {esMovimientos ? item.categoria : item.estado}
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[9px] font-black uppercase ${esMio ? 'bg-luck-gold/10 text-luck-gold' : 'bg-white/5 text-zinc-500'}`}
                      >
                        <LuUser size={10} /> {item.Usuario?.nombresCompletos || 'Sistema'}
                      </span>
                    </td>
                    <td className="p-6 text-zinc-400 text-[11px] italic max-w-[200px] truncate">
                      {esMovimientos ? item.descripcion : `Caja: ${item.id.slice(0, 8)}`}
                    </td>
                    <td
                      className={`p-6 text-right pr-10 font-mono font-bold text-sm ${esMovimientos ? (isIngreso ? 'text-emerald-500' : 'text-red-500') : 'text-white'}`}
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
        <div className="p-20 flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-zinc-900 rounded-2xl mb-4 text-zinc-600 border border-white/5">
            <LuCircleAlert size={28} />
          </div>
          <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">
            Sin registros encontrados
          </h4>
        </div>
      )}
    </div>
  )
}

export default CajasVendedorTable
