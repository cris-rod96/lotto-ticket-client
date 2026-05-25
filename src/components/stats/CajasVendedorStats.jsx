import { useMemo } from 'react'
import { LuTrendingDown, LuTrendingUp, LuUser, LuWallet } from 'react-icons/lu'

const CajasVendedorStats = ({ user, caja, formatter, soloMisMovimientos }) => {
  const esCajaAbierta = caja?.estado === 'Abierta'

  // Procesamos los movimientos en tiempo real según el modelo de Sequelize
  const resumen = useMemo(() => {
    const movimientos = caja?.Movimientos || []

    return movimientos.reduce(
      (acc, mov) => {
        // Si el filtro "Mis Operaciones" está activo, ignoramos los movimientos de otros operadores
        if (soloMisMovimientos && mov.UsuarioId !== user?.id) {
          return acc
        }

        const montoFlotante = parseFloat(mov.monto || 0)

        // Clasificación exacta según las ENUMs de tu modelo Sequelize
        if (mov.categoria === 'Venta Ticket') {
          acc.ventas += montoFlotante
        } else if (mov.categoria === 'Pago Premio') {
          acc.premios += montoFlotante
        }

        return acc
      },
      { ventas: 0, premios: 0 }
    )
  }, [caja?.Movimientos, soloMisMovimientos, user?.id])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* USUARIO */}
      <div className="bg-[#0c0d0d] border border-white/5 p-5 rounded-2xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-luck-gold/10 flex items-center justify-center text-luck-gold border border-luck-gold/20 shadow-inner">
          <LuUser size={24} />
        </div>
        <div>
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">
            Operador
          </span>
          <p className="text-white font-black text-lg uppercase leading-none truncate w-40">
            {user?.nombresCompletos?.split(' ')[0] || 'Vendedor'}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <div
              className={`w-2 h-2 rounded-full ${esCajaAbierta ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}
            />
            <span
              className={`text-[8px] font-black uppercase tracking-widest ${esCajaAbierta ? 'text-emerald-500' : 'text-red-500'}`}
            >
              {esCajaAbierta ? 'En Línea' : 'Desconectado'}
            </span>
          </div>
        </div>
      </div>

      {/* BALANCE: Siempre muestra el estado real general de la caja */}
      <div className="bg-[#0c0d0d] border border-luck-gold/30 p-5 rounded-2xl relative overflow-hidden group shadow-lg shadow-luck-gold/5">
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <LuWallet size={40} className="text-luck-gold" />
        </div>
        <span className="text-[9px] font-black text-luck-gold uppercase tracking-widest block mb-1">
          Balance Actual
        </span>
        <p className="text-3xl font-black text-white italic tracking-tighter">
          {formatter.format(parseFloat(caja?.saldoActual || 0))}
        </p>
      </div>

      {/* RESUMEN RÁPIDO: Cálculos dinámicos reales del modelo */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0c0d0d] border border-white/5 p-4 rounded-2xl flex items-center gap-3">
          <LuTrendingUp className="text-emerald-500" size={20} />
          <div>
            <span className="text-[8px] font-black text-zinc-500 uppercase block">
              {soloMisMovimientos ? 'Mis Ventas' : 'Ventas Totales'}
            </span>
            <span className="text-sm font-black text-white italic">
              {formatter.format(resumen.ventas)}
            </span>
          </div>
        </div>
        <div className="bg-[#0c0d0d] border border-white/5 p-4 rounded-2xl flex items-center gap-3">
          <LuTrendingDown className="text-red-500" size={20} />
          <div>
            <span className="text-[8px] font-black text-zinc-500 uppercase block">
              {soloMisMovimientos ? 'Mis Premios' : 'Premios Pagados'}
            </span>
            <span className="text-sm font-black text-white italic">
              {formatter.format(resumen.premios)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CajasVendedorStats