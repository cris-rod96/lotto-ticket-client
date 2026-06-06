import { puntosVentaAPI } from '@/api/index.api'
import { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'

const usePuntoVenta = () => {
  const [viewModal, setViewModal] = useState({ open: false, title: '', data: [], type: '' })
  const [puntos, setPuntos] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedPunto, setSelectedPunto] = useState(null)

  const [locationFilter, setLocationFilter] = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('Todos')

  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // --- NUEVOS ESTADOS PARA LA PAGINACIÓN INTERNA DE TICKETS EN EL MODAL ---
  const [modalTickets, setModalTickets] = useState([])
  const [ticketPage, setTicketPage] = useState(1)
  const [ticketTotalPages, setTicketTotalPages] = useState(1)
  const [loadingModalTickets, setLoadingModalTickets] = useState(false)

  // --- NUEVA FUNCIÓN: CARGAR HISTORIAL DE TICKETS POR PÁGINAS ---
  const cargarTicketsDelPunto = async (puntoId, page = 1) => {
    setLoadingModalTickets(true)
    try {
      // Llamamos al nuevo método de tu API pasándole la página y el límite de 20
      const resp = await puntosVentaAPI.obtenerTicketsPaginados(puntoId, page, 20)

      setModalTickets(resp.data.tickets || [])
      setTicketTotalPages(resp.data.totalPages || 1)
      setTicketPage(resp.data.currentPage || 1)
    } catch (error) {
      const msg = error.response?.data?.message || 'No se pudo cargar el historial de tickets'
      Swal.fire({
        title: 'Error',
        text: msg,
        icon: 'error',
      })
    } finally {
      setLoadingModalTickets(false)
    }
  }

  // --- FUNCIÓN MODIFICADA: APERTURA ASÍNCRONA DEL MODAL ---
  const openDetailView = async (punto, type) => {
    try {
      // 1. Vamos al servidor a traer los detalles base del punto (usuarios, cajas y suertes)
      const resp = await puntosVentaAPI.obtenerDetalles(punto.id)
      const puntoBase = resp.data.detalle

      // Limpiamos el estado anterior de los tickets antes de levantar el nuevo modal
      setModalTickets([])
      setTicketPage(1)
      setTicketTotalPages(1)

      // 2. Abrimos el modal con los datos base de la sucursal
      setViewModal({
        open: true,
        title: `${type === 'usuarios' ? 'Usuarios' : 'Tickets'} - ${punto.nombre}`,
        data: puntoBase,
        type: type,
      })

      // 3. SI EL TIPO ES TICKETS, DISPARAMOS INMEDIATAMENTE LA CARGA DE LA PÁGINA 1
      if (type === 'tickets') {
        await cargarTicketsDelPunto(punto.id, 1)
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'No se pudieron cargar los detalles'
      Swal.fire({
        title: 'Error',
        text: msg,
        icon: 'error',
      })
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const resp = await puntosVentaAPI.listarTodos()
      setPuntos(resp.data?.puntosVentas || [])
    } catch (error) {
      const msg = error.response?.data?.message || 'No se pudo cargar la información'
      Swal.fire({
        title: 'Error',
        text: msg,
        icon: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePunto = async (punto) => {
    const result = await Swal.fire({
      title: '¿Desactivar Punto de Venta?',
      text: `Esta acción afectará la operatividad de: ${punto.nombre}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EAB308',
    })
    if (!result.isConfirmed) return
    try {
      await puntosVentaAPI.eliminar(punto.id)
      fetchData()
    } catch (error) {
      const msg = error.response?.data?.message || 'No se pudo desactivar'
      Swal.fire({
        title: 'Error',
        text: msg,
        icon: 'error',
      })
    }
  }

  const handleRestorePunto = async (punto) => {
    const result = await Swal.fire({
      title: '¿Restaurar Punto de Venta?',
      text: `Vas a activar nuevamente: ${punto.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EAB308',
    })
    if (!result.isConfirmed) return
    try {
      await puntosVentaAPI.restaurar(punto.id)
      fetchData()
    } catch (error) {
      const msg = error.response?.data?.message || 'No se pudo restaurar'
      Swal.fire({
        title: 'Error',
        text: msg,
        icon: 'error',
      })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const uniqueLocations = useMemo(() => {
    const locs = puntos.map((p) => p.ubicacion).filter(Boolean)
    return [...new Set(locs)]
  }, [puntos])

  const filteredPuntos = useMemo(() => {
    return puntos.filter((p) => {
      const matchesLocation = locationFilter === 'Todos' || p.ubicacion === locationFilter
      let matchesStatus = true
      if (statusFilter === 'Activos') matchesStatus = p.activo === true
      if (statusFilter === 'Inactivos') matchesStatus = p.activo === false
      return matchesLocation && matchesStatus
    })
  }, [puntos, locationFilter, statusFilter])

  const totalPages = Math.ceil(filteredPuntos.length / itemsPerPage)
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredPuntos.slice(start, start + itemsPerPage)
  }, [filteredPuntos, currentPage])

  // Esta función se queda blindada por retrocompatibilidad por si se usa en otros flujos de tu UI
  const calcularRecaudacion = (tickets) => {
    if (!tickets || tickets.length === 0) return 0
    return tickets.reduce((acc, ticket) => {
      const sumaDetalles =
        ticket.DetallesTickets?.reduce((sum, det) => sum + parseFloat(det.montoApostado || 0), 0) ||
        0
      return acc + sumaDetalles
    }, 0)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [locationFilter, statusFilter])

  const handleEdit = (punto) => {
    setSelectedPunto(punto)
    setShowModal(true)
  }

  return {
    selectedPunto,
    setShowModal,
    setSelectedPunto,
    locationFilter,
    setLocationFilter,
    uniqueLocations,
    statusFilter,
    setStatusFilter,
    currentData,
    currentPage,
    setCurrentPage,
    totalPages,
    loading,
    openDetailView,
    calcularRecaudacion,
    handleEdit,
    handleDeletePunto,
    handleRestorePunto,
    showModal,
    fetchData,
    viewModal,
    setViewModal,

    // EXPORTAMOS LOS NUEVOS ESTADOS Y FUNCIONES PARA EL MODAL PAGINADO
    modalTickets,
    ticketPage,
    ticketTotalPages,
    loadingModalTickets,
    cargarTicketsDelPunto,
  }
}

export default usePuntoVenta
