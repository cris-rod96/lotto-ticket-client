import { pdf } from '@react-pdf/renderer'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  LuCalendar,
  LuCheck,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuEye,
  LuInbox,
  LuPlus,
  LuReceipt,
  LuSearch, // Asegúrate de tener esta importación
  LuStore,
  LuTicket,
  LuTrash2,
  LuUser,
} from 'react-icons/lu'
import Swal from 'sweetalert2'

import { puntosVentaAPI, sorteoAPI, suerteAPI, ticketAPI } from '@/api/index.api'
import DetalleJugadasModal from '@/components/DetalleJugadasModal'
import ModalPagoTicket from '@/components/ModalPagoTicket'
import TicketModal from '@/components/TicketModal'
import Title from '@/components/Titlte'
import { useAuthStore } from '@/store/useAuthStore'
import { useCajaStore } from '@/store/useCajaStore'
import ComprobantePagoTemplate from '@/templates/ComprobanteTemplate'
import TicketTemplate from '@/templates/TicketTemplate'

// Variantes de animación existentes...
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const rowVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95 },
}

const Tickets = () => {
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isPayModalOpen, setIsPayModalOpen] = useState(false)
  const [ticketToPay, setTicketToPay] = useState(null)
  const [selectedTicket, setSelectedTicket] = useState(null)

  // ESTADOS DE FILTRADO (Añadidos los nuevos)
  const [filterCodigo, setFilterCodigo] = useState('')
  const [filterFechaInicio, setFilterFechaInicio] = useState('')
  const [filterFechaFin, setFilterFechaFin] = useState('')
  const [filterPuntoVenta, setFilterPuntoVenta] = useState('Todos')
  const [filterFecha, setFilterFecha] = useState('Todos')
  const [filterEstado, setFilterEstado] = useState('Todos')

  // Estado para el debounce del código
  const [debouncedCodigo, setDebouncedCodigo] = useState('')

  // ... (Estados para modales, catálogos, usuario, caja existentes) ...
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedTicketDetails, setSelectedTicketDetails] = useState(null)
  const { user } = useAuthStore()
  const { caja, setCaja } = useCajaStore()
  const [sorteos, setSorteos] = useState([])
  const [suertes, setSuertes] = useState([])
  const [puntosVenta, setPuntosVenta] = useState([])

  // ESTADOS DE SERVIDOR PARA TICKETS Y PAGINACIÓN
  const [tickets, setTickets] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // 1. CARGA INICIAL DE CATÁLOGOS/ESTÁTICOS (Sin cambios)
  const fetchInitialData = async () => {
    try {
      const [respSorteos, respPuntosVenta, respSuertes] = await Promise.all([
        sorteoAPI.listarAbiertos({ estado: 'Abierto' }),
        puntosVentaAPI.listarTodos(),
        suerteAPI.listarTodas(),
      ])
      setSorteos(respSorteos.data?.sorteos || [])
      setPuntosVenta(respPuntosVenta.data.puntosVentas || [])
      setSuertes(respSuertes.data.suertes || [])
    } catch (error) {
      console.error('Error al cargar catálogos iniciales:', error)
    }
  }

  const handleResetFiltros = () => {
    setFilterCodigo('')
    setFilterFechaInicio('')
    setFilterFechaFin('')
    setFilterPuntoVenta('Todos')
    setFilterEstado('Todos')
    setCurrentPage(1) // Volvemos a la primera página
    // Opcional: Esto disparará automáticamente la recarga gracias al useEffect
  }

  // 2. CONSULTA DINÁMICA DE TICKETS AL SERVIDOR (Paginada y Filtrada)
  const fetchTicketsPaginados = async () => {
    setLoading(true)
    try {
      // Mapeamos los filtros del frontend a las Query Strings esperadas por el Backend
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        PuntoVentaId: filterPuntoVenta,
        fechaSorteo: filterFecha,
        estadoLiquidacion: filterEstado,
        // Usamos el valor con debounce para no saturar el servidor
        codigo: debouncedCodigo,
        fechaInicio: filterFechaInicio,
        fechaFin: filterFechaFin,
      }

      const response = await ticketAPI.listarTodos(params)

      setTickets(response.data?.tickets || [])
      setTotalItems(response.data?.totalItems || 0)
      setTotalPages(response.data?.totalPages || 1)
    } catch (error) {
      console.error('Error al cargar tickets paginados:', error)
      Swal.fire({
        title: 'Error',
        text: 'No se pudo sincronizar la información de tickets con el servidor',
        icon: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  // EFECTO DE CARGA INICIAL
  useEffect(() => {
    fetchInitialData()
  }, [])

  // EFECTO PARA EL DEBOUNCE DEL CÓDIGO
  useEffect(() => {
    // Cuando el usuario escribe, esperamos 500ms antes de actualizar 'debouncedCodigo'
    const handler = setTimeout(() => {
      setDebouncedCodigo(filterCodigo)
    }, 500) // 500ms de espera

    // Si el usuario vuelve a escribir antes de que pasen los 500ms, cancelamos el timeout anterior
    return () => {
      clearTimeout(handler)
    }
  }, [filterCodigo])

  // DISPARADOR DE CARGA DE DATOS CUANDO CAMBIAN LOS FILTROS O LA PÁGINA
  useEffect(() => {
    fetchTicketsPaginados()
  }, [
    currentPage,
    filterPuntoVenta,
    filterFecha,
    filterEstado,
    debouncedCodigo,
    filterFechaInicio,
    filterFechaFin,
  ])

  // Resetear a la página 1 en caso de alterar cualquier criterio de búsqueda
  useEffect(() => {
    setCurrentPage(1)
  }, [
    filterPuntoVenta,
    filterFecha,
    filterEstado,
    debouncedCodigo,
    filterFechaInicio,
    filterFechaFin,
  ])

  // ... (Handlers de Pago, Impresión, Anulación y Fechas Visuales existentes) ...
  const handleConfirmarPagoReal = async (ticketId, puntoVentaId, cajaId) => {
    Swal.fire({
      title: 'PROCESANDO PAGO...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
      customClass: { popup: 'rounded-[2rem]' },
    })

    try {
      const response = await ticketAPI.pagarTicket(ticketId, user.id, cajaId)
      if (response.status === 200) {
        setIsPayModalOpen(false)
        await Swal.fire({
          title: '¡PAGO EXITOSO!',
          text: response.data?.message || response.message || 'Cobro procesado con éxito.',
          icon: 'success',
          confirmButtonColor: '#EAB308',
          customClass: { popup: 'rounded-[2rem]' },
        })
        setCaja(response.data.caja)
        fetchTicketsPaginados()

        return response.data
      }
      return null
    } catch (error) {
      Swal.fire({
        title: 'ERROR EN PAGO',
        text: error.response?.data?.message || error.message,
        icon: 'error',
        confirmButtonColor: '#ef4444',
        customClass: { popup: 'rounded-[2rem]' },
      })
      return null
    }
  }

  const handlePrintTicket = async (ticket) => {
    try {
      Swal.fire({
        title: 'PREPARANDO TICKET...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        customClass: { popup: 'rounded-[2rem]' },
      })

      const doc = <TicketTemplate ticket={ticket} suertes={suertes} />
      const blob = await pdf(doc).toBlob()
      const url = URL.createObjectURL(blob)

      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = url
      document.body.appendChild(iframe)

      iframe.onload = () => {
        iframe.contentWindow.focus()
        iframe.contentWindow.print()

        setTimeout(() => {
          document.body.removeChild(iframe)
          URL.revokeObjectURL(url)
        }, 2000)
        Swal.close()
      }
    } catch (error) {
      console.error('Error al imprimir ticket:', error)
      Swal.fire({
        title: 'Error de impresión',
        icon: 'error',
      })
    }
  }

  const handlePrintComprobante = async (ticket) => {
    try {
      Swal.fire({
        title: 'GENERANDO COMPROBANTE...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        customClass: { popup: 'rounded-[2rem]' },
      })

      const doc = <ComprobantePagoTemplate ticket={ticket} user={user} />
      const blob = await pdf(doc).toBlob()
      const url = URL.createObjectURL(blob)

      const iframe = document.createElement('iframe')
      iframe.style.position = 'fixed'
      iframe.style.right = '0'
      iframe.style.bottom = '0'
      iframe.style.width = '0'
      iframe.style.height = '0'
      iframe.style.border = '0'
      iframe.src = url
      document.body.appendChild(iframe)

      iframe.onload = () => {
        iframe.contentWindow.focus()
        iframe.contentWindow.print()

        setTimeout(() => {
          document.body.removeChild(iframe)
          URL.revokeObjectURL(url)
        }, 3000)
        Swal.close()
      }
    } catch (error) {
      console.error('Error al generar comprobante:', error)
      Swal.fire({
        title: 'Error de impresión',
        text: 'No se pudo generar el comprobante de pago',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        customClass: { popup: 'rounded-[2rem]' },
      })
    }
  }

  const handleAnularTicket = async (ticket) => {
    const result = await Swal.fire({
      title: '¿Confirmar Anulación?',
      text: `El ticket #${ticket.codigo} se anulará irreversiblemente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, anular ticket',
    })

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Procesando anulación...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      })

      try {
        const response = await ticketAPI.anularTicket(ticket.id, user.id)

        if (response.status === 200) {
          Swal.fire({
            title: '¡Anulado!',
            text: 'El ticket ha sido anulado correctamente.',
            icon: 'success',
            confirmButtonColor: '#EAB308',
          })
          fetchTicketsPaginados()
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: error.response?.data?.message || 'No se pudo anular el ticket',
          icon: 'error',
          confirmButtonColor: '#ef4444',
        })
      }
    }
  }

  const fechasDisponibles = useMemo(() => {
    const fechas = sorteos.map((s) => s.fechaSorteo).filter((fecha) => !!fecha)
    return [...new Set(fechas)].sort().reverse()
  }, [sorteos])

  const formatVisualFecha = (dateString) => {
    if (!dateString) return ''
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  }

  // ... (Cálculo de paginación existente) ...
  const renderPageNumbers = useMemo(() => {
    const pages = []
    const maxVisibleButtons = 5

    if (totalPages <= maxVisibleButtons + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      let startPage = Math.max(2, currentPage - 2)
      let endPage = Math.min(totalPages - 1, currentPage + 2)

      if (currentPage <= 3) {
        endPage = maxVisibleButtons
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxVisibleButtons + 1
      }

      pages.push(1)
      if (startPage > 2) pages.push('ellipsis-left')

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      if (endPage < totalPages - 1) pages.push('ellipsis-right')
      pages.push(totalPages)
    }
    return pages
  }, [totalPages, currentPage])

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      <div className="flex justify-between items-center mb-10">
        <Title
          titulo="Gestión de Tickets"
          descripcion="Auditoría, venta y control financiero de emisiones"
        />
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#EAB308' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setSelectedTicket(null)
            setShowModal(true)
          }}
          className="bg-luck-gold text-black font-black py-4 px-8 rounded-2xl flex items-center gap-2 uppercase text-xs shadow-lg shadow-luck-gold/20 italic"
        >
          <LuPlus size={20} strokeWidth={4} /> Vender Nuevo Ticket
        </motion.button>
      </div>

      {/* BLOQUE DE FILTROS AVANZADOS REORGANIZADO EN 2 FILAS LÍMPIDAS */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111615] border border-white/5 p-5 rounded-3xl mb-8 flex flex-col gap-5"
      >
        {/* FILA 1: BÚSQUEDA POR CÓDIGO A ANCHO COMPLETO */}
        <div className="flex flex-col gap-2">
          <label className="text-[9px] font-black uppercase text-zinc-500 tracking-wider flex items-center gap-1">
            <LuSearch size={10} /> Buscar por Código (Mín. 3 caracteres)
          </label>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Ej: TICKET-00123"
              value={filterCodigo}
              onChange={(e) => setFilterCodigo(e.target.value)} // El cambio activa el useEffect del debounce
              className="w-full bg-black/40 border border-white/5 text-white rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-luck-gold/30 transition-all placeholder:text-zinc-700 italic tracking-wide"
            />
            {loading && filterCodigo !== debouncedCodigo && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-luck-gold/20 border-t-luck-gold rounded-full animate-spin"></div>
            )}
          </div>
        </div>

        {/* FILA 2: FECHAS, SELECTS Y CONTADOR (Compactado y Alineado) */}
        {/* FILA 2: FECHAS, SELECTS Y CONTADOR (CORREGIDO CON ICONOS) */}
        <div className="flex flex-wrap items-end gap-4">
          {/* Fecha Desde */}
          <div className="flex-1 min-w-[150px] flex flex-col gap-2 relative">
            <label className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">
              Desde
            </label>
            <div className="relative">
              <input
                type="date"
                value={filterFechaInicio}
                onChange={(e) => setFilterFechaInicio(e.target.value)}
                className="w-full bg-black border border-white/10 text-white rounded-2xl py-3.5 px-4 text-xs focus:outline-none focus:border-luck-gold/50 transition-all cursor-pointer appearance-none"
              />
              <LuCalendar
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
                size={14}
              />
            </div>
          </div>

          {/* Fecha Hasta */}
          <div className="flex-1 min-w-[150px] flex flex-col gap-2 relative">
            <label className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">
              Hasta
            </label>
            <div className="relative">
              <input
                type="date"
                value={filterFechaFin}
                onChange={(e) => setFilterFechaFin(e.target.value)}
                className="w-full bg-black border border-white/10 text-white rounded-2xl py-3.5 px-4 text-xs focus:outline-none focus:border-luck-gold/50 transition-all cursor-pointer appearance-none"
              />
              <LuCalendar
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
                size={14}
              />
            </div>
          </div>

          {/* Sucursal */}
          <div className="flex-1 min-w-[150px] flex flex-col gap-2 relative">
            <label className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">
              Sucursal
            </label>
            <div className="relative">
              <select
                value={filterPuntoVenta}
                onChange={(e) => setFilterPuntoVenta(e.target.value)}
                className="w-full bg-black border border-white/10 text-white rounded-2xl py-3.5 px-4 text-xs cursor-pointer focus:outline-none focus:border-luck-gold/50 appearance-none pr-10"
              >
                <option value="Todos">Todas</option>
                {puntosVenta.map((pv) => (
                  <option key={pv.id} value={pv.id}>
                    {pv.nombre}
                  </option>
                ))}
              </select>
              <LuChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
                size={16}
              />
            </div>
          </div>

          {/* Estado */}
          <div className="flex-1 min-w-[150px] flex flex-col gap-2 relative">
            <label className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">
              Estado
            </label>
            <div className="relative">
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="w-full bg-black border border-white/10 text-white rounded-2xl py-3.5 px-4 text-xs cursor-pointer focus:outline-none focus:border-luck-gold/50 appearance-none pr-10"
              >
                <option value="Todos">Todos</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Ganador_Pendiente">Ganadores por Pagar</option>
                <option value="Ganador_Pagado">Ganadores Ya Pagados</option>
                <option value="No Ganador">No Ganador</option>
              </select>
              <LuChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
                size={16}
              />
            </div>
          </div>

          {/* Contador */}
          <div className="flex-none flex items-end gap-2">
            {/* Botón de Reset - Ajustado a la misma altura que el contador */}
            <button
              onClick={handleResetFiltros}
              className="h-[48px] px-5 flex items-center justify-center bg-zinc-900 border border-white/10 text-zinc-500 rounded-2xl hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/30 transition-all"
              title="Limpiar todos los filtros"
            >
              <LuTrash2 size={16} />
            </button>

            {/* Contador - Mismo h-[48px] para simetría total */}
            <div className="h-[48px] px-6 flex items-center justify-center bg-luck-gold/10 border border-luck-gold/20 rounded-2xl whitespace-nowrap">
              <span className="text-[10px] font-black text-luck-gold uppercase tracking-[0.2em]">
                {totalItems} Coincidencias
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ... (Todo el resto de tu tabla, modales y paginación SIN CAMBIOS) ... */}
      <motion.div
        variants={containerVariants}
        className="bg-[#111615] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-zinc-500 uppercase text-[9px] font-black tracking-[0.2em]">
                <th className="p-7 pl-10 text-luck-gold">Referencia</th>
                <th className="p-7">Sorteo / Jornada</th>
                <th className="p-7">Origen / Cliente</th>
                <th className="p-7">Resultado</th>
                <th className="p-7">Premio</th>
                <th className="p-7">Estado Pago</th>
                <th className="p-7 text-right pr-10">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              <AnimatePresence mode="popLayout" initial={false}>
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="p-20 text-center animate-pulse text-zinc-500 font-black italic uppercase text-xs"
                    >
                      Sincronizando con el servidor...
                    </td>
                  </tr>
                ) : tickets.length > 0 ? (
                  tickets.map((ticket) => (
                    <motion.tr
                      key={ticket.id}
                      variants={rowVariants}
                      layout
                      className="group hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="p-7 pl-10">
                        <div className="flex flex-col">
                          <span className="text-white font-black text-sm tracking-tighter italic">
                            #{ticket.codigo}
                          </span>
                          <span className="text-[9px] text-luck-gold font-black uppercase mt-0.5">
                            {ticket?.Sorteo?.Catalogo?.nombre}
                          </span>
                        </div>
                      </td>

                      <td className="p-7">
                        <div className="flex flex-col gap-1">
                          <span className="text-zinc-300 font-bold text-[12px] uppercase">
                            {ticket?.Sorteo?.jornada}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                            <LuCalendar size={12} />{' '}
                            {formatVisualFecha(ticket?.Sorteo?.fechaSorteo)}
                          </div>
                        </div>
                      </td>

                      <td className="p-7">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-zinc-300 font-bold text-[11px] uppercase">
                            <LuStore size={14} className="text-zinc-600" />
                            {ticket?.PuntosVentum?.nombre ||
                              ticket?.PuntosVenta?.nombre ||
                              'Matriz'}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold">
                            <LuUser size={12} /> {ticket?.Cliente?.nombre || 'Consumidor Final'}
                          </div>
                        </div>
                      </td>

                      <td className="p-7">
                        <span
                          className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                            ticket.resultado === 'Ganador'
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              : ticket.resultado === 'No Ganador'
                                ? 'bg-zinc-900 text-zinc-600 border-white/5'
                                : 'bg-blue-500/5 text-blue-400 border-blue-500/10'
                          }`}
                        >
                          {ticket.resultado}
                        </span>
                      </td>

                      <td className="p-7">
                        <div
                          className={`flex items-center font-black ${ticket.resultado === 'Ganador' ? 'text-white' : 'text-zinc-700'}`}
                        >
                          <span className="text-base tracking-tighter">
                            $ {parseFloat(ticket.montoTotalPremio).toFixed(2)}
                          </span>
                        </div>
                      </td>

                      <td className="p-7">
                        <span
                          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                            ticket.estado === 'Pagado'
                              ? 'bg-zinc-900 text-emerald-500 border-emerald-500/30'
                              : ticket.estado === 'Anulado'
                                ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                : 'bg-zinc-950 text-zinc-600 border-white/5'
                          }`}
                        >
                          {ticket.estado}
                        </span>
                      </td>

                      <td className="p-7 pr-10">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedTicketDetails(ticket)
                              setIsDetailsOpen(true)
                            }}
                            className="p-2.5 bg-zinc-900/50 border border-white/5 rounded-xl text-zinc-400 hover:text-white transition-colors flex items-center justify-center"
                            title="Ver números apostados"
                          >
                            <LuEye size={16} />
                          </button>

                          {ticket.resultado === 'Ganador' &&
                            (ticket.estado === 'Pending' || ticket.estado === 'Pendiente') && (
                              <motion.button
                                whileHover={{
                                  scale: 1.05,
                                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setTicketToPay(ticket)
                                  setIsPayModalOpen(true)
                                }}
                                className="flex items-center gap-2 px-4 py-2 border border-emerald-500/50 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                              >
                                <LuCheck size={14} /> PAGAR
                              </motion.button>
                            )}

                          {ticket.estado === 'Pagado' && (
                            <button
                              onClick={() => handlePrintComprobante(ticket)}
                              className="p-2.5 bg-zinc-900/50 border border-white/5 rounded-xl text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all"
                              title="Imprimir Comprobante"
                            >
                              <LuReceipt size={16} />
                            </button>
                          )}

                          <button
                            onClick={() => handlePrintTicket(ticket)}
                            className="p-2.5 bg-zinc-900/50 border border-white/5 rounded-xl text-zinc-400 hover:text-luck-gold transition-colors"
                            title="Re-imprimir Ticket"
                          >
                            <LuTicket size={16} />
                          </button>

                          <button
                            className="p-2.5 bg-zinc-900/50 border border-white/5 rounded-xl text-zinc-600 hover:text-red-500 transition-colors"
                            onClick={() => handleAnularTicket(ticket)}
                            title="Anular Ticket"
                          >
                            <LuTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan="7" className="p-32 text-center">
                      <div className="flex flex-col items-center justify-center opacity-10">
                        <LuInbox size={60} className="mb-4 text-white" />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">
                          Sin registros encontrados
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
          <div className="p-8 border-t border-white/5 bg-black/[0.1] flex justify-between items-center select-none">
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-10 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <LuChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1">
                {renderPageNumbers.map((page, index) => {
                  if (page === 'ellipsis-left' || page === 'ellipsis-right') {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="w-8 h-8 flex items-center justify-center text-zinc-600 text-[11px] font-black"
                      >
                        ...
                      </span>
                    )
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-[9px] font-black transition-all cursor-pointer ${
                        currentPage === page
                          ? 'bg-luck-gold text-black'
                          : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-10 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <LuChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {showModal && (
        <TicketModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          puntosVenta={puntosVenta}
          sorteos={sorteos}
          usuario={user}
          fetchData={fetchTicketsPaginados}
          suertes={suertes}
        />
      )}

      {isPayModalOpen && (
        <ModalPagoTicket
          isOpen={isPayModalOpen}
          onClose={() => setIsPayModalOpen(false)}
          ticket={ticketToPay}
          puntosVenta={puntosVenta}
          onConfirm={handleConfirmarPagoReal}
          handlePrintComprobante={handlePrintComprobante}
        />
      )}

      <DetalleJugadasModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false)
          setSelectedTicketDetails(null)
        }}
        ticket={selectedTicketDetails}
      />
    </motion.div>
  )
}

export default Tickets
