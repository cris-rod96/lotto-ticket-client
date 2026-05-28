import { pdf } from '@react-pdf/renderer'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  LuCalendar,
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
  LuEye,
  LuFilter,
  LuInbox,
  LuPlus,
  LuReceipt,
  LuStore,
  LuTicket,
  LuTrash2,
  LuUser,
} from 'react-icons/lu'
import Swal from 'sweetalert2'

import { puntosVentaAPI, sorteoAPI, suerteAPI, ticketAPI } from '@/api/index.api'
import DetalleJugadasModal from '@/components/DetalleJugadasModal' // Importación desde @/components
import ModalPagoTicket from '@/components/ModalPagoTicket'
import TicketModal from '@/components/TicketModal'
import Title from '@/components/Titlte'
import { useAuthStore } from '@/store/useAuthStore'
import { useCajaStore } from '@/store/useCajaStore'
import ComprobantePagoTemplate from '@/templates/ComprobanteTemplate'
import TicketTemplate from '@/templates/TicketTemplate'

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

  // ESTADOS PARA EL MODAL DE DESGLOSE DE NÚMEROS
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedTicketDetails, setSelectedTicketDetails] = useState(null)

  // ESTADOS DE FILTRADO CONTROLADO
  const [filterPuntoVenta, setFilterPuntoVenta] = useState('Todos')
  const [filterFecha, setFilterFecha] = useState('Todos')
  const [filterEstado, setFilterEstado] = useState('Todos')

  const { user } = useAuthStore()
  const { caja, setCaja } = useCajaStore()

  const [sorteos, setSorteos] = useState([])
  const [suertes, setSuertes] = useState([])
  const [puntosVenta, setPuntosVenta] = useState([])
  const [tickets, setTickets] = useState([])

  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const fetchData = async () => {
    setLoading(true)
    try {
      const [respSorteos, respTickets, respPuntosVenta, respSuertes] = await Promise.all([
        sorteoAPI.listarAbiertos(),
        ticketAPI.listarTodos(),
        puntosVentaAPI.listarTodos(),
        suerteAPI.listarTodas(),
      ])
      setSorteos(respSorteos.data?.sorteos || [])
      setTickets(respTickets.data.tickets || [])
      setPuntosVenta(respPuntosVenta.data.puntosVentas || [])
      setSuertes(respSuertes.data.suertes || [])
    } catch (error) {
      console.error('Error al cargar datos:', error)
      Swal.fire({
        title: 'Error',
        text: 'No se pudo sincronizar la información de tickets',
        icon: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

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
        fetchData()

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

      const doc = <ComprobantePagoTemplate ticket={ticket} />
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
          fetchData()
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

  // OBTENER FECHAS ÚNICAS DISPONIBLES EN LOS TICKETS PARA EL SELECT
  const fechasDisponibles = useMemo(() => {
    const fechas = tickets.map((t) => t.Sorteo?.fechaSorteo).filter((fecha) => !!fecha)
    return [...new Set(fechas)].sort().reverse()
  }, [tickets])

  // LÓGICA DE FILTRADO MULTI-CRITERIO
  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      // 1. Filtro de Punto de Venta
      const matchesPV = filterPuntoVenta === 'Todos' || t.PuntoVentaId === filterPuntoVenta

      // 2. Filtro de Fecha del Sorteo
      const matchesFecha = filterFecha === 'Todos' || t.Sorteo?.fechaSorteo === filterFecha

      // 3. Filtro de Resultados y Estados Financieros
      let matchesEstado = false
      if (filterEstado === 'Todos') {
        matchesEstado = true
      } else if (filterEstado === 'Ganador_Pendiente') {
        matchesEstado = t.resultado === 'Ganador' && t.estado === 'Pendiente'
      } else if (filterEstado === 'Ganador_Pagado') {
        matchesEstado = t.resultado === 'Ganador' && t.estado === 'Pagado'
      } else {
        matchesEstado = t.resultado === filterEstado
      }

      return matchesPV && matchesFecha && matchesEstado
    })
  }, [tickets, filterPuntoVenta, filterFecha, filterEstado])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filtered.slice(start, start + itemsPerPage)
  }, [filtered, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [filterPuntoVenta, filterFecha, filterEstado])

  // FORMATEAR FECHAS EN EL SELECT DE FORMA VISUAL (DD/MM/YYYY)
  const formatVisualFecha = (dateString) => {
    if (!dateString) return ''
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  }

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

      {/* BLOQUE DE FILTROS AVANZADOS DE AUDITORÍA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111615] border border-white/5 p-5 rounded-3xl mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end"
      >
        {/* Selector de Punto de Venta */}
        <div className="flex flex-col gap-2">
          <label className="text-[9px] font-black uppercase text-zinc-500 tracking-wider flex items-center gap-1">
            <LuStore size={10} /> Sucursal / Punto de Venta
          </label>
          <select
            value={filterPuntoVenta}
            onChange={(e) => setFilterPuntoVenta(e.target.value)}
            className="w-full bg-black/40 border border-white/5 text-white rounded-2xl py-3.5 px-4 text-xs font-medium focus:outline-none focus:border-luck-gold/30 transition-all cursor-pointer uppercase tracking-wide"
          >
            <option value="Todos" className="bg-[#111615]">
              Todas las Sucursales
            </option>
            {puntosVenta.map((pv) => (
              <option key={pv.id} value={pv.id} className="bg-[#111615]">
                {pv.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de Fecha con Estilo Coherente */}
        <div className="flex flex-col gap-2">
          <label className="text-[9px] font-black uppercase text-zinc-500 tracking-wider flex items-center gap-1">
            <LuCalendar size={10} /> Fecha del Sorteo
          </label>
          <select
            value={filterFecha}
            onChange={(e) => setFilterFecha(e.target.value)}
            className="w-full bg-black/40 border border-white/5 text-white rounded-2xl py-3.5 px-4 text-xs font-medium focus:outline-none focus:border-luck-gold/30 transition-all cursor-pointer uppercase tracking-wide"
          >
            <option value="Todos" className="bg-[#111615]">
              Todas las Fechas
            </option>
            {fechasDisponibles.map((fecha) => (
              <option key={fecha} value={fecha} className="bg-[#111615]">
                {formatVisualFecha(fecha)}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de Estado / Resultados */}
        <div className="flex flex-col gap-2">
          <label className="text-[9px] font-black uppercase text-zinc-500 tracking-wider flex items-center gap-1">
            <LuFilter size={10} /> Estado de Liquidación
          </label>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="w-full bg-black/40 border border-white/5 text-white rounded-2xl py-3.5 px-4 text-xs font-medium focus:outline-none focus:border-luck-gold/30 transition-all cursor-pointer uppercase tracking-wide"
          >
            <option value="Todos" className="bg-[#111615]">
              Todos los resultados
            </option>
            <option value="Pendiente" className="bg-[#111615]">
              Pendiente
            </option>
            <option value="Ganador_Pendiente" className="bg-[#111615]">
              Ganadores por Pagar
            </option>
            <option value="Ganador_Pagado" className="bg-[#111615]">
              Ganadores Ya Pagados
            </option>
            <option value="No Ganador" className="bg-[#111615]">
              No Ganador
            </option>
          </select>
        </div>

        {/* Contador de Coincidencias */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-black uppercase text-transparent tracking-wider hidden md:block select-none">
            Espaciador
          </span>
          <div className="w-full text-center px-6 py-3.5 bg-white/[0.02] border border-white/5 rounded-2xl whitespace-nowrap flex items-center justify-center">
            <span className="text-[10px] font-black text-luck-gold uppercase tracking-[0.2em]">
              {filtered.length} Coincidencias
            </span>
          </div>
        </div>
      </motion.div>

      {/* Tabla con Estilo Unificado */}
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
                ) : currentData.length > 0 ? (
                  currentData.map((ticket) => (
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
                          {/* BOTÓN REUTILIZADO: VER JUGADAS EN MODAL */}
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

                          {((ticket.resultado === 'Ganador' && ticket.estado === 'Pending') ||
                            (ticket.resultado === 'Ganador' && ticket.estado === 'Pendiente')) && (
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

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="p-8 border-t border-white/5 bg-black/[0.1] flex justify-between items-center">
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-10 transition-all"
              >
                <LuChevronLeft size={18} />
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-[9px] font-black transition-all ${
                      currentPage === i + 1
                        ? 'bg-luck-gold text-black'
                        : 'text-zinc-600 hover:bg-white/5'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-10 transition-all"
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
          fetchData={fetchData}
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

      {/* RENDERIZADO DEL MODAL DE DESGLOSE DE JUGADAS */}
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
