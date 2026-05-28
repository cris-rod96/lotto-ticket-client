import { respaldoAPI } from '@/api/index.api'
import { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'

const useRespaldos = () => {
  const [respaldos, setRespaldos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterDate, setFilterDate] = useState('') // Formato: 'YYYY-MM-DD'
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 6

  const fetchData = async () => {
    setLoading(true)
    try {
      const resp = await respaldoAPI.listarTodos()
      setRespaldos(resp.data?.respaldos || [])
    } catch (error) {
      const msg = error.response?.data?.message || 'No se pudo cargar el historial de respaldos'
      Swal.fire({
        title: 'Error',
        text: msg,
        icon: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Filtrado exacto por la fecha de creación
  const filteredRespaldos = useMemo(() => {
    if (!filterDate) return respaldos

    return respaldos.filter((r) => {
      // Extraemos la porción YYYY-MM-DD de la fecha del respaldo
      const backupDateStr = new Date(r.createdAt).toISOString().split('T')[0]
      return backupDateStr === filterDate
    })
  }, [respaldos, filterDate])

  const totalPages = Math.ceil(filteredRespaldos.length / itemsPerPage)

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredRespaldos.slice(start, start + itemsPerPage)
  }, [filteredRespaldos, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [filterDate])

  const handleCopiarLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url)
      Swal.fire({
        title: '¡Copiado!',
        text: 'El enlace del respaldo se copió al portapapeles.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      })
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo copiar el enlace automáticamente.',
        icon: 'error',
      })
    }
  }

  return {
    filterDate,
    setFilterDate,
    filteredRespaldos,
    loading,
    currentData,
    currentPage,
    setCurrentPage,
    totalPages,
    fetchData,
    handleCopiarLink,
  }
}

export default useRespaldos
