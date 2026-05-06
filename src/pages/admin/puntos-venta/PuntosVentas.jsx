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
  LuStore,
  LuTicket,
  LuTrash2,
  LuUsers,
} from 'react-icons/lu'
import Swal from 'sweetalert2'

import { puntosVentaAPI } from '@/api/index.api'
import DetallePuntoModal from '@/components/DetallePuntoModal'
import PuntoVentaModal from '@/components/PuntoVentaModal'
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

const PuntosVenta = () => {
  const [viewModal, setViewModal] = useState({ open: false, title: '', data: [], type: '' })
  const [puntos, setPuntos] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedPunto, setSelectedPunto] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const openDetailView = (punto, type) => {
    const isUser = type === 'usuarios'
    setViewModal({
      open: true,
      title: `${isUser ? 'Usuarios' : 'Tickets'} - ${punto.nombre}`,
      data: isUser ? punto.Usuarios : punto.Tickets, // Asumiendo que tu API trae los includes
      type: type,
    })
  }

  const fetchData = async () => {
    try {
      const resp = await puntosVentaAPI.listarTodos()
      setPuntos(resp.data?.puntosVentas || [])
    } catch (error) {
      Swal.fire('Error', 'No se pudo cargar la información de puntos de venta', 'error')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredPuntos = useMemo(() => {
    return puntos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [puntos, searchTerm])

  const totalPages = Math.ceil(filteredPuntos.length / itemsPerPage)

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredPuntos.slice(start, start + itemsPerPage)
  }, [filteredPuntos, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Handlers para acciones (Lógica visual por ahora)
  const handleEdit = (punto) => {
    setSelectedPunto(punto)
    setShowModal(true)
  }

  const handleDeletePunto = async (punto) => {
    const result = await Swal.fire({
      title: '¿Desactivar Punto de Venta?',
      text: `Esta acción afectará la operatividad de: ${punto.nombre}. Los usuarios asignados no podrán realizar ventas.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EAB308', // Luck Gold
      cancelButtonColor: '#71717a', // Zinc 500
    })

    if (!result.isConfirmed) return

    try {
      await puntosVentaAPI.eliminar(punto.id)

      Swal.fire({
        title: 'Desactivado',
        text: 'El punto de venta ha sido marcado como inactivo.',
        icon: 'success',
      })

      fetchData()
    } catch (error) {
      const msg = error.response?.data?.message || 'No se pudo desactivar el punto'
      Swal.fire({
        title: 'Error',
        text: msg,
        icon: 'error',
      })
    }
  }

  const handleRestorePunto = async (punto) => {
    const result = await Swal.fire({
      title: '¿Restaurar Punto de Venta?',
      text: `Vas a activar nuevamente: ${punto.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EAB308',
    })

    if (!result.isConfirmed) return

    try {
      await puntosVentaAPI.restaurar(punto.id)
      Swal.fire({
        title: 'Restaurado',
        text: 'El punto de venta vuelve a estar operativo.',
        icon: 'success',
      })
      fetchData()
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo restaurar el punto',
        icon: 'error',
      })
    }
  }

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-10">
        <Title titulo="Puntos de Venta" descripcion="Sucursales y centros de operación" />

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#EAB308' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setSelectedPunto(null)
            setShowModal(true)
          }}
          className="bg-luck-gold text-black font-black py-3.5 px-6 rounded-2xl flex items-center gap-2 uppercase text-sm shadow-lg shadow-luck-gold/10 transition-colors"
        >
          <LuPlus size={20} strokeWidth={3} /> Nuevo Punto
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
            placeholder="Buscar por nombre o ubicación..."
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
              <th className="p-7">Punto de Venta</th>
              <th className="p-7">Ubicación</th>
              <th className="p-7 text-center">Usuarios</th>
              <th className="p-7 text-center">Tickets</th>
              <th className="p-7 text-center">Estado</th>
              <th className="p-7 text-right pr-10">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.03]">
            <AnimatePresence mode="popLayout" initial={false}>
              {currentData.length > 0 ? (
                currentData.map((punto) => (
                  <motion.tr
                    key={punto.id}
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
                          <LuStore size={22} />
                        </motion.div>
                        <span className="text-white font-black text-lg tracking-tight">
                          {punto.nombre}
                        </span>
                      </div>
                    </td>

                    <td className="p-7">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <LuMapPin size={16} className="text-luck-gold" />
                        <span className="text-sm">{punto.ubicacion}</span>
                      </div>
                    </td>

                    <td className="p-7 text-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => openDetailView(punto, 'usuarios')}
                        className="flex items-center justify-center gap-2 text-zinc-300 bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-luck-gold/40 transition-all mx-auto"
                      >
                        <LuUsers size={14} className="text-luck-gold" />
                        <span className="font-mono text-xs font-bold">
                          {punto.Usuarios?.length || 0}
                        </span>
                      </motion.button>
                    </td>

                    <td className="p-7 text-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => openDetailView(punto, 'tickets')}
                        className="flex items-center justify-center gap-2 text-zinc-300 bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-luck-gold/40 transition-all mx-auto"
                      >
                        <LuTicket size={14} className="text-luck-gold" />
                        <span className="font-mono text-xs font-bold">
                          {punto.Tickets?.length || 0}
                        </span>
                      </motion.button>
                    </td>

                    <td className="p-7 text-center">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${
                          punto.activo
                            ? 'bg-green-500/5 text-green-500 border-green-500/20'
                            : 'bg-red-500/5 text-red-500 border-red-500/20'
                        }`}
                      >
                        {punto.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    <td className="p-7 pr-10">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleEdit(punto)}
                          className="p-3 bg-zinc-900/50 border border-white/5 rounded-xl text-zinc-400 hover:text-luck-gold transition-colors"
                        >
                          <LuPencil size={18} />
                        </button>
                        {punto.activo ? (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleDeletePunto(punto)}
                            className="p-3 bg-zinc-900/50 border border-white/5 rounded-xl text-zinc-400 hover:text-red-500 transition-colors"
                          >
                            <LuTrash2 size={18} />
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleRestorePunto(punto)}
                            className="p-3 bg-zinc-900/50 border border-white/5 rounded-xl text-zinc-400 hover:text-green-500 transition-colors"
                          >
                            <LuRefreshCw size={18} />
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr className="p-32 text-center">
                  <td colSpan="6" className="p-32 text-center text-zinc-600">
                    <LuInbox size={60} className="mx-auto mb-4 opacity-20" />
                    <p className="uppercase tracking-widest text-xs">No hay puntos de venta</p>
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
              {/* Aquí podrías mapear los números de página igual que en Usuarios */}
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

      {/* El modal lo definiremos luego para la lógica de guardado */}
      <PuntoVentaModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialData={selectedPunto}
        fetchData={fetchData}
      />

      <DetallePuntoModal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ ...viewModal, open: false })}
        title={viewModal.title}
        data={viewModal.data}
        type={viewModal.type}
      />
    </motion.div>
  )
}

export default PuntosVenta
