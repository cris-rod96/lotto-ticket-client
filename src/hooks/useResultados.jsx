import { resultadoAPI } from '@/api/index.api'
import { useEffect, useMemo, useState } from 'react'

const useResultados = () => {
  const [showModal, setShowModal] = useState(false)
  const [showDetalle, setShowDetalle] = useState(false)
  const [showFlyerModal, setShowFlyerModal] = useState(false)
  const [selectedResultado, setSelectedResultado] = useState(null)
  const [groupedFlyerData, setGroupedFlyerData] = useState(null)

  // NUEVOS ESTADOS PARA FILTROS SELECTORES
  const [jornadaFilter, setJornadaFilter] = useState('Todos')
  const [utilidadFilter, setUtilidadFilter] = useState('Todos')

  const [resultados, setResultados] = useState([])
  const [loading, setLoading] = useState(true)

  // --- LÓGICA DE PAGINACIÓN ---
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const fetchData = async () => {
    setLoading(true)
    try {
      const resp = await resultadoAPI.listar()
      setResultados(resp.data?.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Filtrado de resultados mediante puros selects de alto contraste
  const filteredResults = useMemo(() => {
    return resultados.filter((r) => {
      const jornadaSorteo = r.Sorteo?.jornada || ''
      const utilidadNeta = parseFloat(r.Sorteo?.utilidadNeta || 0)

      const matchesJornada = jornadaFilter === 'Todos' || jornadaSorteo === jornadaFilter

      let matchesUtilidad = true
      if (utilidadFilter === 'Positiva') matchesUtilidad = utilidadNeta >= 0
      if (utilidadFilter === 'Negativa') matchesUtilidad = utilidadNeta < 0

      return matchesJornada && matchesUtilidad
    })
  }, [resultados, jornadaFilter, utilidadFilter])

  // Paginación computada
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage)
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredResults.slice(start, start + itemsPerPage)
  }, [filteredResults, currentPage])

  // Resetear página automáticamente al cambiar los filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [jornadaFilter, utilidadFilter])

  const handleOpenDetalle = (resultado) => {
    setSelectedResultado(resultado)
    setShowDetalle(true)
  }
  return {
    resultados,
    setGroupedFlyerData,
    setShowFlyerModal,
    filteredResults,
    setJornadaFilter,
    jornadaFilter,
    utilidadFilter,
    setUtilidadFilter,
    loading,
    currentData,
    handleOpenDetalle,
    totalPages,
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
  }
}

export default useResultados
