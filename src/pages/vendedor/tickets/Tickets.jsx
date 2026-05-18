import { pdf } from '@react-pdf/renderer'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  LuCalendar,
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
  LuInbox,
  LuPlus,
  LuReceipt,
  LuSearch,
  LuTicket,
  LuUser,
} from 'react-icons/lu'
import Swal from 'sweetalert2'

import { sorteoAPI, suerteAPI, ticketAPI } from '@/api/index.api'
import ModalPagoTicketVendedor from '@/components/ModalPagoTicketVendedor'
import TicketModalVendedor from '@/components/TicketModalVendedor'
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
  const [searchTerm, setSearchTerm] = useState('')

  // Datos fijos del vendedor autenticado
  const { user } = useAuthStore()
  const { setCaja } = useCajaStore()

  const [sorteos, setSorteos] = useState([])
  const [suertes, setSuertes] = useState([])
  const [tickets, setTickets] = useState([])

  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const fetchData = async () => {
    setLoading(true)
    try {
      const [respSorteos, respTickets, respSuertes] = await Promise.all([
        sorteoAPI.listarAbiertos(),
        ticketAPI.listarPorPuntoDeVenta(user.PuntoVentaId),
        suerteAPI.listarTodas(),
      ])

      setSorteos(respSorteos.data?.sorteos || [])
      setSuertes(respSuertes.data.suertes || [])
      setTickets(respTickets.data.tickets || [])
    } catch (error) {
      console.error('Error al cargar datos del punto de venta:', error)
      Swal.fire({
        title: 'Error',
        text: 'No se pudo sincronizar tus ventas del día',
        icon: 'error',
        background: '#ffffff',
        color: '#111615',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-[2rem] border border-black/5',
        },
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.PuntoVentaId) {
      fetchData()
    }
  }, [user])

  const handleConfirmarPagoReal = async (ticketId, puntoVentaId, cajaId) => {
    Swal.fire({
      title: 'PROCESANDO PAGO...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
      background: '#ffffff',
      color: '#111615',
      customClass: { popup: 'rounded-[2rem] border border-black/5' },
    })

    try {
      const response = await ticketAPI.pagarTicket(ticketId, user.id, cajaId)
      if (response.status === 200) {
        setIsPayModalOpen(false)
        await Swal.fire({
          title: '¡PAGO EXITOSO!',
          text: response.message,
          icon: 'success',
          background: '#ffffff',
          color: '#111615',
          confirmButtonColor: '#EAB308',
          customClass: { popup: 'rounded-[2rem] border border-black/5' },
        })
        setCaja(response.data.caja)
        fetchData()
      }
    } catch (error) {
      Swal.fire({
        title: 'ERROR EN PAGO',
        text: error.response?.data?.message || error.message,
        icon: 'error',
        background: '#ffffff',
        color: '#111615',
        confirmButtonColor: '#ef4444',
        customClass: { popup: 'rounded-[2rem] border border-black/5' },
      })
    }
  }

  /**
   * NUEVA LÓGICA DE IMPRESIÓN AUTOMÁTICA (IFRAME)
   * Se añade para evitar la descarga física del archivo.
   */
  const handlePrintTicket = async (ticket) => {
    try {
      // Feedback visual
      Swal.fire({
        title: 'PREPARANDO TICKET...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        background: '#ffffff',
        color: '#111615',
        customClass: { popup: 'rounded-[2rem]' },
      })

      const doc = <TicketTemplate ticket={ticket} suertes={suertes} />
      const blob = await pdf(doc).toBlob()
      const url = URL.createObjectURL(blob)

      // Crear iframe oculto
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = url
      document.body.appendChild(iframe)

      iframe.onload = () => {
        iframe.contentWindow.focus()
        iframe.contentWindow.print()

        // Limpieza
        setTimeout(() => {
          document.body.removeChild(iframe)
          URL.revokeObjectURL(url)
        }, 2000)
        Swal.close()
      }
    } catch (error) {
      console.error('Error de impresión:', error)
      Swal.fire({
        title: 'Error de impresión',
        icon: 'error',
        background: '#ffffff',
        color: '#111615',
        confirmButtonColor: '#ef4444',
        customClass: { popup: 'rounded-[2rem] border border-black/5' },
      })
    }
  }

  /* LÓGICA ANTERIOR (COMENTADA POR SEGURIDAD)
  const handlePrintTicket = async (ticket) => {
    try {
      const doc = <TicketTemplate ticket={ticket} suertes={suertes} />
      const blob = await pdf(doc).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `ticket-${ticket.codigo}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      Swal.fire({
        title: 'Error de impresión',
        icon: 'error',
        background: '#ffffff',
        color: '#111615',
        confirmButtonColor: '#ef4444',
        customClass: { popup: 'rounded-[2rem] border border-black/5' },
      })
    }
  }
  */

  /**
   * NUEVA LÓGICA DE IMPRESIÓN COMPROBANTE (IFRAME)
   */
  const handlePrintComprobante = async (ticket) => {
    try {
      Swal.fire({
        title: 'GENERANDO COMPROBANTE...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        background: '#ffffff',
        color: '#111615',
        customClass: { popup: 'rounded-[2rem]' },
      })

      const doc = <ComprobantePagoTemplate ticket={ticket} />
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
      console.error('Error al generar comprobante:', error)
      Swal.fire({
        title: 'Error de impresión',
        text: 'No se pudo generar el comprobante de pago',
        icon: 'error',
        background: '#ffffff',
        color: '#111615',
        confirmButtonColor: '#ef4444',
        customClass: { popup: 'rounded-[2rem]' },
      })
    }
  }

  /* LÓGICA ANTERIOR COMPROBANTE (COMENTADA POR SEGURIDAD)
  const handlePrintComprobante = async (ticket) => {
    try {
      Swal.fire({
        title: 'GENERANDO COMPROBANTE...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        background: '#ffffff',
        color: '#111615',
        customClass: { popup: 'rounded-[2rem]' },
      })

      const doc = <ComprobantePagoTemplate ticket={ticket} />
      const blob = await pdf(doc).toBlob()
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `comprobante-pago-${ticket.codigo}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
      Swal.close() 
    } catch (error) {
      console.error('Error al generar comprobante:', error)
      Swal.fire({
        title: 'Error de impresión',
        text: 'No se pudo generar el comprobante de pago',
        icon: 'error',
        background: '#ffffff',
        color: '#111615',
        confirmButtonColor: '#ef4444',
        customClass: { popup: 'rounded-[2rem]' },
      })
    }
  }
  */

  const filtered = useMemo(() => {
    return tickets.filter(
      (t) =>
        t.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.Sorteo?.Catalogo?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.Cliente?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [tickets, searchTerm])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filtered.slice(start, start + itemsPerPage)
  }, [filtered, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      <div className="flex justify-between items-center mb-10">
        <Title
          titulo="Punto de Venta - Tickets"
          descripcion="Emisión de comprobantes y cobro de premios autorizados"
        />
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#EAB308' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="bg-luck-gold text-black font-black py-4 px-8 rounded-2xl flex items-center gap-2 uppercase text-xs shadow-lg shadow-luck-gold/20 italic"
        >
          <LuPlus size={20} strokeWidth={4} /> Emitir Ticket
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div className="relative w-full md:w-1/2">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
          <input
            type="text"
            placeholder="Buscar mis tickets por código o cliente..."
            className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-luck-gold/30 transition-all placeholder:text-zinc-600 text-xs font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="px-6 py-2 bg-white/[0.02] border border-white/5 rounded-xl">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
            {filtered.length} Tickets Emitidos
          </span>
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
                <th className="p-7">Cliente</th>
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
                      Cargando terminal de ventas...
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
                            <LuCalendar size={12} /> {ticket?.Sorteo?.fechaSorteo}
                          </div>
                        </div>
                      </td>

                      <td className="p-7">
                        <div className="flex items-center gap-2 text-zinc-300 font-bold text-[11px] uppercase">
                          <LuUser size={14} className="text-zinc-600" />
                          {ticket?.Cliente?.nombre || 'Consumidor Final'}
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
                          {ticket.resultado === 'Ganador' && ticket.estado === 'Pendiente' && (
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
                              <LuCheck size={14} /> PAGAR PREMIO
                            </motion.button>
                          )}

                          {ticket.estado === 'Pagado' && (
                            <button
                              onClick={() => handlePrintComprobante(ticket)}
                              className="p-2.5 bg-zinc-900/50 border border-white/5 rounded-xl text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all"
                              title="Imprimir Recibo"
                            >
                              <LuReceipt size={16} />
                            </button>
                          )}

                          <button
                            onClick={() => handlePrintTicket(ticket)}
                            className="p-2.5 bg-zinc-900/50 border border-white/5 rounded-xl text-zinc-400 hover:text-luck-gold transition-colors"
                            title="Imprimir Copia Ticket"
                          >
                            <LuTicket size={16} />
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
                          No registras ventas aún
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

      <TicketModalVendedor
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        sorteos={sorteos}
        usuario={user}
        fetchData={fetchData}
      />

      <ModalPagoTicketVendedor
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        ticket={ticketToPay}
        usuario={user}
        onConfirm={handleConfirmarPagoReal}
      />
    </motion.div>
  )
}

export default Tickets
