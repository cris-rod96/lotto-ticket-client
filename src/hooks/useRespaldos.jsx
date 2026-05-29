import { respaldoAPI } from '@/api/index.api'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

const useRespaldos = () => {
  const [respaldos, setRespaldos] = useState([]) // Estos serán los datos de la página actual
  const [loading, setLoading] = useState(true)

  // Estados de Paginación del Servidor
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const itemsPerPage = 6

  const fetchData = async () => {
    setLoading(true)
    try {
      // Pasamos los parámetros de paginación al backend
      const resp = await respaldoAPI.listarTodos({
        page: currentPage,
        limit: itemsPerPage,
      })

      // Actualizamos con la nueva estructura que devuelve el backend
      setRespaldos(resp.data?.backups || [])
      setTotalPages(resp.data?.totalPages || 1)
      setTotalItems(resp.data?.totalItems || 0)
    } catch (error) {
      const msg = error.response?.data?.message || 'No se pudo cargar el historial de respaldos'
      Swal.fire({ title: 'Error', text: msg, icon: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // Se ejecuta cada vez que cambia la página actual
  useEffect(() => {
    fetchData()
  }, [currentPage])

  // NOTA: El filtro de fecha ahora debería ser una petición adicional o un filtro
  // que envíes al backend, ya que filtrar localmente paginación de servidor
  // no mostrará el total correcto. Por ahora lo dejamos listo para la paginación.

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
      Swal.fire({ title: 'Error', text: 'No se pudo copiar el enlace.', icon: 'error' })
    }
  }

  return {
    loading,
    currentData: respaldos, // Ahora son los datos del servidor
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    fetchData,
    handleCopiarLink,
  }
}

export default useRespaldos
