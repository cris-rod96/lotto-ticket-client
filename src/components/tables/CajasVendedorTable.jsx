import { LuFilter, LuHistory, LuTrendingDown, LuTrendingUp, LuUser, LuCircleAlert } from 'react-icons/lu'

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
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-luck-gold/10 rounded-lg text-luck-gold">
            <LuHistory size={16} />
          </div>
          <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
            {esMovimientos ? 'Registros de Operaciones' : 'Historial de Cajas'}
          </h3>
        </div>

        <div className="flex items-center gap-4">
          {/* BOTÓN FILTRO: Engloba tanto Ventas como Pagos */}
          {esMovimientos && (
            <button
              onClick={() => setSoloMisMovimientos(!soloMisMovimientos)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-[9px] font-black uppercase tracking-widest ${soloMisMovimientos
                  ? 'bg-luck-gold border-luck-gold text-black'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                }`}
            >
              <LuFilter size={12} />
              {soloMisMovimientos ? 'Viendo: Mis Operaciones' : 'Viendo: Todo'}
            </button>
          )}

          {/* Paginación simple */}
          <div className="flex items-center gap-2 bg-[#0c0d0d] p-1 rounded-lg border border-white/5">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1 text-zinc-500 hover:text-white disabled:opacity-0"
            >
              <LuHistory className="rotate-180" />
            </button>
            <span className="text-[9px] text-white font-bold px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1 text-zinc-500 hover:text-white disabled:opacity-0"
            >
              <LuHistory />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 px-8 text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">
        <span>Fecha / Hora</span>
        <span>Operación</span>
        <span className="text-center">Responsable</span>
        <span className="text-center">Descripción</span>
        <span className="text-right">Monto</span>
      </div>

      <div className="space-y-2">
        {tieneDatos ? (
          data.map((item) => {
            const isIngreso = item.tipo === 'Ingreso'
            const esMio = item.UsuarioId === userId

            return (
              <div
                key={item.id}
                onClick={() => !esMovimientos && onSelectCaja(item)}
                className={`bg-[#0b0c0c] border p-4 rounded-2xl grid grid-cols-5 items-center transition-all group ${esMovimientos
                    ? 'border-white/5'
                    : 'cursor-pointer hover:border-luck-gold border-white/5'
                  }`}
              >
                <div className="flex flex-col text-xs">
                  <span className="text-white font-bold">
                    {new Date(item.createdAt).toLocaleTimeString()}
                  </span>
                  <span className="text-[8px] text-zinc-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div
                  className={`flex items-center gap-2 ${isIngreso ? 'text-emerald-400' : 'text-red-400'}`}
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
                  <span className="text-[9px] font-black uppercase truncate">
                    {esMovimientos ? item.categoria : item.estado}
                  </span>
                </div>

                <div className="flex justify-center items-center gap-2">
                  <div
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${esMio ? 'bg-luck-gold/10 text-luck-gold' : 'bg-white/5 text-zinc-500'
                      }`}
                  >
                    <LuUser size={10} />
                    <span className="text-[9px] font-black uppercase italic">
                      {esMio ? 'Tú' : item.Usuario?.nombresCompletos?.split(' ')[0] || 'Admin'}
                    </span>
                  </div>
                </div>

                <div className="text-center text-[9px] text-zinc-500 italic truncate px-2">
                  {esMovimientos ? item.descripcion || 'Venta' : `Caja: ${item.id.split('-')[0]}`}
                </div>

                <div className="text-right">
                  <span
                    className={`text-lg font-black italic tracking-tighter ${esMovimientos ? (isIngreso ? 'text-emerald-400' : 'text-red-400') : 'text-white'
                      }`}
                  >
                    {esMovimientos && (isIngreso ? '+' : '-')}
                    {formatter.format(parseFloat(item.monto || item.saldoActual || 0))}
                  </span>
                </div>
              </div>
            )
          })
        ) : (
          /* CONTENEDOR DE ESTADO VACÍO */
          <div className="flex flex-col items-center justify-center bg-[#0b0c0c] border border-white/5 p-12 rounded-2xl text-center space-y-3">
            <div className="p-3 bg-zinc-800/20 rounded-full text-zinc-600">
              <LuCircleAlert size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                {esMovimientos
                  ? soloMisMovimientos
                    ? 'No tienes operaciones registradas'
                    : 'No hay movimientos en esta caja'
                  : 'Historial vacío'}
              </p>
              <p className="text-[9px] text-zinc-600 font-medium max-w-xs mx-auto normal-case">
                {esMovimientos
                  ? soloMisMovimientos
                    ? 'Aún no has realizado ninguna venta o pago de premio bajo tu usuario en este turno.'
                    : 'Esta caja no reporta transacciones ni cobros por el momento.'
                  : 'No se encontraron aperturas ni cierres de caja anteriores para este punto de venta.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CajasVendedorTable