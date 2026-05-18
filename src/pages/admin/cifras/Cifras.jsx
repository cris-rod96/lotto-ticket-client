import { cifraAPI } from '@/api/index.api'
import CifraModal from '@/components/CifraModal'
import Title from '@/components/Titlte'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  LuChevronLeft,
  LuChevronRight,
  LuInbox,
  LuPencil,
  LuPlus,
  LuSearch,
  LuTrash2,
} from 'react-icons/lu'
import Swal from 'sweetalert2'

// Variantes de animación consistentes con los otros módulos
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const rowVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
}

const Cifras = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedCifra, setSelectedCifra] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [cifras, setCifras] = useState([])
  const [loading, setLoading] = useState(true)

  // --- LÓGICA DE PAGINACIÓN ---
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const fetchData = async () => {
    setLoading(true)
    try {
      const resp = await cifraAPI.listarTodas()
      setCifras(resp.data?.cifras || [])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Filtrado de cifras
  const filteredCifras = useMemo(() => {
    return cifras.filter((c) => c.cantidad.toString().includes(searchTerm))
  }, [cifras, searchTerm])

  // Paginación computada
  const totalPages = Math.ceil(filteredCifras.length / itemsPerPage)
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredCifras.slice(start, start + itemsPerPage)
  }, [filteredCifras, currentPage])

  // Resetear a página 1 al buscar
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleEdit = (cifra) => {
    setSelectedCifra(cifra)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EAB308',
      cancelButtonColor: '#111615',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#111615',
      color: '#fff',
    })

    if (result.isConfirmed) {
      try {
        // Asumiendo que cifraAPI tiene un método eliminar
        // await cifraAPI.eliminar(id)
        setCifras(cifras.filter((c) => c.id !== id))
        Swal.fire('Eliminado', 'La configuración ha sido eliminada.', 'success')
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el registro', 'error')
      }
    }
  }

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      <div className="flex justify-between items-center mb-10">
        <Title
          titulo="Gestión de Cifras"
          descripcion="Configuración de límites y montos por cantidad de números"
        />
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#EAB308' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setSelectedCifra(null)
            setShowModal(true)
          }}
          className="bg-luck-gold text-black font-black py-3.5 px-6 rounded-2xl flex items-center gap-2 uppercase text-sm shadow-lg shadow-luck-gold/10"
        >
          <LuPlus size={20} strokeWidth={3} /> Nueva Cifra
        </motion.button>
      </div>

      {/* Barra de Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div className="relative w-full md:w-1/2">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input
            type="text"
            placeholder="Buscar por cantidad de cifras (ej: 2)..."
            className="w-full bg-zinc-950/40 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-luck-gold/40 transition-all placeholder:text-zinc-600 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="px-4">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            {filteredCifras.length} Configuraciones Encontradas
          </span>
        </div>
      </motion.div>

      {/* Tabla Estilizada y Animada */}
      <motion.div
        variants={containerVariants}
        className="bg-[#111615] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-zinc-500 uppercase text-[11px] font-bold tracking-[0.15em]">
                <th className="p-7 pl-10">Cantidad</th>
                <th className="p-7">Cupo Máximo</th>
                <th className="p-7">Valor Mín. Ticket</th>
                <th className="p-7 text-center">Estado</th>
                <th className="p-7 text-right pr-10">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              <AnimatePresence mode="popLayout" initial={false}>
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-20 text-center animate-pulse text-zinc-500 font-black italic"
                    >
                      CARGANDO...
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((cifra) => (
                    <motion.tr
                      key={cifra.id}
                      variants={rowVariants}
                      layout
                      className="group hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="p-7 pl-10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-luck-gold/10 border border-luck-gold/20 flex items-center justify-center text-luck-gold font-black text-lg italic shadow-inner">
                            {cifra.cantidad}
                          </div>
                          <span className="text-white font-bold text-base uppercase tracking-tight">
                            {cifra.cantidad} Cifras
                          </span>
                        </div>
                      </td>
                      <td className="p-7 text-zinc-200 font-black italic text-lg">
                        ${parseFloat(cifra.cupoMaximoPorNumero).toFixed(2)}
                      </td>
                      <td className="p-7 text-zinc-200 font-black italic text-lg">
                        ${parseFloat(cifra.valorMinimoTicket).toFixed(2)}
                      </td>
                      <td className="p-7 text-center">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            cifra.activo
                              ? 'bg-green-500/5 text-green-500 border-green-500/20'
                              : 'bg-red-500/5 text-red-500 border-red-500/20'
                          }`}
                        >
                          {cifra.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="p-7 pr-10">
                        <div className="flex justify-end gap-3">
                          <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.05)' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(cifra)}
                            className="p-3 bg-zinc-900/50 border border-white/5 rounded-xl text-zinc-400 hover:text-luck-gold transition-colors"
                          >
                            <LuPencil size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(239,68,68,0.1)' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(cifra.id)}
                            className="p-3 bg-zinc-900/50 border border-white/5 rounded-xl text-zinc-400 hover:text-red-500 transition-colors"
                          >
                            <LuTrash2 size={18} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan="5" className="p-32 text-center">
                      <div className="flex flex-col items-center justify-center opacity-20">
                        <LuInbox size={60} className="mb-4 text-luck-gold" />
                        <p className="text-xs font-black uppercase tracking-[0.4em] text-white">
                          No hay configuraciones
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-2">
                          Prueba con otro término o crea una nueva
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

      {showModal && (
        <CifraModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          initialData={selectedCifra}
          fetchData={fetchData}
        />
      )}
    </motion.div>
  )
}

export default Cifras
