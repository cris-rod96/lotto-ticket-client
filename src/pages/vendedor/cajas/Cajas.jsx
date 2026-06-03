import { cajaAPI } from '@/api/index.api'
import DetalleCajaModal from '@/components/DetalleCajaModal'
import Title from '@/components/Titlte'
import usePaginationWindow from '@/hooks/usePaginationWindow'
import { useAuthStore } from '@/store/useAuthStore'
import { useEffect, useRef, useState } from 'react'
import {
  LuChevronLeft,
  LuChevronRight,
  LuCircleAlert,
  LuCircleCheck,
  LuEye,
  LuFilter,
  LuInbox,
  LuRotateCcw,
} from 'react-icons/lu'

const CajasVendedor = () => {
  const { user } = useAuthStore()
  const [cajas, setCajas] = useState([])
  const [resumen, setResumen] = useState(null)
  const [pagination, setPagination] = useState({ totalItems: 0, totalPages: 1, currentPage: 1 })
  const [cajaSeleccionada, setCajaSeleccionada] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [filters, setFilters] = useState({ fechaInicio: '', fechaFin: '', page: 1 })
  const [loading, setLoading] = useState(true)

  const dateInicioRef = useRef(null)
  const dateFinRef = useRef(null)
  const pageNumbers = usePaginationWindow(pagination.currentPage, pagination.totalPages)

  const fetchCajas = async () => {
    try {
      setLoading(true)
      const params = {
        fechaInicio: filters.fechaInicio || undefined,
        fechaFin: filters.fechaFin || undefined,
        page: filters.page || 1,
      }

      const resp = await cajaAPI.listarPorPuntoVenta(user.PuntoVentaId, params)
      setCajas(resp.data.cajas || [])
      setResumen(resp.data.resumenGlobal || null)
      setPagination(resp.data.pagination || {})
    } catch (error) {
      console.error('Error al cargar cajas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (dateInicioRef.current) dateInicioRef.current.value = ''
    if (dateFinRef.current) dateFinRef.current.value = ''
    setFilters({ fechaInicio: '', fechaFin: '', page: 1 })
  }

  useEffect(() => {
    if (user?.PuntoVentaId) fetchCajas()
  }, [filters, user?.PuntoVentaId])

  const formatCurrency = (val) =>
    new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(val || 0)

  return (
    <div className="w-full pb-10">
      <div className="flex justify-between items-end mb-8">
        <Title titulo="Gestión Financiera" descripcion="Resumen consolidado del punto de venta" />
        {resumen && (
          <div className="flex gap-4">
            {[
              { label: 'Ventas Totales', val: resumen.totalVentasGeneral, color: 'text-white' },
              { label: 'Pagos Realizados', val: resumen.totalPagadoGeneral, color: 'text-red-500' },
              { label: 'Deuda Pendiente', val: resumen.totalDeudaGeneral, color: 'text-luck-gold' },
            ].map((item, i) => (
              <div key={i} className="bg-[#111615] border border-white/10 px-6 py-4 rounded-2xl">
                <span className="text-[9px] text-zinc-500 uppercase font-black block">
                  {item.label}
                </span>
                <span className={`${item.color} font-mono font-black text-lg`}>
                  {formatCurrency(item.val)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4 mb-6 bg-[#111615] p-4 rounded-2xl border border-white/10 items-center">
        <LuFilter className="text-luck-gold ml-2" />
        <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-xl border border-white/5">
          <input
            ref={dateInicioRef}
            type="date"
            className="bg-transparent text-white text-xs font-bold uppercase outline-none cursor-pointer [color-scheme:dark]"
            onChange={(e) => setFilters({ ...filters, fechaInicio: e.target.value, page: 1 })}
          />
        </div>
        <span className="text-zinc-600 font-black">A</span>
        <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-xl border border-white/5">
          <input
            ref={dateFinRef}
            type="date"
            className="bg-transparent text-white text-xs font-bold uppercase outline-none cursor-pointer [color-scheme:dark]"
            onChange={(e) => setFilters({ ...filters, fechaFin: e.target.value, page: 1 })}
          />
        </div>
        <button
          onClick={handleReset}
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-red-500/20 text-zinc-500 hover:text-red-500 border border-white/5 rounded-xl transition-all"
        >
          <LuRotateCcw size={14} />
          <span className="text-[10px] font-black uppercase">Limpiar</span>
        </button>
      </div>

      <div className="bg-[#111615] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-zinc-400 uppercase text-[10px] font-black tracking-[0.2em]">
                <th className="p-6">Fecha</th>
                <th className="p-6 text-center">Estado</th>
                <th className="p-6 text-right">Apertura</th>
                <th className="p-6 text-right">Saldo Actual</th>
                <th className="p-6 text-right">Ventas</th>
                <th className="p-6 text-right">Pagos</th>
                <th className="p-6 text-center">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="p-20 text-center text-zinc-500 font-black tracking-widest"
                  >
                    CARGANDO...
                  </td>
                </tr>
              ) : cajas.length > 0 ? (
                cajas.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.01] transition-all">
                    <td className="p-6">
                      <span className="block text-white font-bold text-sm">
                        {new Date(c.fechaApertura).toLocaleDateString('es-EC')}
                      </span>
                      <span className="text-[9px] text-zinc-600 uppercase">
                        Apertura: {new Date(c.fechaApertura).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase border ${c.estado === 'Abierta' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-zinc-500/10 text-zinc-500 border-white/5'}`}
                      >
                        {c.estado === 'Abierta' ? (
                          <LuCircleCheck size={10} />
                        ) : (
                          <LuCircleAlert size={10} />
                        )}{' '}
                        {c.estado}
                      </span>
                    </td>
                    <td className="p-6 text-right font-mono text-zinc-300">
                      {formatCurrency(c.montoApertura)}
                    </td>
                    <td className="p-6 text-right font-mono font-bold text-white">
                      {formatCurrency(c.saldoActual)}
                    </td>
                    <td className="p-6 text-right font-mono text-green-500">
                      {formatCurrency(c.stats.totalVentas)}
                    </td>
                    <td className="p-6 text-right font-mono text-red-500">
                      {formatCurrency(c.stats.totalPagado)}
                    </td>
                    <td className="p-6 text-center">
                      <button
                        onClick={() => {
                          setCajaSeleccionada(c)
                          setShowModal(true)
                        }}
                        className="p-3 bg-zinc-900 hover:bg-luck-gold/20 text-zinc-400 hover:text-luck-gold rounded-xl transition-all border border-white/5"
                      >
                        <LuEye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 text-zinc-600">
                      <LuInbox size={48} className="opacity-50" />
                      <p className="font-black uppercase tracking-widest text-xs">
                        No hay cajas registradas
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-auto p-6 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            Página {pagination.currentPage || 1} de {pagination.totalPages || 1}
            <span className="ml-2 text-white/20">
              | {pagination.totalItems || 0} registros en total
            </span>
          </p>
          <div className="flex items-center gap-3">
            <button
              disabled={(pagination.currentPage || 1) <= 1}
              onClick={() => setFilters({ ...filters, page: pagination.currentPage - 1 })}
              className="p-2.5 bg-zinc-900 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-20"
            >
              <LuChevronLeft size={20} />
            </button>
            <div className="flex gap-1">
              {pageNumbers.map((page, i) => (
                <button
                  key={i}
                  onClick={() => typeof page === 'number' && setFilters({ ...filters, page })}
                  className={`w-8 h-8 rounded-lg text-[10px] font-black ${pagination.currentPage === page ? 'bg-luck-gold text-black' : 'text-zinc-500 hover:bg-white/5'}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              disabled={(pagination.currentPage || 1) >= (pagination.totalPages || 1)}
              onClick={() => setFilters({ ...filters, page: pagination.currentPage + 1 })}
              className="p-2.5 bg-zinc-900 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-20"
            >
              <LuChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
      <DetalleCajaModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        caja={cajaSeleccionada}
        formatCurrency={formatCurrency}
      />
    </div>
  )
}

export default CajasVendedor
