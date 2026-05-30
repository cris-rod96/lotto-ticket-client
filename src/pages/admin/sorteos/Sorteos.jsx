import { catalogoAPI, cifraAPI, sorteoAPI } from '@/api/index.api'
import SorteoModal from '@/components/SorteoModal'
import Title from '@/components/Titlte'
import usePaginationWindow from '@/hooks/usePaginationWindow'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  LuCalendar,
  LuChevronLeft,
  LuChevronRight,
  LuClock,
  LuFilter,
  LuGlobe,
  LuInbox,
  LuLayers,
  LuPencil,
  LuPlus,
  LuShuffle,
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

  // Estados de filtros selectores (Añadido el estado de filtro por fecha)
  const [catalogoFilter, setCatalogoFilter] = useState('Todos')
  const [jornadaFilter, setJornadaFilter] = useState('Todos')
  const [cifraFilter, setCifraFilter] = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [dateFilter, setDateFilter] = useState('') // Formato YYYY-MM-DD o vacío

  const [sorteos, setSorteos] = useState([])
  const [catalogos, setCatalogos] = useState([])
  const [cifras, setCifras] = useState([])

  // Variables de control de paginación del Servidor
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 5

  const handleEdit = (sorteo) => {
    setSelectedSorteo(sorteo)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F00',
    })

    if (result.isConfirmed) {
      try {
        const resp = await sorteoAPI.eliminar(id)
        Swal.fire({
          title: 'Eliminado',
          icon: 'success',
          text: resp.data?.message || 'Eliminación exitosa',
        })
        fetchDataSorteos()
      } catch (error) {
        const msg = error.response?.data?.message || 'No se pudo eliminar'
        Swal.fire({ title: 'Error', text: msg, icon: 'error' })
      }
    }
  }

  // Usamos el hook pasándole la página actual y el total de páginas provisto por el servidor
  const pageNumbers = usePaginationWindow(currentPage, totalPages)

  // Carga independiente de Sorteos Paginados y Filtrados desde el Backend
  const fetchDataSorteos = async () => {
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        CatalogoId: catalogoFilter,
        jornada: jornadaFilter,
        CifraId: cifraFilter,
        estado: statusFilter,
        fechaSorteo: dateFilter || undefined,
      }

      const respSorteos = await sorteoAPI.listarTodos(params)

      setSorteos(respSorteos.data?.sorteos || [])
      setTotalPages(respSorteos.data?.totalPages || 1)
      setTotalItems(respSorteos.data?.totalItems || 0)
    } catch (error) {
      error
    }
  }

  // Carga inicial estática para los componentes selectores de la matriz
  const fetchFiltrosData = async () => {
    try {
      const [respCatalogos, respCifras] = await Promise.all([
        catalogoAPI.listarTodos(),
        cifraAPI.listarTodas(),
      ])
      setCatalogos(respCatalogos.data?.catalogos || [])
      setCifras(respCifras.data?.cifras || [])
    } catch (error) {
      error
    }
  }

  // Se ejecuta cada vez que cambia la página actual o se manipula algún filtro
  useEffect(() => {
    fetchDataSorteos()
  }, [currentPage, catalogoFilter, jornadaFilter, cifraFilter, statusFilter, dateFilter])

  // Resetear a página 1 automáticamente cuando cambie cualquier filtro
  useEffect(() => {
    setCurrentPage(1)
  }, [catalogoFilter, jornadaFilter, cifraFilter, statusFilter, dateFilter])

  const handleSave = async (formData) => {
    try {
      let resp
      const esEdicion = !!selectedSorteo?.id

      if (esEdicion) {
        resp = await sorteoAPI.actualizar(selectedSorteo.id, formData)
        Swal.fire({
          icon: 'success',
          title: 'Sorteo Actualizado',
          text: resp.data?.message || 'Los cambios se guardaron correctamente',
        })
      } else {
        resp = await sorteoAPI.crear(formData)
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: resp.data?.message || 'Se ha creado el sorteo con éxito',
        })
      }

      setShowModal(false)
      fetchDataSorteos()
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
    fetchFiltrosData()
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

      {/* MATRIZ DE FILTROS SELECTS MAS PEQUEÑOS - Ahora grid-cols-5 en lg */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111615] border border-white/5 p-3 rounded-2xl mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center"
      >
        {/* SELECT 1: POR JUEGO (CATÁLOGO) */}
        <div className="relative w-full">
          <LuShuffle
            className="absolute left-3 top-1/2 -translate-y-1/2 text-luck-gold"
            size={15}
          />
          <select
            value={catalogoFilter}
            onChange={(e) => setCatalogoFilter(e.target.value)}
            className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-2 pl-9 pr-8 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-xs appearance-none cursor-pointer uppercase font-bold"
          >
            <option value="Todos" className="bg-[#1a1f1e] text-white">
              Todos los juegos
            </option>
            {catalogos.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-[#1a1f1e] text-white">
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* SELECT 2: POR JORNADA */}
        <div className="relative w-full">
          <LuClock className="absolute left-3 top-1/2 -translate-y-1/2 text-luck-gold" size={15} />
          <select
            value={jornadaFilter}
            onChange={(e) => setJornadaFilter(e.target.value)}
            className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-2 pl-9 pr-8 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-xs appearance-none cursor-pointer uppercase font-bold"
          >
            <option value="Todos" className="bg-[#1a1f1e] text-white">
              Todas las jornadas
            </option>
            <option value="Matutina" className="bg-[#1a1f1e] text-white">
              Matutina
            </option>
            <option value="Vespertina" className="bg-[#1a1f1e] text-white">
              Vespertina
            </option>
            <option value="Nocturna" className="bg-[#1a1f1e] text-white">
              Nocturna
            </option>
          </select>
        </div>

        {/* SELECT 3: POR CIFRAS */}
        <div className="relative w-full">
          <LuLayers className="absolute left-3 top-1/2 -translate-y-1/2 text-luck-gold" size={15} />
          <select
            value={cifraFilter}
            onChange={(e) => setCifraFilter(e.target.value)}
            className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-2 pl-9 pr-8 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-xs appearance-none cursor-pointer uppercase font-bold"
          >
            <option value="Todos" className="bg-[#1a1f1e] text-white">
              Todas las cifras
            </option>
            {cifras.map((cif) => (
              <option key={cif.id} value={cif.id} className="bg-[#1a1f1e] text-white">
                {cif.cantidad} Cifras
              </option>
            ))}
          </select>
        </div>

        {/* SELECT 4: POR ESTADO */}
        <div className="relative w-full">
          <LuFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-luck-gold" size={15} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-2 pl-9 pr-8 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-xs appearance-none cursor-pointer uppercase font-bold"
          >
            <option value="Todos" className="bg-[#1a1f1e] text-white">
              Todos los estados
            </option>
            <option value="Abierto" className="bg-[#1a1f1e] text-white">
              Abierto
            </option>
            <option value="Cerrado" className="bg-[#1a1f1e] text-white">
              Cerrado
            </option>
            <option value="Finalizado" className="bg-[#1a1f1e] text-white">
              Finalizado
            </option>
          </select>
        </div>

        {/* NUEVO FILTRO 5: POR FECHA */}
        <div className="relative w-full">
          <LuCalendar
            className="absolute left-3 top-1/2 -translate-y-1/2 text-luck-gold"
            size={15}
          />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-xs cursor-pointer uppercase font-bold text-center"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 hover:text-white font-black"
            >
              X
            </button>
          )}
        </div>
      </motion.div>

      {/* CONTADOR EN BASE A DATA DEL SERVIDOR */}
      <div className="mb-4 text-right pr-4 hidden lg:block">
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
          {totalItems} Sorteos filtrados
        </span>
      </div>

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
                {sorteos.length > 0 ? (
                  sorteos.map((sorteo) => (
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
                            onClick={() => handleDelete(sorteo.id)}
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

        {/* --- PAGINACIÓN CON EL HOOK INTEGRADO --- */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-between items-center select-none">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex items-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-10 disabled:hover:text-zinc-500 transition-all cursor-pointer"
              >
                <LuChevronLeft size={20} />
              </button>

              <div className="flex gap-1 items-center">
                {pageNumbers.map((page, index) => {
                  if (page === 'ellipsis-left' || page === 'ellipsis-right') {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="w-8 h-8 flex items-center justify-center text-zinc-600 text-[11px] font-black"
                      >
                        ...
                      </span>
                    )
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                        currentPage === page
                          ? 'bg-luck-gold text-black'
                          : 'text-zinc-500 hover:bg-white/5'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-10 disabled:hover:text-zinc-500 transition-all cursor-pointer"
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
