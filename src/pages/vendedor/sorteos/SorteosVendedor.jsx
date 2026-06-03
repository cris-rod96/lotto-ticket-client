import { catalogoAPI, cifraAPI, sorteoAPI } from '@/api/index.api'
import Title from '@/components/Titlte'
import usePaginationWindow from '@/hooks/usePaginationWindow'
import { useAuthStore } from '@/store/useAuthStore'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  LuCalendar,
  LuChevronLeft,
  LuChevronRight,
  LuClock,
  LuFilter,
  LuGlobe,
  LuInbox,
  LuLayers,
  LuRotateCcw,
  LuShuffle,
} from 'react-icons/lu'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const rowVariants = {
  hidden: { x: -15, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
}

// OJO: Asegúrate de pasar el ID del punto de venta.
// Si viene del contexto de usuario, reemplaza el valor de puntoVentaId.
const SorteosVendedor = () => {
  const { user } = useAuthStore()
  const [catalogoFilter, setCatalogoFilter] = useState('Todos')
  const [jornadaFilter, setJornadaFilter] = useState('Todos')
  const [cifraFilter, setCifraFilter] = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  const [sorteos, setSorteos] = useState([])
  const [catalogos, setCatalogos] = useState([])
  const [cifras, setCifras] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 5
  const pageNumbers = usePaginationWindow(currentPage, totalPages)

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val || 0)
  }

  const fetchDataSorteos = async () => {
    if (!user.PuntoVentaId) return
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        CatalogoId: catalogoFilter,
        jornada: jornadaFilter,
        CifraId: cifraFilter,
        estado: statusFilter,
        fechaHasta: fechaHasta,
        fechaDesde: fechaDesde,
      }
      // LLAMADA AL ENDPOINT CORREGIDO
      const resp = await sorteoAPI.listarPorPunto(user.PuntoVentaId, params)
      setSorteos(resp.data?.sorteos || [])
      console.log(resp.data?.sorteos)
      setTotalPages(resp.data?.totalPages || 1)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchFiltrosData = async () => {
    try {
      const [respCatalogos, respCifras] = await Promise.all([
        catalogoAPI.listarTodos(),
        cifraAPI.listarTodas(),
      ])
      setCatalogos(respCatalogos.data?.catalogos || [])
      setCifras(respCifras.data?.cifras || [])
    } catch (error) {
      console.error(error)
    }
  }

  const handleResetFilters = () => {
    setCatalogoFilter('Todos')
    setJornadaFilter('Todos')
    setCifraFilter('Todos')
    setStatusFilter('Todos')
    setFechaDesde('')
    setFechaHasta('')
  }

  useEffect(() => {
    fetchFiltrosData()
    fetchDataSorteos()
  }, [])

  useEffect(() => {
    fetchDataSorteos()
  }, [
    currentPage,
    catalogoFilter,
    jornadaFilter,
    cifraFilter,
    statusFilter,
    fechaDesde,
    fechaHasta,
  ])

  useEffect(() => {
    setCurrentPage(1)
  }, [catalogoFilter, jornadaFilter, cifraFilter, statusFilter, fechaDesde, fechaHasta])

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      <div className="flex justify-between items-center mb-10">
        <Title titulo="Gestión de Sorteos" descripcion="Consulta de eventos de lotería" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-8 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 items-center"
      >
        {[
          {
            icon: LuShuffle,
            val: catalogoFilter,
            set: setCatalogoFilter,
            opts: catalogos.map((c) => ({ v: c.id, l: c.nombre })),
            placeholder: 'Todos los juegos',
          },
          {
            icon: LuClock,
            val: jornadaFilter,
            set: setJornadaFilter,
            opts: [
              { v: 'Matutina', l: 'Matutina' },
              { v: 'Vespertina', l: 'Vespertina' },
              { v: 'Nocturna', l: 'Nocturna' },
            ],
            placeholder: 'Todas las jornadas',
          },
          {
            icon: LuLayers,
            val: cifraFilter,
            set: setCifraFilter,
            opts: cifras.map((c) => ({ v: c.id, l: c.cantidad + ' Cifras' })),
            placeholder: 'Todas las cifras',
          },
          {
            icon: LuFilter,
            val: statusFilter,
            set: setStatusFilter,
            opts: [
              { v: 'Abierto', l: 'Abierto' },
              { v: 'Cerrado', l: 'Cerrado' },
              { v: 'Finalizado', l: 'Finalizado' },
            ],
            placeholder: 'Todos los estados',
          },
        ].map((f, i) => (
          <div key={i} className="relative w-full">
            <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" size={16} />
            <select
              value={f.val}
              onChange={(e) => f.set(e.target.value)}
              className="w-full bg-[#1a1f1e] border border-white/10 rounded-2xl py-3.5 pl-12 pr-8 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-[11px] appearance-none cursor-pointer uppercase font-bold"
            >
              <option value="Todos" className="bg-[#1a1f1e] text-white">
                {f.placeholder}
              </option>
              {f.opts.map((o) => (
                <option key={o.v} value={o.v} className="bg-[#1a1f1e] text-white">
                  {o.l}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div className="relative w-full">
          <LuCalendar
            className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold"
            size={16}
          />
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            className="w-full bg-[#1a1f1e] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-[11px] cursor-pointer uppercase font-bold custom-date-input"
            title="Desde"
          />
        </div>

        <div className="relative w-full">
          <LuCalendar
            className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold"
            size={16}
          />
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            className="w-full bg-[#1a1f1e] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-[11px] cursor-pointer uppercase font-bold custom-date-input"
            title="Hasta"
          />
        </div>

        <button
          onClick={handleResetFilters}
          className="w-full bg-[#1a1f1e] border border-white/10 rounded-2xl py-3.5 px-4 text-white hover:border-red-500/50 hover:text-red-400 transition-all text-[11px] font-black uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2"
        >
          <LuRotateCcw size={14} />
          Limpiar
        </button>
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="bg-[#111615] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-zinc-500 uppercase text-[11px] font-bold tracking-[0.15em]">
                <th className="p-7">Sorteo</th>
                <th className="p-7">Lotería / País</th>
                <th className="p-7 ">Configuración</th>
                <th className="p-7 text-center">Fecha</th>
                <th className="p-7 text-center">Estado</th>
                <th className="p-7 text-center">Tickets</th>
                <th className="p-7 text-center">Recaudado</th>
                <th className="p-7 text-center">Premios</th>
                <th className="p-7 text-center">Ganancias</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              <AnimatePresence mode="popLayout" initial={false}>
                {sorteos.length > 0 ? (
                  sorteos.map((sorteo) => (
                    <motion.tr
                      key={sorteo.id}
                      variants={rowVariants}
                      layout
                      className="group hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="p-7">
                        <div className="flex items-center gap-4">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-12 h-12 rounded-2xl bg-luck-gold/10 border border-luck-gold/20 flex items-center justify-center text-luck-gold font-black text-sm shadow-inner"
                          >
                            #{sorteo.numero}
                          </motion.div>
                        </div>
                      </td>
                      <td className="p-7">
                        <div className="flex flex-col gap-1">
                          <span className="text-zinc-200 font-bold text-[13px] uppercase tracking-wide">
                            {sorteo?.Catalogo?.nombre}
                          </span>
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-black uppercase">
                            <LuGlobe size={12} className="text-luck-gold/50" />{' '}
                            {sorteo?.Catalogo?.pais}
                          </div>
                        </div>
                      </td>
                      <td className="p-7 ">
                        <div className="flex flex-col gap-2 items-center">
                          <span className="text-zinc-400 font-black bg-zinc-950 px-3 py-1 rounded-lg border border-white/5 text-[9px] uppercase tracking-widest">
                            {sorteo.jornada}
                          </span>
                          <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold">
                            <LuLayers size={12} className="text-luck-gold/50" />
                            {sorteo?.Cifra?.cantidad} Cifras
                          </div>
                        </div>
                      </td>
                      <td className="p-7">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-[12px] text-zinc-200 font-bold">
                            <LuCalendar size={14} className="text-luck-gold" /> {sorteo.fechaSorteo}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
                            <LuClock size={14} /> {sorteo.horaSorteo}
                          </div>
                        </div>
                      </td>
                      <td className="p-7 text-center">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${sorteo.estado === 'Abierto' ? 'bg-green-500/5 text-green-500 border-green-500/20' : 'bg-red-500/5 text-red-500 border-red-500/20'}`}
                        >
                          {sorteo.estado}
                        </span>
                      </td>
                      <td className="p-7 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-white font-black text-lg">
                            {sorteo.totalTickets || 0}
                          </span>
                          <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">
                            Vendidos
                          </span>
                        </div>
                      </td>
                      <td className="p-7 text-center">
                        <div className="inline-block bg-white/5 border border-white/5 px-4 py-2 rounded-2xl">
                          <span className="text-luck-gold font-black text-sm font-mono">
                            {formatCurrency(sorteo.totalRecaudado || 0)}
                          </span>
                        </div>
                      </td>
                      <td className="p-7 text-center">
                        <span className="text-gray-300 font-black text-sm font-mono">
                          {formatCurrency(sorteo.totalPremios || 0)}
                        </span>
                      </td>
                      <td className="p-7 text-center">
                        <span
                          className={`${parseFloat(sorteo.utilidadNeta) >= 0 ? 'text-green-400' : 'text-red-400'} font-black text-sm font-mono`}
                        >
                          {formatCurrency(sorteo.utilidadNeta || 0)}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan="9" className="p-32 text-center">
                      <div className="flex flex-col items-center justify-center opacity-20">
                        <LuInbox size={60} className="mb-4 text-luck-gold" />
                        <p className="text-xs font-black uppercase tracking-[0.4em] text-white">
                          No se encontraron sorteos
                        </p>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-between items-center select-none">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex items-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold transition-all"
              >
                <LuChevronLeft size={20} />
              </button>
              <div className="flex gap-1 items-center">
                {pageNumbers.map((page, index) => {
                  if (page === 'ellipsis-left' || page === 'ellipsis-right')
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="w-8 h-8 flex items-center justify-center text-zinc-600 text-[11px] font-black"
                      >
                        ...
                      </span>
                    )
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-[10px] font-black ${currentPage === page ? 'bg-luck-gold text-black' : 'text-zinc-500 hover:bg-white/5'}`}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold transition-all"
              >
                <LuChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default SorteosVendedor
