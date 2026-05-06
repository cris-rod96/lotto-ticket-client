import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  LuChevronLeft,
  LuChevronRight,
  LuInbox,
  LuPencil,
  LuPlus,
  LuSearch,
  LuShieldCheck,
  LuTrash2,
  LuUsers,
} from 'react-icons/lu'
import Swal from 'sweetalert2'

import { rolAPI } from '@/api/index.api'
import RolModal from '@/components/RolModal'
import Title from '@/components/Titlte'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const rowVariants = {
  hidden: { x: -15, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
}

const Roles = () => {
  const [roles, setRoles] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedRol, setSelectedRol] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const fetchData = async () => {
    try {
      const resp = await rolAPI.listarTodos()
      setRoles(resp.data?.roles || [])
    } catch (error) {
      Swal.fire('Error', 'No se pudo cargar la información de roles', 'error')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredRoles = useMemo(() => {
    return roles.filter((r) => r.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [roles, searchTerm])

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage)

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredRoles.slice(start, start + itemsPerPage)
  }, [filteredRoles, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleEdit = (rol) => {
    setSelectedRol(rol)
    setShowModal(true)
  }

  const handleDeleteRol = async (rol) => {
    const result = await Swal.fire({
      title: '¿Eliminar Rol?',
      text: `Vas a eliminar el rol: ${rol.nombre}. Asegúrate de que no haya usuarios asignados.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EAB308',
    })

    if (!result.isConfirmed) return

    try {
      await rolAPI.eliminar(rol.id)
      Swal.fire('Eliminado', 'El rol ha sido eliminado correctamente.', 'success')
      fetchData()
    } catch (error) {
      const msg = error.response?.data?.message || 'No se pudo eliminar el rol'
      Swal.fire('Error', msg, 'error')
    }
  }

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-10">
        <Title titulo="Gestión de Roles" descripcion="Niveles de acceso y permisos del sistema" />

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#EAB308' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setSelectedRol(null)
            setShowModal(true)
          }}
          className="bg-luck-gold text-black font-black py-3.5 px-6 rounded-2xl flex items-center gap-2 uppercase text-sm shadow-lg shadow-luck-gold/10 transition-colors"
        >
          <LuPlus size={20} strokeWidth={3} /> Nuevo Rol
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
            placeholder="Buscar por nombre de rol..."
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
              <th className="p-7">Identificador / Nombre</th>
              <th className="p-7 text-center">Usuarios Asignados</th>
              <th className="p-7 text-right pr-10">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.03]">
            <AnimatePresence mode="popLayout" initial={false}>
              {currentData.length > 0 ? (
                currentData.map((rol) => (
                  <motion.tr
                    key={rol.id}
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
                          <LuShieldCheck size={22} />
                        </motion.div>
                        <div className="flex flex-col">
                          <span className="text-white font-black text-lg tracking-tight uppercase">
                            {rol.nombre}
                          </span>
                          <span className="text-[10px] text-zinc-600 font-mono italic">
                            ID: {rol.id.split('-')[0]}...
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-7 text-center">
                      <div className="flex items-center justify-center gap-2 text-zinc-300 bg-white/5 w-fit mx-auto px-4 py-1.5 rounded-full border border-white/5">
                        <LuUsers size={14} className="text-luck-gold" />
                        <span className="font-mono text-xs">{rol.Usuarios?.length || 0}</span>
                      </div>
                    </td>

                    <td className="p-7 pr-10">
                      <div className="flex justify-end gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleEdit(rol)}
                          className="p-3 bg-zinc-900/50 border border-white/5 rounded-xl text-zinc-400 hover:text-luck-gold transition-colors"
                        >
                          <LuPencil size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleDeleteRol(rol)}
                          className="p-3 bg-zinc-900/50 border border-white/5 rounded-xl text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          <LuTrash2 size={18} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr className="p-32 text-center">
                  <td colSpan="3" className="p-32 text-center">
                    <LuInbox size={60} className="mx-auto mb-4 opacity-20 text-luck-gold" />
                    <p className="uppercase tracking-widest text-xs text-zinc-600">
                      No se encontraron roles
                    </p>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 bg-zinc-900 rounded-lg text-zinc-500 hover:text-luck-gold disabled:opacity-20"
              >
                <LuChevronLeft size={18} />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 bg-zinc-900 rounded-lg text-zinc-500 hover:text-luck-gold disabled:opacity-20"
              >
                <LuChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <RolModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialData={selectedRol}
        fetchData={fetchData}
      />
    </motion.div>
  )
}

export default Roles
