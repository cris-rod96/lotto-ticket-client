import { rolAPI } from '@/api/index.api'
import { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'

const useRoles = () => {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedRol, setSelectedRol] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedRolUsers, setSelectedRolUsers] = useState({
    nombre: '',
    usuarios: [],
  })

  const itemsPerPage = 6

  const fetchData = async () => {
    setLoading(true)
    try {
      const resp = await rolAPI.listarTodos()

      setRoles(resp.data?.roles || [])
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

  useEffect(() => {
    fetchData()
  }, [])

  const filteredRoles = useMemo(
    () => roles.filter((r) => r.nombre.toLowerCase().includes(searchTerm.toLowerCase())),
    [roles, searchTerm]
  )

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage)

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredRoles.slice(start, start + itemsPerPage)
  }, [filteredRoles, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleDeleteRol = async (rol) => {
    const result = await Swal.fire({
      title: '¿Eliminar Rol?',
      text: `Al eliminar ${rol.nombre}, los usuarios asignados perderán este nivel de acceso.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EAB308',
    })
    if (!result.isConfirmed) return
    try {
      await rolAPI.eliminar(rol.id)
      fetchData()
    } catch (error) {
      const msg = error.response?.data?.message || 'No se pudo eliminar'
      Swal.fire({
        title: 'Error',
        text: msg,
        icon: 'error',
      })
    }
  }
  return {
    setSelectedRol,
    setShowModal,
    searchTerm,
    setSearchTerm,
    filteredRoles,
    loading,
    currentData,
    currentPage,
    setCurrentPage,
    totalPages,
    handleDeleteRol,
    setSelectedRolUsers,
    setShowUserModal,
    showModal,
    selectedRol,
    fetchData,
    showUserModal,
    selectedRolUsers,
  }
}

export default useRoles
