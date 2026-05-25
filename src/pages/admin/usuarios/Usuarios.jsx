import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  LuChevronLeft,
  LuChevronRight,
  LuFilter,
  LuInbox,
  LuMapPin,
  LuPencil,
  LuPlus,
  LuRefreshCw,
  LuTrash2,
  LuUserCog,
  LuUsers,
  LuEye, // <-- Nuevo icono para ver actividad
} from 'react-icons/lu'
import Swal from 'sweetalert2'

import { puntosVentaAPI, rolAPI, usuarioAPI } from '@/api/index.api'
import Title from '@/components/Titlte'
import UsuarioModal from '@/components/UsuarioModal'
import ActividadUsuarioModal from '@/components/ActividadUsuarioModal'

// Variantes de animación consistentes
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const rowVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.99, transition: { duration: 0.15 } },
}

const Usuarios = () => {
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
      Swal.fire({
        title: 'Error',
        text: 'No se pudo cargar la información de usuarios',
        icon: 'error',
        background: '#111615',
        color: '#fff',
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
      background: '#111615',
      color: '#fff',
    })

    if (!result.isConfirmed) return

    try {
      await usuarioAPI.eliminar(user.id)
      Swal.fire({
        title: 'Desactivado',
        text: 'Acceso restringido correctamente.',
        icon: 'success',
        background: '#111615',
        color: '#fff',
      })
      fetchData()
    } catch (error) {
      const msg = error.response?.data?.message
      Swal.fire({
        title: 'Error',
        text: msg || 'No se pudo procesar la solicitud.',
        icon: 'error',
        background: '#111615',
        color: '#fff',
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
      background: '#111615',
      color: '#fff',
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
      Swal.fire({
        title: 'Error',
        text: 'No se pudo restaurar el usuario.',
        icon: 'error',
        background: '#111615',
        color: '#fff',
      })
    }
  }

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-10">
        <Title titulo="Gestión de Usuarios" descripcion="Administración y control de accesos" />

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#EAB308' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setSelectedUser(null)
            setShowModal(true)
          }}
          className="bg-luck-gold text-black font-black py-3.5 px-6 rounded-2xl flex items-center gap-2 uppercase text-xs shadow-lg shadow-luck-gold/10 transition-colors tracking-wider"
        >
          <LuPlus size={18} strokeWidth={3} /> Nuevo Usuario
        </motion.button>
      </div>

      {/* BARRA DE FILTROS SELECTS */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-8 flex flex-wrap items-center gap-4"
      >
        {/* SELECT 1: POR ROLES */}
        <div className="relative w-full sm:w-56">
          <LuUserCog className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" size={16} />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-xs appearance-none cursor-pointer uppercase font-bold"
          >
            <option value="Todos">Todos los roles</option>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>{rol.nombre}</option>
            ))}
          </select>
        </div>

        {/* SELECT 2: POR ESTADO */}
        <div className="relative w-full sm:w-56">
          <LuFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" size={16} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-xs appearance-none cursor-pointer uppercase font-bold"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Activos">Activos</option>
            <option value="Inactivos">Inactivos</option>
          </select>
        </div>

        {/* SELECT 3: POR PUNTO DE VENTA */}
        <div className="relative w-full sm:w-60">
          <LuMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" size={16} />
          <select
            value={puntoFilter}
            onChange={(e) => setPuntoFilter(e.target.value)}
            className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-xs appearance-none cursor-pointer uppercase font-bold"
          >
            <option value="Todos">Todos los puntos</option>
            {puntosVenta.map((punto) => (
              <option key={punto.id} value={punto.id}>{punto.nombre}</option>
            ))}
          </select>
        </div>

        <div className="ml-auto px-2 hidden lg:block">
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
            {filteredUsers.length} Usuarios Filtrados
          </span>
        </div>
      </motion.div>

      {/* Tabla Estilizada */}
      <motion.div
        variants={containerVariants}
        className="bg-[#111615] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-zinc-500 uppercase text-[10px] font-black tracking-[0.18em] border-b border-white/5">
                <th className="p-5 pl-8">Usuario</th>
                <th className="p-5">Alias</th>
                <th className="p-5">Rol</th>
                <th className="p-5">Punto Venta</th>
                <th className="p-5 text-center">Estado</th>
                <th className="p-5 text-right pr-8">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.02]">
              <AnimatePresence mode="popLayout" initial={false}>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-16 text-center animate-pulse text-zinc-600 font-black text-xs tracking-widest uppercase">
                      Cargando registros...
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((user) => (
                    <motion.tr
                      key={user.id}
                      variants={rowVariants}
                      layout
                      className="group hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="p-5 pl-8">
                        <div className="flex items-center gap-3">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-9 h-9 rounded-xl bg-luck-gold/10 border border-luck-gold/20 flex items-center justify-center text-luck-gold shrink-0"
                          >
                            <LuUsers size={16} />
                          </motion.div>
                          <span className="text-white font-black text-sm tracking-tight lowercase first-letter:uppercase">
                            {user.nombresCompletos}
                          </span>
                        </div>
                      </td>

                      <td className="p-5 text-zinc-400 font-mono text-xs tracking-wider">
                        {user.alias}
                      </td>

                      <td className="p-5">
                        <div className="flex items-center gap-2 text-zinc-300">
                          <LuUserCog size={13} className="text-luck-gold/70" />
                          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                            {user.Role?.nombre || '—'}
                          </span>
                        </div>
                      </td>

                      <td className="p-5">
                        <div className="flex items-center gap-2 text-zinc-400">
                          <LuMapPin size={13} className="text-zinc-600" />
                          <span className="text-xs text-zinc-400">
                            {user.PuntosVentum?.nombre || 'Sin punto'}
                          </span>
                        </div>
                      </td>

                      <td className="p-5 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${user.activo
                            ? 'bg-green-500/5 text-green-500 border-green-500/20'
                            : 'bg-red-500/5 text-red-500 border-red-500/20'
                            }`}
                        >
                          {user.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>

                      <td className="p-5 pr-8">
                        <div className="flex justify-end gap-2.5">
                          {/* NUEVO BOTÓN: VER ACTIVIDAD / RENDIMIENTO */}
                          <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(56,189,248,0.08)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewActivity(user)}
                            className="p-2 bg-zinc-900/40 border border-white/5 rounded-lg text-zinc-500 hover:text-sky-400 transition-colors"
                            title="Ver Actividad y Rendimiento"
                          >
                            <LuEye size={15} />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.04)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(user)}
                            className="p-2 bg-zinc-900/40 border border-white/5 rounded-lg text-zinc-500 hover:text-luck-gold transition-colors"
                          >
                            <LuPencil size={15} />
                          </motion.button>

                          {user.activo ? (
                            <motion.button
                              whileHover={{ scale: 1.05, backgroundColor: 'rgba(239,68,68,0.08)' }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeleteUser(user)}
                              className="p-2 bg-zinc-900/40 border border-white/5 rounded-lg text-zinc-500 hover:text-red-500 transition-colors"
                            >
                              <LuTrash2 size={15} />
                            </motion.button>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.05, backgroundColor: 'rgba(34,197,94,0.08)' }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRestoreUser(user)}
                              className="p-2 bg-zinc-900/40 border border-white/5 rounded-lg text-zinc-500 hover:text-green-500 transition-colors"
                            >
                              <LuRefreshCw size={15} />
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan="6" className="p-24 text-center">
                      <div className="flex flex-col items-center justify-center opacity-30">
                        <LuInbox size={50} className="mb-3 text-luck-gold" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                          No se encontraron usuarios
                        </p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mt-1">
                          Prueba cambiando los selectores de filtro
                        </p>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="p-5 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
              Página {currentPage} de {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-luck-gold disabled:opacity-10 transition-all"
              >
                <LuChevronLeft size={16} />
              </button>

              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-7 h-7 rounded-md text-[9px] font-black transition-all ${currentPage === i + 1
                      ? 'bg-luck-gold text-black'
                      : 'text-zinc-500 hover:bg-white/5'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-luck-gold disabled:opacity-10 transition-all"
              >
                <LuChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {
        showModal && (

          <UsuarioModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            initialData={selectedUser}
            roles={roles}
            puntosVenta={puntosVenta}
            fetchData={fetchData}
          />
        )
      }

      {
        showActivityModal && (
          <ActividadUsuarioModal
            isOpen={showActivityModal}
            onClose={() => setShowActivityModal(false)}
            usuario={selectedUser}
          />
        )
      }
    </motion.div>
  )
}

export default Usuarios