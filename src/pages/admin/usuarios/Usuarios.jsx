import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  LuChevronLeft,
  LuChevronRight,
  LuInbox,
  LuMapPin,
  LuPencil,
  LuPlus,
  LuRefreshCw,
  LuSearch,
  LuTrash2,
  LuUserCog,
  LuUsers,
} from 'react-icons/lu'
import Swal from 'sweetalert2'

import { puntosVentaAPI, rolAPI, usuarioAPI } from '@/api/index.api'
import Title from '@/components/Titlte'
import UsuarioModal from '@/components/UsuarioModal'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const rowVariants = {
  hidden: { x: -15, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
}

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [puntosVenta, setPuntosVenta] = useState([])

  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // ⬇️ PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  const fetchData = async () => {
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
      Swal.fire('Error', 'No se pudo cargar la información de usuarios', 'error')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ⬇️ FILTRADO + MEMO
  const filteredUsers = useMemo(() => {
    return usuarios.filter(
      (u) =>
        u.nombresCompletos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.alias.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [usuarios, searchTerm])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredUsers.slice(start, start + itemsPerPage)
  }, [filteredUsers, currentPage])

  // Resetear página al buscar
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleEdit = (user) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  const handleDeleteUser = async (user) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a desactivar al usuario: ${user.nombresCompletos}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
    })

    if (!result.isConfirmed) return // Usuario canceló

    try {
      await usuarioAPI.eliminar(user.id)
      Swal.fire({
        title: 'Desactivado',
        text: 'El usuario fue desactivado correctamente.',
        icon: 'success',
      })

      fetchData()
    } catch (error) {
      const msg = error.response?.data?.message
      Swal.fire({
        title: 'Error',
        text: msg || 'No se pudo desactivar el usuario. Intenta nuevamente.',
        icon: 'error',
      })
    }
  }

  const handleRestoreUser = async (user) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a restaurar al usuario: ${user.nombresCompletos}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar',
    })

    if (!result.isConfirmed) return // Usuario canceló

    try {
      await usuarioAPI.restaurar(user.id)
      Swal.fire({
        title: 'Restaurado',
        text: 'El usuario fue activado correctamente.',
        icon: 'success',
      })

      fetchData()
    } catch (error) {
      const msg = error.response?.data?.message
      Swal.fire({
        title: 'Error',
        text: msg || 'No se pudo restaurar el usuario. Intenta nuevamente.',
        icon: 'error',
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
          className="bg-luck-gold text-black font-black py-3.5 px-6 rounded-2xl flex items-center gap-2 uppercase text-sm shadow-lg shadow-luck-gold/10 transition-colors"
        >
          <LuPlus size={20} strokeWidth={3} /> Nuevo Usuario
        </motion.button>
      </div>

      {/* Buscador */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-8"
      >
        <div className="relative">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o alias..."
            className="w-full bg-zinc-950/40 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-luck-gold/40 transition-all placeholder:text-zinc-600 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Tabla */}
      <motion.div
        variants={containerVariants}
        className="bg-[#111615] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] text-zinc-500 uppercase text-[11px] font-bold tracking-[0.15em]">
              <th className="p-7">Usuario</th>
              <th className="p-7">Alias</th>
              <th className="p-7">Rol</th>
              <th className="p-7">Punto Venta</th>
              <th className="p-7 text-center">Estado</th>
              <th className="p-7 text-right pr-10">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.03]">
            <AnimatePresence mode="popLayout" initial={false}>
              {currentData.length > 0 ? (
                currentData.map((user) => (
                  <motion.tr
                    key={user.id}
                    variants={rowVariants}
                    layout
                    className="group hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="p-7">
                      <div className="flex items-center gap-4">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-12 h-12 rounded-2xl bg-luck-gold/10 border border-luck-gold/20 flex items-center justify-center text-luck-gold"
                        >
                          <LuUsers size={22} />
                        </motion.div>
                        <span className="text-white font-black text-lg tracking-tight">
                          {user.nombresCompletos}
                        </span>
                      </div>
                    </td>

                    <td className="p-7 text-white font-mono">{user.alias}</td>

                    <td className="p-7">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <LuUserCog size={14} className="text-luck-gold" />
                        {user.Role?.nombre || '—'}
                      </div>
                    </td>

                    <td className="p-7">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <LuMapPin size={14} />
                        {user.PuntosVentum?.nombre || 'Sin punto'}
                      </div>
                    </td>

                    <td className="p-7 text-center">
                      {user.activo ? (
                        <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase border bg-green-500/5 text-green-500 border-green-500/20">
                          Activo
                        </span>
                      ) : (
                        <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase border bg-red-500/5 text-red-500 border-red-500/20">
                          Inactivo
                        </span>
                      )}
                    </td>

                    <td className="p-7 pr-10">
                      <div className="flex justify-end gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleEdit(user)}
                          className="p-3 bg-zinc-900/50 border border-white/5 rounded-xl text-zinc-400 hover:text-luck-gold"
                        >
                          <LuPencil size={18} />
                        </motion.button>
                        {user.activo === true ? (
                          <motion.button
                            onClick={() => handleDeleteUser(user)}
                            whileHover={{ scale: 1.1 }}
                            className="p-3 bg-zinc-900/50 border border-white/5 rounded-xl text-zinc-400 hover:text-red-500"
                          >
                            <LuTrash2 size={18} />
                          </motion.button>
                        ) : (
                          <motion.button
                            onClick={() => handleRestoreUser(user)}
                            whileHover={{ scale: 1.1 }}
                            className="p-3 bg-zinc-900/50 border border-white/5 rounded-xl text-zinc-400 hover:text-red-500"
                          >
                            <LuRefreshCw size={18} />
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td colSpan="7" className="p-32 text-center">
                    <div className="flex flex-col items-center justify-center opacity-20">
                      <LuInbox size={60} className="mb-4 text-luck-gold" />
                      <p className="text-xs font-black uppercase tracking-[0.4em] text-white">
                        No se encontraron usuarios
                      </p>
                    </div>
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>

        {/* PAGINACIÓN ESTILO LUCK */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Página {currentPage} de {totalPages}
            </p>

            <div className="flex items-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-10 transition-all"
              >
                <LuChevronLeft size={20} />
              </button>

              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${
                      currentPage === i + 1
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
                className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-10 transition-all"
              >
                <LuChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <UsuarioModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialData={selectedUser} // null o {} cuando es crear
        roles={roles} // lista
        puntosVenta={puntosVenta}
        fetchData={fetchData}
      />
    </motion.div>
  )
}

export default Usuarios
