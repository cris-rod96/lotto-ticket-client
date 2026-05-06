import { useState } from 'react'
import {
  LuArrowDownLeft,
  LuArrowUpRight,
  LuBanknote,
  LuChevronLeft,
  LuChevronRight,
  LuHistory,
  LuPrinter,
  LuSearch,
  LuUser,
  LuWallet,
  LuX,
} from 'react-icons/lu'

const CajasAdminTable = ({ currentData, currentPage, totalPages, setCurrentPage, formatter }) => {
  const [selectedCaja, setSelectedCaja] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleVerDetalle = (caja) => {
    console.log(caja)
    setSelectedCaja(caja)
    setShowModal(true)
  }

  // Lógica de filtrado de movimientos (Virtual vs Físico)
  const calcularResumen = (caja) => {
    if (!caja?.Movimientos) return { bancos: 0, efectivo: 0 }
    let bancos = 0
    let efectivo = 0

    caja.Movimientos.forEach((m) => {
      const monto = parseFloat(m.monto)
      const isIngreso = m.tipoMovimiento === 'Ingreso'
      const isVirtual =
        m.descripcion?.toUpperCase().match(/(BANCO|TRANSFERENCIA|CHEQUE|BANCARIO)/) &&
        !m.descripcion?.toUpperCase().includes('INYECCIÓN')

      if (isVirtual) {
        bancos += isIngreso ? monto : -monto
      } else {
        efectivo += isIngreso ? monto : -monto
      }
    })
    return { bancos, efectivo }
  }

  const resumen = selectedCaja ? calcularResumen(selectedCaja) : { bancos: 0, efectivo: 0 }

  return (
    <div className="bg-[#111615] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
      {/* Header de la Tabla */}
      <div className="p-8 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
        <div>
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
            <LuHistory size={16} className="text-luck-gold" /> Auditoría de Sesiones
          </h3>
          <p className="text-[9px] text-zinc-500 uppercase font-bold mt-1 tracking-widest">
            Historial detallado de movimientos por punto de venta
          </p>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-20 transition-all"
            >
              <LuChevronLeft size={18} />
            </button>
            <span className="text-[10px] font-black text-white px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-20 transition-all"
            >
              <LuChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Tabla Principal */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-zinc-500 uppercase text-[9px] font-black tracking-[0.2em] bg-zinc-900/50">
              <th className="p-6 pl-10">Fecha / Registro</th>
              <th className="p-6">Responsable</th>
              <th className="p-6">Apertura</th>
              <th className="p-6">Cierre</th>
              <th className="p-6">Diferencia</th>
              <th className="p-6">Estado</th>
              <th className="p-6 text-right pr-10">Ver</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {currentData.map((c) => (
              <tr key={c.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="p-6 pl-10">
                  <span className="text-white font-bold text-sm block">
                    {new Date(c.createdAt).toLocaleDateString('es-EC', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">
                    REF: {c.id.slice(0, 8).toUpperCase()}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <LuUser size={14} className="text-luck-gold/50" />
                    <span className="text-zinc-300 font-bold text-[11px] uppercase truncate max-w-[150px]">
                      {c.Usuario?.nombresCompletos || 'N/A'}
                    </span>
                  </div>
                </td>
                <td className="p-6 text-zinc-400 font-mono font-bold text-sm">
                  {formatter.format(c.montoApertura)}
                </td>
                <td className="p-6 text-zinc-400 font-mono font-bold text-sm">
                  {c.montoCierre ? formatter.format(c.montoCierre) : '---'}
                </td>
                <td
                  className={`p-6 font-mono font-bold text-sm ${c.diferencia < 0 ? 'text-red-500' : c.diferencia > 0 ? 'text-green-500' : 'text-zinc-500'}`}
                >
                  {c.diferencia !== null ? formatter.format(c.diferencia) : '---'}
                </td>
                <td className="p-6">
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${c.estado === 'Abierta' ? 'border-green-500/20 text-green-500 bg-green-500/5' : 'border-white/5 text-zinc-500 bg-zinc-800/30'}`}
                  >
                    {c.estado}
                  </span>
                </td>
                <td className="p-6 text-right pr-10">
                  <button
                    onClick={() => handleVerDetalle(c)}
                    className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold hover:border-luck-gold/30 transition-all"
                  >
                    <LuSearch size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL DE AUDITORÍA DETALLADA --- */}
      {showModal && selectedCaja && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
          <div className="bg-[#0f1212] border border-white/10 rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header Modal */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-5">
                <div className="bg-luck-gold p-3 rounded-2xl text-black shadow-lg">
                  <LuHistory size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                    Auditoría de Flujos
                  </h2>
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">
                    Responsable: {selectedCaja.Usuario?.nombresCompletos} • ID:{' '}
                    {selectedCaja.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/5 rounded-full text-zinc-500 transition-colors"
              >
                <LuX size={28} />
              </button>
            </div>

            {/* Tarjetas de Resumen Rápido */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 bg-black/20">
              <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-[2rem]">
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-2">
                  Base Apertura
                </p>
                <p className="text-xl font-black text-white font-mono">
                  {formatter.format(selectedCaja.montoApertura)}
                </p>
              </div>
              <div className="bg-luck-gold/5 border border-luck-gold/20 p-6 rounded-[2rem] relative overflow-hidden group">
                <LuBanknote className="absolute -right-4 -bottom-4 text-luck-gold/10" size={100} />
                <p className="text-[8px] font-black text-luck-gold uppercase tracking-widest mb-2">
                  Efectivo Actual
                </p>
                <p className="text-xl font-black text-luck-gold font-mono">
                  {formatter.format(selectedCaja.saldoActual || 0)}
                </p>
              </div>
              <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-[2rem] relative overflow-hidden group">
                <LuWallet className="absolute -right-4 -bottom-4 text-blue-500/10" size={100} />
                <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-2">
                  Virtual (Bancos)
                </p>
                <p className="text-xl font-black text-blue-400 font-mono">
                  {formatter.format(resumen.bancos)}
                </p>
              </div>
            </div>

            {/* Listado de Movimientos */}
            <div className="flex-1 overflow-y-auto px-8 pb-8">
              <div className="border border-white/5 rounded-[2rem] overflow-hidden bg-black/40">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] bg-zinc-900/80">
                      <th className="p-5 text-center w-20">Tipo</th>
                      <th className="p-5">Detalle / Categoría</th>
                      <th className="p-5">Método</th>
                      <th className="p-5 text-right pr-10">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {selectedCaja.Movimientos?.map((mov) => {
                      const isIngreso = mov.tipo === 'Ingreso'
                      const isVirtual = mov.descripcion
                        ?.toUpperCase()
                        .match(/(BANCO|TRANSFERENCIA|CHEQUE|BANCARIO)/)

                      return (
                        <tr key={mov.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4">
                            <div
                              className={`mx-auto w-8 h-8 rounded-xl flex items-center justify-center ${isIngreso ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
                            >
                              {isIngreso ? (
                                <LuArrowUpRight size={16} />
                              ) : (
                                <LuArrowDownLeft size={16} />
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="text-[10px] font-black text-white uppercase tracking-tighter leading-tight">
                              {mov.descripcion || 'Movimiento General'}
                            </p>
                            <span className="text-[7px] font-bold text-zinc-600 uppercase italic">
                              {mov.categoria}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-[7px] font-black px-2 py-1 rounded-lg border uppercase tracking-tighter ${!isVirtual ? 'bg-zinc-800 text-zinc-400 border-white/5' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}
                            >
                              {!isVirtual ? '💸 Efectivo' : '🏦 Bancario'}
                            </span>
                          </td>
                          <td
                            className={`p-4 text-right pr-10 font-mono font-black text-sm ${isIngreso ? 'text-green-500' : 'text-red-500'}`}
                          >
                            {isIngreso ? '+' : '-'}
                            {formatter.format(mov.monto)}
                          </td>
                        </tr>
                      )
                    })}
                    {(!selectedCaja.Movimientos || selectedCaja.Movimientos.length === 0) && (
                      <tr>
                        <td
                          colSpan="4"
                          className="p-20 text-center text-zinc-600 text-[10px] font-black uppercase tracking-widest"
                        >
                          No hay movimientos registrados en esta sesión
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-8 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
              <button className="flex items-center gap-2 text-[9px] font-black uppercase text-zinc-500 hover:text-luck-gold transition-all">
                <LuPrinter size={18} /> Generar Reporte PDF
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-white text-black px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-luck-gold transition-all shadow-xl"
              >
                Cerrar Auditoría
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CajasAdminTable
