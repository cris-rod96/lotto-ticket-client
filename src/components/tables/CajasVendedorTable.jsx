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
  LuWallet,
  LuX,
} from 'react-icons/lu'

const CajasVendedorTable = ({
  data,
  totalRecords,
  currentPage,
  totalPages,
  onPageChange,
  formatter,
}) => {
  const [selectedCaja, setSelectedCaja] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleVerDetalle = (caja) => {
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
            <LuHistory size={16} className="text-[#D4AF37]" /> Registro de Sesiones
          </h3>
          <p className="text-[9px] text-zinc-500 uppercase font-bold mt-1 tracking-widest">
            Mostrando {data.length} de {totalRecords} registros
          </p>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-2 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-[#D4AF37] disabled:opacity-20 transition-all"
            >
              <LuChevronLeft size={20} />
            </button>
            <span className="text-[10px] font-black text-white px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-2 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-[#D4AF37] disabled:opacity-20 transition-all"
            >
              <LuChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-zinc-500 uppercase text-[9px] font-black tracking-[0.2em] bg-zinc-900/50">
              <th className="p-6 pl-10">Fecha / Registro</th>
              <th className="p-6">Monto Inicial</th>
              <th className="p-6">Monto Cierre</th>
              <th className="p-6">Diferencia</th>
              <th className="p-6">Estado</th>
              <th className="p-6 text-right pr-10">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {data.map((c) => (
              <tr key={c.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="p-6 pl-10">
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm uppercase">
                      {new Date(c.createdAt).toLocaleDateString('es-EC', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">
                      Ref: {c.id.split('-')[0]}
                    </span>
                  </div>
                </td>
                <td className="p-6 text-zinc-400 font-mono text-sm font-bold">
                  {formatter.format(c.montoApertura || 0)}
                </td>
                <td className="p-6 text-zinc-400 font-mono text-sm font-bold">
                  {c.montoCierre ? formatter.format(c.montoCierre) : '---'}
                </td>
                <td
                  className={`p-6 font-mono text-sm font-bold ${c.diferencia < 0 ? 'text-red-500' : c.diferencia > 0 ? 'text-green-500' : 'text-zinc-400'}`}
                >
                  {c.diferencia !== null ? formatter.format(c.diferencia) : '---'}
                </td>
                <td className="p-6">
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${c.estado === 'Abierta' ? 'bg-green-500/5 text-green-500 border-green-500/10' : 'bg-zinc-800 text-zinc-500 border-white/5'}`}
                  >
                    {c.estado}
                  </span>
                </td>
                <td className="p-6 text-right pr-10">
                  <button
                    onClick={() => handleVerDetalle(c)}
                    className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all shadow-lg"
                  >
                    <LuSearch size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL DE AUDITORÍA (ESTILO LUCK) --- */}
      {showModal && selectedCaja && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
          <div className="bg-[#0f1212] border border-white/10 rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_50px_-12px_rgba(212,175,55,0.2)]">
            {/* Header Modal */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-5">
                <div className="bg-[#D4AF37] p-3 rounded-2xl text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                  <LuHistory size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                    Auditoría de Flujos
                  </h2>
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">
                    Sesión: {selectedCaja.id.split('-')[0]} •{' '}
                    {new Date(selectedCaja.createdAt).toLocaleDateString()}
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

            {/* Tarjetas de Resumen */}
            <div className="grid grid-cols-3 gap-4 p-8 bg-black/20">
              <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-[2rem]">
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-2">
                  Fondo Apertura
                </p>
                <p className="text-xl font-black text-white font-mono">
                  {formatter.format(selectedCaja.montoApertura)}
                </p>
              </div>
              <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-6 rounded-[2rem] relative overflow-hidden group">
                <LuBanknote
                  className="absolute -right-4 -bottom-4 text-[#D4AF37]/10 group-hover:scale-110 transition-transform"
                  size={100}
                />
                <p className="text-[8px] font-black text-[#D4AF37] uppercase tracking-widest mb-2">
                  Dinero en Mano
                </p>
                <p className="text-xl font-black text-[#D4AF37] font-mono">
                  {formatter.format(selectedCaja.saldoActual || 0)}
                </p>
              </div>
              <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-[2rem] relative overflow-hidden group">
                <LuWallet
                  className="absolute -right-4 -bottom-4 text-blue-500/10 group-hover:scale-110 transition-transform"
                  size={100}
                />
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
                      <th className="p-5 text-center">Tipo</th>
                      <th className="p-5">Detalle / Categoría</th>
                      <th className="p-5">Método</th>
                      <th className="p-5 text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {selectedCaja.Movimientos?.map((mov) => {
                      const isIngreso = mov.tipoMovimiento === 'Ingreso'
                      const isVirtual = mov.descripcion
                        ?.toUpperCase()
                        .match(/(BANCO|TRANSFERENCIA|CHEQUE|BANCARIO)/)

                      return (
                        <tr key={mov.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 flex justify-center">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center ${isIngreso ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
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
                              {mov.descripcion?.split('|')[0] || 'Movimiento General'}
                            </p>
                            <span className="text-[7px] font-bold text-zinc-600 uppercase">
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
                            className={`p-4 text-right font-mono font-black text-sm ${isIngreso ? 'text-green-500' : 'text-red-500'}`}
                          >
                            {isIngreso ? '+' : '-'}
                            {formatter.format(mov.monto)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-8 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
              <button className="flex items-center gap-2 text-[9px] font-black uppercase text-zinc-500 hover:text-[#D4AF37] transition-all">
                <LuPrinter size={18} /> Generar Reporte PDF
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-white text-black px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#D4AF37] transition-all shadow-xl"
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

export default CajasVendedorTable
