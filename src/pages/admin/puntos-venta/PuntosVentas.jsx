import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  LuChevronLeft,
  LuChevronRight,
  LuDollarSign,
  LuFilter,
  LuInbox,
  LuMapPin,
  LuPencil,
  LuPlus,
  LuRefreshCw,
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

const PuntosVenta = () => {
  const [viewModal, setViewModal] = useState({ open: false, title: '', data: [], type: '' })
  const [puntos, setPuntos] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedPunto, setSelectedPunto] = useState(null)

  const [locationFilter, setLocationFilter] = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('Todos')

  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const openDetailView = (punto, type) => {
    setViewModal({
      open: true,
      title: `${type === 'usuarios' ? 'Usuarios' : 'Tickets'} - ${punto.nombre}`,
      data: punto, // <--- PASAMOS EL OBJETO COMPLETO, NO SOLO EL ARRAY
      type: type,
    })
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const resp = await puntosVentaAPI.listarTodos()
      setPuntos(resp.data?.puntosVentas || [])
    } catch (error) {
      Swal.fire({ title: 'Error', text: 'No se pudo cargar la información', icon: 'error', background: '#111615', color: '#fff' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const uniqueLocations = useMemo(() => {
    const locs = puntos.map((p) => p.ubicacion).filter(Boolean)
    return [...new Set(locs)]
  }, [puntos])

  const filteredPuntos = useMemo(() => {
    return puntos.filter((p) => {
      const matchesLocation = locationFilter === 'Todos' || p.ubicacion === locationFilter
      let matchesStatus = true
      if (statusFilter === 'Activos') matchesStatus = p.activo === true
      if (statusFilter === 'Inactivos') matchesStatus = p.activo === false
      return matchesLocation && matchesStatus
    })
  }, [puntos, locationFilter, statusFilter])

  const totalPages = Math.ceil(filteredPuntos.length / itemsPerPage)
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredPuntos.slice(start, start + itemsPerPage)
  }, [filteredPuntos, currentPage])

  const calcularRecaudacion = (tickets) => {
    if (!tickets || tickets.length === 0) return 0;
    return tickets.reduce((acc, ticket) => {
      const sumaDetalles = ticket.DetallesTickets?.reduce((sum, det) => sum + parseFloat(det.montoApostado || 0), 0) || 0;
      return acc + sumaDetalles;
    }, 0);
  };

  useEffect(() => {
    setCurrentPage(1)
  }, [locationFilter, statusFilter])

  const handleEdit = (punto) => {
    setSelectedPunto(punto)
    setShowModal(true)
  }

  const handleDeletePunto = async (punto) => {
    const result = await Swal.fire({
      title: '¿Desactivar Punto de Venta?',
      text: `Esta acción afectará la operatividad de: ${punto.nombre}.`,
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
      await puntosVentaAPI.eliminar(punto.id)
      fetchData()
    } catch (error) { Swal.fire({ title: 'Error', text: 'No se pudo desactivar', icon: 'error', background: '#111615', color: '#fff' }) }
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
      background: '#111615',
      color: '#fff',
    })
    if (!result.isConfirmed) return
    try {
      await puntosVentaAPI.restaurar(punto.id)
      fetchData()
    } catch (error) { Swal.fire({ title: 'Error', text: 'No se pudo restaurar', icon: 'error', background: '#111615', color: '#fff' }) }
  }

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      <div className="flex justify-between items-center mb-10">
        <Title titulo="Puntos de Venta" descripcion="Sucursales y centros de operación" />
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#EAB308' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setSelectedPunto(null); setShowModal(true) }}
          className="bg-luck-gold text-black font-black py-3 px-6 rounded-2xl flex items-center gap-2 uppercase text-xs shadow-lg shadow-luck-gold/10 transition-colors"
        >
          <LuPlus size={16} strokeWidth={3} /> Nuevo Punto
        </motion.button>
      </div>

      <motion.div className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-8 flex flex-wrap items-center gap-4">
        <div className="relative w-full sm:w-56">
          <LuMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" size={16} />
          <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-xs appearance-none cursor-pointer uppercase font-bold">
            <option value="Todos">Todas las ubicaciones</option>
            {uniqueLocations.map((loc, idx) => <option key={idx} value={loc}>{loc}</option>)}
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
      </motion.div>

      <motion.div variants={containerVariants} className="bg-[#111615] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-zinc-500 uppercase text-[10px] font-black tracking-[0.18em] border-b border-white/5">
                <th className="p-5 pl-8">Punto de Venta</th>
                <th className="p-5">Ubicación</th>
                <th className="p-5 text-center">Usuarios</th>
                <th className="p-5 text-center">Tickets</th>
                <th className="p-5 text-center">Recaudado</th>
                <th className="p-5 text-center">Estado</th>
                <th className="p-5 text-right pr-8">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              <AnimatePresence mode="popLayout" initial={false}>
                {loading ? (
                  <tr><td colSpan="7" className="p-16 text-center text-zinc-600 font-black text-xs uppercase">Cargando...</td></tr>
                ) : currentData.length > 0 ? (
                  currentData.map((punto) => (
                    <motion.tr key={punto.id} variants={rowVariants} layout className="group hover:bg-white/[0.01] transition-colors">
                      <td className="p-5 pl-8">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-luck-gold/10 border border-luck-gold/20 flex items-center justify-center text-luck-gold"><LuStore size={16} /></div>
                          <span className="text-white font-black text-sm tracking-tight lowercase first-letter:uppercase">{punto.nombre}</span>
                        </div>
                      </td>
                      <td className="p-5 text-zinc-400 text-xs">{punto.ubicacion}</td>
                      <td className="p-5 text-center">
                        <motion.button whileHover={{ scale: 1.05 }} onClick={() => openDetailView(punto, 'usuarios')} className="flex items-center justify-center gap-2 text-zinc-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:border-luck-gold/40 transition-all mx-auto">
                          <LuUsers size={13} className="text-luck-gold" />
                          <span className="font-mono text-[11px] font-bold">{punto.Usuarios?.length || 0}</span>
                        </motion.button>
                      </td>
                      <td className="p-5 text-center">
                        <motion.button whileHover={{ scale: 1.05 }} onClick={() => openDetailView(punto, 'tickets')} className="flex items-center justify-center gap-2 text-zinc-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:border-luck-gold/40 transition-all mx-auto">
                          <LuTicket size={13} className="text-luck-gold" />
                          <span className="font-mono text-[11px] font-bold">{punto.Tickets?.length || 0}</span>
                        </motion.button>
                      </td>
                      <td className="p-5 text-center text-luck-gold font-mono font-bold text-xs"><div className="flex items-center justify-center gap-1"><LuDollarSign size={13} />{calcularRecaudacion(punto.Tickets).toFixed(2)}</div></td>
                      <td className="p-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${punto.activo ? 'bg-green-500/5 text-green-500 border-green-500/20' : 'bg-red-500/5 text-red-500 border-red-500/20'}`}>
                          {punto.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="p-5 pr-8">
                        <div className="flex justify-end gap-2.5">
                          <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleEdit(punto)} className="p-2 bg-zinc-900/40 border border-white/5 rounded-lg text-zinc-500 hover:text-luck-gold"><LuPencil size={15} /></motion.button>
                          {punto.activo ? (
                            <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDeletePunto(punto)} className="p-2 bg-zinc-900/40 border border-white/5 rounded-lg text-zinc-500 hover:text-red-500"><LuTrash2 size={15} /></motion.button>
                          ) : (
                            <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleRestorePunto(punto)} className="p-2 bg-zinc-900/40 border border-white/5 rounded-lg text-zinc-500 hover:text-green-500"><LuRefreshCw size={15} /></motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr><td colSpan="7" className="p-20 text-center text-zinc-500 text-xs font-black uppercase">No se encontraron puntos de venta</td></tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="p-5 border-t border-white/5 bg-white/[0.01] flex justify-between items-center text-[9px]">
            <span className="text-zinc-500 font-black uppercase tracking-widest">Pág {currentPage} de {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 bg-zinc-900 rounded-lg text-zinc-500 hover:text-luck-gold"><LuChevronLeft size={16} /></button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 bg-zinc-900 rounded-lg text-zinc-500 hover:text-luck-gold"><LuChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </motion.div>

      <PuntoVentaModal isOpen={showModal} onClose={() => setShowModal(false)} initialData={selectedPunto} fetchData={fetchData} />
      <DetallePuntoModal isOpen={viewModal.open} onClose={() => setViewModal({ ...viewModal, open: false })} title={viewModal.title} data={viewModal.data} type={viewModal.type} />
    </motion.div>
  )
}

export default PuntosVenta