import { puntosVentaAPI, rolAPI, usuarioAPI } from '@/api/index.api'
import { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'

const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [puntosVenta, setPuntosVenta] = useState([])
  const [loading, setLoading] = useState(true)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // SELECTORES DE FILTROS
  const [roleFilter, setRoleFilter] = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [puntoFilter, setPuntoFilter] = useState('Todos')

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const fetchData = async () => {
    setLoading(true)
    try {
      const [respUsuarios, respRoles, respPuntos] = await Promise.all([
        usuarioAPI.listarTodos(),
        rolAPI.listarTodos(),
        puntosVentaAPI.listarTodos(),
      ])

      setUsuarios(respUsuarios.data?.usuarios || [])
      setRoles(respRoles.data?.roles || [])
      setPuntosVenta(respPuntos.data?.puntosVentas || [])
    } catch (error) {
      const msg = error.response?.data?.message || 'No se pudo cargar la información de usuarios'
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

  // FILTRADO INTEGRAL MULTI-SELECTOR
  const filteredUsers = useMemo(() => {
    return usuarios.filter((u) => {
      const matchesRole = roleFilter === 'Todos' || u.Role?.id === roleFilter
      const matchesPunto = puntoFilter === 'Todos' || u.PuntosVentum?.id === puntoFilter

      let matchesStatus = true
      if (statusFilter === 'Activos') matchesStatus = u.activo === true
      if (statusFilter === 'Inactivos') matchesStatus = u.activo === false

      return matchesRole && matchesStatus && matchesPunto
    })
  }, [usuarios, roleFilter, statusFilter, puntoFilter])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredUsers.slice(start, start + itemsPerPage)
  }, [filteredUsers, currentPage])

  // Resetear paginación automáticamente ante mutación de filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [roleFilter, statusFilter, puntoFilter])

  const handleEdit = (user) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  // NUEVA FUNCIÓN: Manejador para auditar la actividad del usuario
  const handleViewActivity = (user) => {
    setSelectedUser(user)
    setShowActivityModal(true)
  }

  const handleDeleteUser = async (user) => {
    const result = await Swal.fire({
      title: '¿Desactivar Usuario?',
      text: `Vas a quitar el acceso a: ${user.nombresCompletos}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EAB308',
    })

    if (!result.isConfirmed) return

    try {
      await usuarioAPI.eliminar(user.id)
      Swal.fire({
        title: 'Desactivado',
        text: 'Acceso restringido correctamente.',
        icon: 'success',
      })
      fetchData()
    } catch (error) {
      const msg = error.response?.data?.message
      Swal.fire({
        title: 'Error',
        text: msg || 'No se pudo procesar la solicitud.',
        icon: 'error',
      })
    }
  }

  const handleRestoreUser = async (user) => {
    const result = await Swal.fire({
      title: '¿Restaurar Usuario?',
      text: `Vas a activar nuevamente a: ${user.nombresCompletos}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EAB308',
    })

    if (!result.isConfirmed) return

    try {
      await usuarioAPI.restaurar(user.id)
      Swal.fire({
        title: 'Restaurado',
        text: 'El usuario vuelve a estar operativo.',
        icon: 'success',
        background: '#111615',
        color: '#fff',
      })
      fetchData()
    } catch (error) {
      const msg = error.response?.data?.message || 'No se pudo restaurar el usuario'
      Swal.fire({
        title: 'Error',
        text: msg,
        icon: 'error',
      })
    }
  }
  return {
    setSelectedUser,
    setShowModal,
    roleFilter,
    setRoleFilter,
    roles,
    setStatusFilter,
    statusFilter,
    puntosVenta,
    puntoFilter,
    setPuntoFilter,
    filteredUsers,
    loading,
    currentData,
    handleDeleteUser,
    handleEdit,
    handleRestoreUser,
    handleViewActivity,
    currentPage,
    setCurrentPage,
    totalPages,
    showModal,
    selectedUser,
    fetchData,
    showActivityModal,
    setShowActivityModal,
  }
}

export default useUsuarios
