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
import UsuariosPorRolModal from '@/components/UsuariosPorRolModal'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const rowVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.99, transition: { duration: 0.15 } },
}

const Roles = () => {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedRol, setSelectedRol] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedRolUsers, setSelectedRolUsers] = useState({
    nombre: '',
    usuarios: []
  })

  const itemsPerPage = 6

  const fetchData = async () => {
    setLoading(true)
    try {
      const resp = await rolAPI.listarTodos()
      console.log(resp.data?.roles)
      setRoles(resp.data?.roles || [])
    } catch (error) {
      Swal.fire({ title: 'Error', text: 'No se pudo cargar la información', icon: 'error', background: '#111615', color: '#fff' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const filteredRoles = useMemo(() =>
    roles.filter((r) => r.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    , [roles, searchTerm])

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage)

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredRoles.slice(start, start + itemsPerPage)
  }, [filteredRoles, currentPage])

  useEffect(() => { setCurrentPage(1) }, [searchTerm])

  const handleDeleteRol = async (rol) => {
    const result = await Swal.fire({
      title: '¿Eliminar Rol?',
      text: `Al eliminar ${rol.nombre}, los usuarios asignados perderán este nivel de acceso.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EAB308',
      background: '#111615',
      color: '#fff',
    })
    if (!result.isConfirmed) return
    try {
      await rolAPI.eliminar(rol.id)
      fetchData()
    } catch (error) {
      Swal.fire({ title: 'Error', text: 'No se pudo eliminar', icon: 'error', background: '#111615', color: '#fff' })
    }
  }

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      <div className="flex justify-between items-center mb-10">
        <Title titulo="Gestión de Roles" descripcion="Niveles de acceso y permisos del sistema" />
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#EAB308' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setSelectedRol(null); setShowModal(true) }}
          className="bg-luck-gold text-black font-black py-3 px-6 rounded-2xl flex items-center gap-2 uppercase text-[10px] tracking-widest shadow-lg shadow-luck-gold/10 transition-colors"
        >
          <LuPlus size={16} strokeWidth={3} /> Nuevo Rol
        </motion.button>
      </div>

      <motion.div className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-8 flex justify-between items-center gap-4">
        <div className="relative w-full max-w-sm">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" size={16} />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-luck-gold/50 text-xs transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-4">
          {filteredRoles.length} Roles
        </span>
      </motion.div>

      <motion.div variants={containerVariants} className="bg-[#111615] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-zinc-600 uppercase text-[9px] font-black tracking-[0.2em]">
                <th className="p-6 pl-10">Nombre del Rol</th>
                <th className="p-6 text-center">Usuarios Asignados</th>
                <th className="p-6 text-right pr-10">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              <AnimatePresence mode="popLayout" initial={false}>
                {loading ? (
                  <tr><td colSpan="3" className="p-20 text-center text-zinc-500 font-black text-xs uppercase">Cargando...</td></tr>
                ) : currentData.length > 0 ? (
                  currentData.map((rol) => (
                    <motion.tr key={rol.id} variants={rowVariants} layout className="group hover:bg-white/[0.01] transition-colors">
                      <td className="p-5 pl-10">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-luck-gold/10 border border-luck-gold/20 flex items-center justify-center text-luck-gold"><LuShieldCheck size={18} /></div>
                          <div>
                            <p className="text-white font-bold text-sm uppercase">{rol.nombre}</p>
                            <p className="text-[10px] text-zinc-600 font-mono">ID: {rol.id.substring(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedRolUsers({ nombre: rol.nombre, usuarios: rol.Usuarios })
                            setShowUserModal(true)
                          }}
                          className="flex items-center justify-center gap-2 text-zinc-300 bg-white/5 hover:bg-luck-gold/10 hover:text-luck-gold w-fit mx-auto px-3 py-1 rounded-lg border border-white/5 transition-all"
                        >
                          <LuUsers size={12} />
                          <span className="font-mono text-[11px] font-bold">{rol.Usuarios?.length || 0}</span>
                        </motion.button>
                      </td>
                      <td className="p-5 pr-10">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { setSelectedRol(rol); setShowModal(true) }} className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-luck-gold transition-colors"><LuPencil size={16} /></button>
                          <button onClick={() => handleDeleteRol(rol)} className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-red-500 transition-colors"><LuTrash2 size={16} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr><td colSpan="3" className="p-20 text-center text-zinc-600 font-black text-xs uppercase">No hay roles registrados</td></tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-5 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Pág {currentPage} de {totalPages}</span>
            <div className="flex gap-1">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 bg-zinc-900 rounded-lg text-zinc-500 hover:text-luck-gold"><LuChevronLeft size={16} /></button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-[10px] font-bold ${currentPage === i + 1 ? 'bg-luck-gold text-black' : 'text-zinc-600 hover:bg-white/5'}`}>{i + 1}</button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 bg-zinc-900 rounded-lg text-zinc-500 hover:text-luck-gold"><LuChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </motion.div>

      <RolModal isOpen={showModal} onClose={() => setShowModal(false)} initialData={selectedRol} fetchData={fetchData} />

      <UsuariosPorRolModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        rolNombre={selectedRolUsers.nombre}
        usuarios={selectedRolUsers.usuarios}
      />
    </motion.div>
  )
}

export default Roles