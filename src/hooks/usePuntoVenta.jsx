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

  const openDetailView = (punto, type) => {
    setViewModal({
      open: true,
      title: `${type === 'usuarios' ? 'Usuarios' : 'Tickets'} - ${punto.nombre}`,
      data: punto, // <--- PASAMOS EL OBJETO COMPLETO, NO SOLO EL ARRAY
      type: type,
    })
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const resp = await puntosVentaAPI.listarTodos()
      console.log(resp.data?.puntosVentas)
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
  }
}

export default usePuntoVenta
