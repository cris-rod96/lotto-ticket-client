import { catalogoAPI, cifraAPI, sorteoAPI } from '@/api/index.api'
import SorteoModal from '@/components/SorteoModal'
import Title from '@/components/Titlte'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  LuCalendar,
  LuChevronLeft,
  LuChevronRight,
  LuClock,
  LuFilter,
  LuGlobe,
  LuInbox,
  LuPencil,
  LuPlus,
  LuSearch,
  LuTrash2,
} from 'react-icons/lu'
import Swal from 'sweetalert2'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const rowVariants = {
  hidden: { x: -15, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
}

const Sorteos = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedSorteo, setSelectedSorteo] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')

  const [sorteos, setSorteos] = useState([])
  const [catalogos, setCatalogos] = useState([])
  const [cifras, setCifras] = useState([])

  // --- Lógica de Paginación ---
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5 // Puedes ajustar este número según prefieras

  const handleEdit = (sorteo) => {
    setSelectedSorteo(sorteo)
    setShowModal(true)
  }

  // Filtrado combinado (Búsqueda + Estado) usando useMemo para rendimiento
  const filteredSorteos = useMemo(() => {
    return sorteos.filter((s) => {
      const matchesSearch =
        s.numero.includes(searchTerm) ||
        s.Catalogo?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'Todos' || s.estado === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [sorteos, searchTerm, statusFilter])

  // Cálculo de datos paginados
  const totalPages = Math.ceil(filteredSorteos.length / itemsPerPage)

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredSorteos.slice(start, start + itemsPerPage)
  }, [filteredSorteos, currentPage])

  // Resetear a página 1 al filtrar o buscar
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  const fetchData = async () => {
    try {
      const [respSorteos, respCatalogos, respCifras] = await Promise.all([
        sorteoAPI.listarTodos(),
        catalogoAPI.listarTodos(),
        cifraAPI.listarTodas(),
      ])
      setSorteos(respSorteos.data?.sorteos || [])
      setCatalogos(respCatalogos.data?.catalogos || [])
      setCifras(respCifras.data?.cifras || [])
    } catch (error) {
      console.log(error)
    }
  }

  const handleSave = async (formData) => {
    try {
      const resp = await sorteoAPI.crear(formData)
      if (resp.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Registro existoso',
          text: 'Se ha creado el sorteo con éxito',
        })
      }
      setShowModal(false)
      fetchData()
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al procesar el sorteo'
      Swal.fire({
        icon: 'error',
        title: 'Se ha producido un error',
        text: msg,
      })
    }
  }

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val || 0)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      <div className="flex justify-between items-center mb-10">
        <Title
          titulo="Gestión de Sorteos"
          descripcion="Programación y control de eventos de lotería"
        />
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#EAB308' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setSelectedSorteo(null)
            setShowModal(true)
          }}
          className="bg-luck-gold text-black font-black py-3.5 px-6 rounded-2xl flex items-center gap-2 uppercase text-sm shadow-lg shadow-luck-gold/10 transition-colors"
        >
          <LuPlus size={20} strokeWidth={3} /> Programar Sorteo
        </motion.button>
      </div>

      {/* Barra de Filtros Dual */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-8 flex flex-col md:flex-row gap-4 items-center"
      >
        <div className="relative flex-1 w-full">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input
            type="text"
            placeholder="Buscar por número o nombre de juego..."
            className="w-full bg-zinc-950/40 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-luck-gold/40 transition-all placeholder:text-zinc-600 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative min-w-[200px] flex-1 md:flex-none">
            <LuFilter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              size={18}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-zinc-950/40 border border-white/5 rounded-2xl py-3.5 pl-12 pr-10 text-white focus:outline-none focus:border-luck-gold/40 transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="Todos">Todos los estados</option>
              <option value="Abierto">Abierto</option>
              <option value="Cerrado">Cerrado</option>
              <option value="Finalizado">Finalizado</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
              <LuClock size={14} />
            </div>
          </div>

          <div className="hidden lg:block px-4 whitespace-nowrap">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              {filteredSorteos.length} Sorteos
            </span>
          </div>
        </div>
      </motion.div>

      {/* Contenedor de Tabla y Paginación */}
      <motion.div
        variants={containerVariants}
        className="bg-[#111615] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-zinc-500 uppercase text-[11px] font-bold tracking-[0.15em]">
                <th className="p-7">Sorteo</th>
                <th className="p-7">Lotería / País</th>
                <th className="p-7 text-center">Cifras</th>
                <th className="p-7 text-center">Jornada</th>
                <th className="p-7">Fecha / Hora</th>
                <th className="p-7 text-center">Estado</th>
                <th className="p-7 text-center">Tickets</th>
                <th className="p-7 text-center">Recaudado</th>
                <th className="p-7 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              <AnimatePresence mode="popLayout" initial={false}>
                {currentData.length > 0 ? (
                  currentData.map((sorteo) => (
                    <motion.tr
                      key={sorteo.id}
                      variants={rowVariants}
                      layout
                      className="group hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="p-7">
                        <div className="flex items-center gap-4">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-12 h-12 rounded-2xl bg-luck-gold/10 border border-luck-gold/20 flex items-center justify-center text-luck-gold font-black text-sm shadow-inner"
                          >
                            #{sorteo.numero}
                          </motion.div>
                        </div>
                      </td>
                      <td className="p-7">
                        <div className="flex flex-col gap-1">
                          <span className="text-zinc-200 font-bold text-[13px] uppercase tracking-wide">
                            {sorteo?.Catalogo?.nombre}
                          </span>
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-black uppercase">
                            <LuGlobe size={12} className="text-luck-gold/50" />{' '}
                            {sorteo?.Catalogo?.pais}
                          </div>
                        </div>
                      </td>
                      <td className="p-7 text-center">
                        <div className="inline-flex w-9 h-9 rounded-xl bg-zinc-900 border border-white/5 items-center justify-center text-zinc-300 font-black text-xs shadow-lg">
                          {sorteo?.Cifra?.cantidad}
                        </div>
                      </td>
                      <td className="p-7 text-center">
                        <span className="text-zinc-400 font-black bg-zinc-950 px-3 py-1.5 rounded-lg border border-white/5 text-[9px] uppercase tracking-widest">
                          {sorteo.jornada}
                        </span>
                      </td>
                      <td className="p-7">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-[12px] text-zinc-200 font-bold">
                            <LuCalendar size={14} className="text-luck-gold" /> {sorteo.fechaSorteo}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
                            <LuClock size={14} /> {sorteo.horaSorteo}
                          </div>
                        </div>
                      </td>
                      <td className="p-7 text-center">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                            sorteo.estado === 'Abierto'
                              ? 'bg-green-500/5 text-green-500 border-green-500/20'
                              : sorteo.estado === 'Cerrado'
                                ? 'bg-orange-500/5 text-orange-500 border-orange-500/20'
                                : 'bg-red-500/5 text-red-500 border-red-500/20'
                          }`}
                        >
                          {sorteo.estado}
                        </span>
                      </td>

                      <td className="p-7 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-white font-black text-lg">
                            {sorteo?.Tickets?.length || 0}
                          </span>
                          <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">
                            Vendidos
                          </span>
                        </div>
                      </td>

                      <td className="p-7 text-center">
                        <div className="inline-block bg-white/5 border border-white/5 px-4 py-2 rounded-2xl">
                          <span className="text-luck-gold font-black text-sm font-mono">
                            {formatCurrency(sorteo.montoRecaudado || 0.0)}
                          </span>
                        </div>
                      </td>

                      <td className="p-7">
                        <div className="flex justify-end gap-3">
                          <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.05)' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(sorteo)}
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
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan="9" className="p-32 text-center">
                      <div className="flex flex-col items-center justify-center opacity-20">
                        <LuInbox size={60} className="mb-4 text-luck-gold" />
                        <p className="text-xs font-black uppercase tracking-[0.4em] text-white">
                          No se encontraron sorteos
                        </p>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* --- PAGINACIÓN ESTILO LUCK --- */}
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

      <SorteoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialData={selectedSorteo}
        catalogos={catalogos}
        cifras={cifras}
        onSave={handleSave}
      />
    </motion.div>
  )
}

export default Sorteos
