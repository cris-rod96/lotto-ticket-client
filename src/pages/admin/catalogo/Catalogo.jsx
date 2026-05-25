import { catalogoAPI } from '@/api/index.api'
import CatalogoModal from '@/components/CatalogoModal'
import Title from '@/components/Titlte'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  LuChevronLeft,
  LuChevronRight,
  LuFilter,
  LuGlobe,
  LuInbox,
  LuPencil,
  LuPlus,
  LuTrash2,
} from 'react-icons/lu'
import Swal from 'sweetalert2'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const rowVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.99, transition: { duration: 0.15 } },
}

const Catalogo = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [catalogos, setCatalogos] = useState([])

  const [countryFilter, setCountryFilter] = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('Todos')

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5 // Ajustado para consistencia

  const fetchData = async () => {
    try {
      const resp = await catalogoAPI.listarTodos()
      setCatalogos(resp.data?.catalogos || [])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filtered = useMemo(() => {
    return catalogos.filter((c) => {
      const matchesCountry = countryFilter === 'Todos' || c.pais === countryFilter
      let matchesStatus = true
      if (statusFilter === 'Activos') matchesStatus = c.activo === true
      if (statusFilter === 'Inactivos') matchesStatus = c.activo === false
      return matchesCountry && matchesStatus
    })
  }, [catalogos, countryFilter, statusFilter])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filtered.slice(start, start + itemsPerPage)
  }, [filtered, currentPage])

  const handleOpenModal = (item = null) => {
    setSelectedItem(item)
    setShowModal(true)
  }

  const handleCloseModal = (refresh = false) => {
    setShowModal(false)
    setSelectedItem(null)
    if (refresh) fetchData()
  }

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: '¿Desactivar Juego?',
      text: `Vas a restringir el acceso a: ${item.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EAB308',
      // Eliminamos background y color para que tome el estilo por defecto (blanco)
    })

    if (!result.isConfirmed) return

    try {
      await catalogoAPI.eliminar(item.id)
      Swal.fire({
        title: 'Desactivado',
        text: 'El juego ha sido restringido correctamente.',
        icon: 'success',
      })
      fetchData()
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo procesar la solicitud.',
        icon: 'error',
      })
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [countryFilter, statusFilter])

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      <div className="flex justify-between items-center mb-10">
        <Title titulo="Catálogo de Juegos" descripcion="Definición de productos de lotería por región" />
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#EAB308' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOpenModal()}
          className="bg-luck-gold text-black font-black py-3.5 px-6 rounded-2xl flex items-center gap-2 uppercase text-xs shadow-lg shadow-luck-gold/10 transition-colors tracking-wider"
        >
          <LuPlus size={18} strokeWidth={3} /> Nuevo Juego
        </motion.button>
      </div>

      <motion.div className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-8 flex flex-wrap items-center gap-4">
        <div className="relative w-full sm:w-56">
          <LuGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" size={16} />
          <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-xs appearance-none cursor-pointer uppercase font-bold">
            <option value="Todos">Todos los países</option>
            <option value="EC">Ecuador</option>
            <option value="AR">Argentina</option>
          </select>
        </div>

        <div className="relative w-full sm:w-56">
          <LuFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" size={16} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-xs appearance-none cursor-pointer uppercase font-bold">
            <option value="Todos">Todos los estados</option>
            <option value="Activos">Activos</option>
            <option value="Inactivos">Inactivos</option>
          </select>
        </div>

        <div className="ml-auto px-2 hidden lg:block">
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{filtered.length} Juegos Filtrados</span>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} className="bg-[#111615] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-zinc-500 uppercase text-[10px] font-black tracking-[0.18em] border-b border-white/5">
                <th className="p-5 pl-8">Nombre del Juego</th>
                <th className="p-5">País</th>
                <th className="p-5 text-center">Estado</th>
                <th className="p-5 text-right pr-8">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              <AnimatePresence mode="popLayout" initial={false}>
                {currentData.length > 0 ? (
                  currentData.map((item) => (
                    <motion.tr key={item.id} variants={rowVariants} layout className="group hover:bg-white/[0.01] transition-colors">
                      <td className="p-5 pl-8">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-luck-gold/10 border border-luck-gold/20 flex items-center justify-center text-luck-gold"><LuGlobe size={16} /></div>
                          <span className="text-white font-black text-sm tracking-tight">{item.nombre}</span>
                        </div>
                      </td>
                      <td className="p-5 text-zinc-400 text-xs font-bold uppercase tracking-wider">{item.pais === 'EC' ? 'Ecuador' : 'Argentina'}</td>
                      <td className="p-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${item.activo ? 'bg-green-500/5 text-green-500 border-green-500/20' : 'bg-red-500/5 text-red-500 border-red-500/20'}`}>
                          {item.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="p-5 pr-8">
                        <div className="flex justify-end gap-2.5">
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleOpenModal(item)} className="p-2 bg-zinc-900/40 border border-white/5 rounded-lg text-zinc-500 hover:text-luck-gold transition-colors"><LuPencil size={15} /></motion.button>
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 bg-zinc-900/40 border border-white/5 rounded-lg text-zinc-500 hover:text-red-500 transition-colors" onClick={() => handleDelete(item)}><LuTrash2 size={15} /></motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="p-20 text-center"><LuInbox size={50} className="mx-auto text-luck-gold opacity-30" /><p className="text-[10px] font-black uppercase text-white mt-4 tracking-widest opacity-30">No se encontraron juegos</p></td></tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-5 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Página {currentPage} de {totalPages}</p>
            <div className="flex items-center gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-luck-gold transition-all"><LuChevronLeft size={16} /></button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-7 h-7 rounded-md text-[9px] font-black ${currentPage === i + 1 ? 'bg-luck-gold text-black' : 'text-zinc-500 hover:bg-white/5'}`}>{i + 1}</button>
                ))}
              </div>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-luck-gold transition-all"><LuChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </motion.div>

      <CatalogoModal isOpen={showModal} onClose={(refresh) => handleCloseModal(refresh)} initialData={selectedItem} fetchData={fetchData} />
    </motion.div>
  )
}

export default Catalogo