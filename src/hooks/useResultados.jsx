import { resultadoAPI } from '@/api/index.api'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

const useResultados = () => {
  const [showModal, setShowModal] = useState(false)
  const [showDetalle, setShowDetalle] = useState(false)
  const [showFlyerModal, setShowFlyerModal] = useState(false)
  const [selectedResultado, setSelectedResultado] = useState(null)
  const [groupedFlyerData, setGroupedFlyerData] = useState(null)

  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedEditResultado, setSelectedEditResultado] = useState(null)

  // NUEVOS ESTADOS PARA FILTROS SELECTORES
  const [jornadaFilter, setJornadaFilter] = useState('Todos')
  const [utilidadFilter, setUtilidadFilter] = useState('Todos')

  const [resultados, setResultados] = useState([])
  const [loading, setLoading] = useState(true)

  // --- LÓGICA DE PAGINACIÓN CONTROLADA POR BACKEND ---
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1) // Ahora viene de la API
  const itemsPerPage = 6 // Tu limit fijo

  const handleActualizarResultado = (resultado) => {
    setSelectedEditResultado(resultado)
    setShowEditModal(true)
  }

  // Modificamos fetchData para que escuche la página y el límite
  const fetchData = async () => {
    setLoading(true)
    try {
      const resp = await resultadoAPI.listar({
        page: currentPage,
        limit: itemsPerPage,
        jornada: jornadaFilter !== 'Todos' ? jornadaFilter : undefined, // Filtro enviado al back
        utilidad: utilidadFilter !== 'Todos' ? utilidadFilter : undefined, // Filtro enviado al back
      })

      const restData = resp.data || {}
      setResultados(restData.data || [])
      setTotalPages(restData.totalPages || 1)
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al obtener la información',
      })
    } finally {
      setLoading(false)
    }
  }

  // Cada vez que cambie la página actual, traemos la nueva porción de la base de datos
  useEffect(() => {
    fetchData()
  }, [currentPage])

  const currentData = resultados

  // Resetear página automáticamente al cambiar los filtros visuales de la UI
  useEffect(() => {
    setCurrentPage(1)
    // Si la página ya era 1, el useEffect de arriba no se disparará solo, por lo que llamamos a fetchData manual
    if (currentPage === 1) {
      fetchData()
    }
  }, [jornadaFilter, utilidadFilter])

  const handleOpenDetalle = (resultado) => {
    setSelectedResultado(resultado)
    setShowDetalle(true)
  }

  return {
    resultados,
    setGroupedFlyerData,
    setShowFlyerModal,
    setJornadaFilter,
    jornadaFilter,
    utilidadFilter,
    setUtilidadFilter,
    loading,
    currentData, // Mantiene el renderizado exacto de tu tabla
    handleOpenDetalle,
    totalPages, // Ahora alimenta dinámicamente tu paginador con el count de Postgres
    currentPage,
    setCurrentPage,
    showModal,
    setShowModal,
    fetchData,
    showDetalle,
    setShowDetalle,
    selectedResultado,
    showFlyerModal,
    groupedFlyerData,

    showEditModal,
    setShowEditModal,
    selectedEditResultado,
    handleActualizarResultado,
  }
}

export default useResultados
