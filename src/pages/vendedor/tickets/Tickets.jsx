import { pdf } from '@react-pdf/renderer'
import { motion } from 'framer-motion'
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

import { sorteoAPI, suerteAPI, ticketAPI } from '@/api/index.api'
import DetalleJugadasModal from '@/components/DetalleJugadasModal'
import ModalPagoTicketVendedor from '@/components/ModalPagoTicketVendedor'
import TicketModalVendedor from '@/components/TicketModalVendedor'
import Title from '@/components/Titlte'
import { useAuthStore } from '@/store/useAuthStore'
import { useCajaStore } from '@/store/useCajaStore'
import ComprobantePagoTemplate from '@/templates/ComprobanteTemplate'
import TicketTemplate from '@/templates/TicketTemplate'
import { AnimatePresence } from 'framer-motion'

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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedTicketDetails, setSelectedTicketDetails] = useState(null)

  const [filterFecha, setFilterFecha] = useState('Todos')
  const [filterEstado, setFilterEstado] = useState('Todos')

  const { user } = useAuthStore()
  const caja = useCajaStore((state) => state.caja)
  const setCaja = useCajaStore((state) => state.setCaja)

  const [sorteos, setSorteos] = useState([])
  const [suertes, setSuertes] = useState([])

  // ESTADOS DE PAGINACIÓN DESDE SERVIDOR
  const [tickets, setTickets] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const fetchTickets = async () => {
    setLoading(true)
    try {
      // Cargamos catálogos iniciales solo si están vacíos
      if (sorteos.length === 0) {
        const [respSorteos, respSuertes] = await Promise.all([
          sorteoAPI.listarAbiertos({ estado: 'Abierto' }),
          suerteAPI.listarTodas(),
        ])
        setSorteos(respSorteos.data?.sorteos || [])
        setSuertes(respSuertes.data.suertes || [])
      }

      // Petición paginada al servidor - Ajustado a tu estructura de respuesta
      const response = await ticketAPI.listarPorPuntoDeVenta(user.PuntoVentaId, {
        page: currentPage,
        limit: itemsPerPage,
        // ESTA ES LA CORRECCIÓN:
        fecha: filterFecha !== 'Todos' ? filterFecha : undefined,
        estado: filterEstado !== 'Todos' ? filterEstado : undefined,
      })

      // Accedemos a la respuesta según la estructura que me pasaste:
      setTickets(response.data.data || []) // Los tickets están en response.data.data
      setTotalItems(response.data.pagination.totalItems || 0)
      setTotalPages(response.data.pagination.totalPages || 1)
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo sincronizar tus ventas del día',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.PuntoVentaId) {
      fetchTickets()
    }
  }, [user, currentPage, filterEstado, filterFecha])

  // Reset a página 1 si cambian filtros (cuando implementes filtrado avanzado)
  useEffect(() => {
    setCurrentPage(1)
  }, [filterEstado, filterFecha])

  const renderPageNumbers = useMemo(() => {
    const pages = []
    const maxVisibleButtons = 5
    if (totalPages <= maxVisibleButtons + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      let startPage = Math.max(2, currentPage - 2)
      let endPage = Math.min(totalPages - 1, currentPage + 2)
      if (currentPage <= 3) endPage = maxVisibleButtons
      else if (currentPage >= totalPages - 2) startPage = totalPages - maxVisibleButtons + 1
      pages.push(1)
      if (startPage > 2) pages.push('ellipsis-left')
      for (let i = startPage; i <= endPage; i++) pages.push(i)
      if (endPage < totalPages - 1) pages.push('ellipsis-right')
      pages.push(totalPages)
    }
    return pages
  }, [totalPages, currentPage])

  const handleConfirmarPagoReal = async (ticketId, puntoVentaId, cajaId) => {
    Swal.fire({
      title: 'PROCESANDO PAGO...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    })
    try {
      const response = await ticketAPI.pagarTicket(ticketId, user.id, cajaId)

      if (response.status === 200) {
        setIsPayModalOpen(false)

        // 1. Éxito visual
        await Swal.fire({
          title: '¡PAGO EXITOSO!',
          icon: 'success',
          confirmButtonColor: '#EAB308',
        })

        // 2. Sincronizamos estado
        setCaja(response.data.caja)
        fetchTickets()

        // 3. ¡AQUÍ ESTÁ LA MAGIA! Disparamos la impresión automáticamente
        // Usamos el ticket que acabamos de pagar.
        // Si el servidor te devuelve el ticket actualizado en response.data.ticket, úsalo.
        // Si no, usamos el ticketToPay que ya teníamos en el estado.
        handlePrintComprobante(response.data.ticket || ticketToPay)

        return response.data
      }
    } catch (error) {
      Swal.fire({ title: 'ERROR', text: error.response?.data?.message, icon: 'error' })
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

  // const handlePrintComprobante = async (ticket) => {
  //   try {
  //     const doc = <ComprobantePagoTemplate ticket={ticket} user={user} />
  //     const blob = await pdf(doc).toBlob()
  //     const url = URL.createObjectURL(blob)
  //     const iframe = document.createElement('iframe')
  //     iframe.style.position = 'fixed'
  //     iframe.style.width = '0'
  //     iframe.style.height = '0'
  //     iframe.src = url
  //     document.body.appendChild(iframe)
  //     iframe.onload = () => {
  //       iframe.contentWindow.print()
  //       document.body.removeChild(iframe)
  //       URL.revokeObjectURL(url)
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  const handlePrintComprobante = async (ticket) => {
    console.log(ticket)
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

  const formatVisualFecha = (dateString) => {
    if (!dateString) return ''
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  }

  const fechasDisponibles = useMemo(() => {
    const fechas = sorteos.map((s) => s.fechaSorteo).filter((fecha) => !!fecha)
    return [...new Set(fechas)].sort().reverse()
  }, [sorteos])

  const handleAnularTicket = async (ticket) => {
    const result = await Swal.fire({
      title: '¿Anular Ticket?',
      text: `¿Estás seguro de anular el ticket #${ticket.codigo}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Sí, Anular',
      cancelButtonText: 'Cancelar',
    })

    if (result.isConfirmed) {
      try {
        await ticketAPI.anularTicket(ticket.id) // Asegúrate que tu API tenga este endpoint
        Swal.fire('Anulado', 'El ticket ha sido anulado correctamente', 'success')
        fetchTickets()
      } catch (error) {
        Swal.fire('Error', 'No se pudo anular el ticket', 'error')
      }
    }
  }

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      <div className="flex justify-between items-center mb-10">
        <Title titulo="Punto de Venta - Tickets" descripcion="Gestión de ventas y premios" />
        <motion.button
          onClick={() => setShowModal(true)}
          className="bg-luck-gold text-black font-black py-4 px-8 rounded-2xl flex items-center gap-2 uppercase text-xs shadow-lg italic"
        >
          <LuPlus size={20} /> Emitir Ticket
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111615] border border-white/5 p-5 rounded-3xl mb-8 flex flex-wrap gap-4 items-end"
      >
        {/* Selector de Fecha */}
        <div className="flex flex-col gap-2 min-w-[200px]">
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

        {/* Selector de Estado */}
        <div className="flex flex-col gap-2 min-w-[200px]">
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

        {/* Contador a la derecha */}
        <div className="ml-auto">
          <div className="px-6 py-3.5 bg-white/[0.02] border border-white/5 rounded-2xl whitespace-nowrap flex items-center justify-center">
            <span className="text-[10px] font-black text-luck-gold uppercase tracking-[0.2em]">
              {totalItems} Coincidencias
            </span>
          </div>
        </div>
      </motion.div>

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

        {/* CONTROLES DE PAGINACIÓN OPTIMIZADOS (FIXED BLOCKS) */}
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
        <TicketModalVendedor
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          sorteos={sorteos}
          usuario={user}
          fetchData={fetchTickets}
          suertes={suertes}
        />
      )}
      {isPayModalOpen && (
        <ModalPagoTicketVendedor
          isOpen={isPayModalOpen}
          onClose={() => setIsPayModalOpen(false)}
          ticket={ticketToPay}
          usuario={user}
          onConfirm={handleConfirmarPagoReal}
          caja={caja}
          handlePrintComprobante={handlePrintComprobante}
        />
      )}
      <DetalleJugadasModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        ticket={selectedTicketDetails}
      />
    </motion.div>
  )
}

export default Tickets
