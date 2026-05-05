import { catalogoAPI } from '@/api/index.api'
import CatalogoModal from '@/components/CatalogoModal'
import Title from '@/components/Titlte'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  LuChevronLeft,
  LuChevronRight,
  LuGlobe,
  LuInbox,
  LuPencil,
  LuPlus,
  LuSearch,
  LuTrash2,
} from 'react-icons/lu'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const rowVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

const Catalogo = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [catalogos, setCatalogos] = useState([])

  // Lógica de Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  const fetchData = async () => {
    try {
      const resp = await catalogoAPI.listarTodos()
      setCatalogos(resp.data.catalogos || [])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Filtrado y Paginación Computada
  const filtered = useMemo(() => {
    return catalogos.filter((c) => c.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [catalogos, searchTerm])

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
    if (refresh) fetchData() // Solo recarga si hubo un guardado exitoso
  }

  // Resetear a página 1 al buscar
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      <div className="flex justify-between items-center mb-10">
        <Title
          titulo="Catálogo de Juegos"
          descripcion="Definición de productos de lotería por región"
        />
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#EAB308' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOpenModal()}
          className="bg-luck-gold text-black font-black py-3.5 px-6 rounded-2xl flex items-center gap-2 uppercase text-sm shadow-lg shadow-luck-gold/10"
        >
          <LuPlus size={20} strokeWidth={3} /> Nuevo Juego
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div className="relative w-full md:w-1/2">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input
            type="text"
            placeholder="Buscar juego por nombre..."
            className="w-full bg-zinc-950/40 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-luck-gold/40 transition-all placeholder:text-zinc-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Indicador de registros */}
        <div className="px-4">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            {filtered.length} Juegos Encontrados
          </span>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="bg-[#111615] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="overflow-x-hidden overflow-y-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-zinc-500 uppercase text-[11px] font-bold tracking-[0.15em]">
                <th className="p-7 pl-10">Nombre del Juego</th>
                <th className="p-7">País</th>
                <th className="p-7 text-center">Estado</th>
                <th className="p-7 text-right pr-10">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              <AnimatePresence mode="popLayout" initial={false}>
                {currentData.length > 0 ? (
                  currentData.map((item) => (
                    <motion.tr
                      key={item.id}
                      variants={rowVariants}
                      layout
                      className="group hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="p-7 pl-10 font-bold text-white uppercase text-sm tracking-tight">
                        {item.nombre}
                      </td>
                      <td className="p-7">
                        <div className="flex items-center gap-2.5 text-zinc-400">
                          <LuGlobe size={16} className="text-luck-gold/60" />
                          <span className="font-medium text-zinc-300">
                            {item.pais === 'EC' ? 'Ecuador' : 'Argentina'}
                          </span>
                        </div>
                      </td>
                      <td className="p-7 text-center">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            item.activo
                              ? 'bg-green-500/5 text-green-500 border-green-500/20'
                              : 'bg-red-500/5 text-red-500 border-red-500/20'
                          }`}
                        >
                          {item.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="p-7 pr-10">
                        <div className="flex justify-end gap-3">
                          <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.05)' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedItem(item)
                              setShowModal(true)
                            }}
                            className="p-3 bg-zinc-900/50 border border-white/5 rounded-xl text-zinc-400 hover:text-luck-gold transition-colors"
                          >
                            <LuPencil size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(239,68,68,0.1)' }}
                            whileTap={{ scale: 0.9 }}
                            className="p-3 bg-zinc-900/50 border border-white/5 rounded-xl text-zinc-400 hover:text-red-500 transition-colors"
                          >
                            <LuTrash2 size={18} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  /* ESTADO VACÍO DENTRO DE LA TABLA */
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan="4" className="p-32 text-center">
                      <div className="flex flex-col items-center justify-center opacity-20">
                        <LuInbox size={60} className="mb-4 text-luck-gold" />
                        <p className="text-xs font-black uppercase tracking-[0.4em] text-white">
                          No se encontraron juegos
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-2">
                          Prueba con otro término de búsqueda
                        </p>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

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
                className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-10 disabled:hover:text-zinc-500 transition-all"
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
                className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-10 disabled:hover:text-zinc-500 transition-all"
              >
                <LuChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <CatalogoModal
        isOpen={showModal}
        onClose={() => handleCloseModal()}
        initialData={selectedItem}
        fetchData={fetchData}
      />
    </motion.div>
  )
}

export default Catalogo
