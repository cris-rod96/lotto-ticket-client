import { resultadoAPI } from '@/api/index.api'
import { useCallback, useEffect, useState } from 'react'

const useResultadosPorPunto = (puntoVentaId) => {
  // Estados de UI y Modales
  const [showModal, setShowModal] = useState(false)
  const [showDetalle, setShowDetalle] = useState(false)
  const [showFlyerModal, setShowFlyerModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  // Estados de Data
  const [resultados, setResultados] = useState([])
  const [selectedResultado, setSelectedResultado] = useState(null)
  const [selectedEditResultado, setSelectedEditResultado] = useState(null)
  const [groupedFlyerData, setGroupedFlyerData] = useState(null)

  // Estados de Filtros y Paginación
  const [jornadaFilter, setJornadaFilter] = useState('Todos')
  const [utilidadFilter, setUtilidadFilter] = useState('Todos')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 6

  // Función para obtener los datos desde la API
  const fetchData = useCallback(async () => {
    if (!puntoVentaId) return

    setLoading(true)
    try {
      const resp = await resultadoAPI.listarPorPunto({
        puntoVentaId: puntoVentaId,
        page: currentPage,
        limit: itemsPerPage,
        jornada: jornadaFilter !== 'Todos' ? jornadaFilter : undefined,
        utilidad: utilidadFilter !== 'Todos' ? utilidadFilter : undefined,
      })

      const restData = resp.data || {}
      console.log(resp.data)

      // Asignamos la data y totalPages que vienen del backend
      setResultados(restData.data || [])
      setTotalPages(restData.totalPages || 1)
    } catch (error) {
      console.error('Error al cargar resultados:', error)
      setResultados([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }, [puntoVentaId, currentPage, jornadaFilter, utilidadFilter])

  // Efecto principal para cargar data
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Efecto para resetear página cuando cambian filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [jornadaFilter, utilidadFilter, puntoVentaId])

  // Funciones de control
  const handleOpenDetalle = (resultado) => {
    setSelectedResultado(resultado)
    setShowDetalle(true)
  }

  const handleActualizarResultado = (resultado) => {
    setSelectedEditResultado(resultado)
    setShowEditModal(true)
  }

  return {
    // Data
    resultados,
    currentData: resultados,
    loading,

    // Paginación
    currentPage,
    setCurrentPage,
    totalPages,

    // Filtros
    jornadaFilter,
    setJornadaFilter,
    utilidadFilter,
    setUtilidadFilter,

    // Modales y Control
    showModal,
    setShowModal,
    showDetalle,
    setShowDetalle,
    showFlyerModal,
    setShowFlyerModal,
    showEditModal,
    setShowEditModal,

    // Selección
    selectedResultado,
    selectedEditResultado,
    groupedFlyerData,
    setGroupedFlyerData,

    // Acciones
    fetchData,
    handleOpenDetalle,
    handleActualizarResultado,
  }
}

export default useResultadosPorPunto
