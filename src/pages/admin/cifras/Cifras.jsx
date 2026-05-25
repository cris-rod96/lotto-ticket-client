import { cifraAPI } from '@/api/index.api'
import CifraModal from '@/components/CifraModal'
import Title from '@/components/Titlte'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  LuChevronLeft,
  LuChevronRight,
  LuFilter,
  LuHash,
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

const Cifras = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedCifra, setSelectedCifra] = useState(null)
  const [cifras, setCifras] = useState([])
  const [loading, setLoading] = useState(true)

  const [digitsFilter, setDigitsFilter] = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('Todos')

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

  const uniqueDigits = useMemo(() => {
    const list = cifras.map((c) => c.cantidad).filter((val) => val !== undefined && val !== null)
    return [...new Set(list)].sort((a, b) => a - b)
  }, [cifras])

  const filteredCifras = useMemo(() => {
    return cifras.filter((c) => {
      const matchesDigits = digitsFilter === 'Todos' || c.cantidad.toString() === digitsFilter
      let matchesStatus = true
      if (statusFilter === 'Activos') matchesStatus = c.activo === true
      if (statusFilter === 'Inactivos') matchesStatus = c.activo === false
      return matchesDigits && matchesStatus
    })
  }, [cifras, digitsFilter, statusFilter])

  const totalPages = Math.ceil(filteredCifras.length / itemsPerPage)
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredCifras.slice(start, start + itemsPerPage)
  }, [filteredCifras, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [digitsFilter, statusFilter])

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
      background: '#111615',
      color: '#fff',
    })

    if (result.isConfirmed) {
      try {
        setCifras(cifras.filter((c) => c.id !== id))
        Swal.fire({ title: 'Eliminado', icon: 'success', background: '#111615', color: '#fff' })
      } catch (error) {
        Swal.fire({ title: 'Error', text: 'No se pudo eliminar', icon: 'error', background: '#111615', color: '#fff' })
      }
    }
  }

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      <div className="flex justify-between items-center mb-10">
        <Title titulo="Gestión de Cifras" descripcion="Configuración de límites y montos por cantidad de números" />
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#EAB308' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setSelectedCifra(null); setShowModal(true) }}
          className="bg-luck-gold text-black font-black py-3.5 px-6 rounded-2xl flex items-center gap-2 uppercase text-xs shadow-lg shadow-luck-gold/10 transition-colors tracking-wider"
        >
          <LuPlus size={18} strokeWidth={3} /> Nueva Cifra
        </motion.button>
      </div>

      <motion.div className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-8 flex flex-wrap items-center gap-4">
        <div className="relative w-full sm:w-56">
          <LuHash className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" size={16} />
          <select value={digitsFilter} onChange={(e) => setDigitsFilter(e.target.value)} className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-xs appearance-none cursor-pointer uppercase font-bold">
            <option value="Todos">Todas las cifras</option>
            {uniqueDigits.map((digit) => <option key={digit} value={digit}>{digit} Cifras</option>)}
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
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{filteredCifras.length} Registros Filtrados</span>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} className="bg-[#111615] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-zinc-500 uppercase text-[10px] font-black tracking-[0.18em] border-b border-white/5">
                <th className="p-5 pl-8">Cantidad</th>
                <th className="p-5">Cupo Máximo</th>
                <th className="p-5">Valor Mín. Ticket</th>
                <th className="p-5 text-center">Estado</th>
                <th className="p-5 text-right pr-8">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              <AnimatePresence mode="popLayout" initial={false}>
                {loading ? (
                  <tr><td colSpan="5" className="p-16 text-center text-zinc-600 font-black text-xs uppercase">Cargando registros...</td></tr>
                ) : currentData.length > 0 ? (
                  currentData.map((cifra) => (
                    <motion.tr key={cifra.id} variants={rowVariants} layout className="group hover:bg-white/[0.01] transition-colors">
                      <td className="p-5 pl-8">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-luck-gold/10 border border-luck-gold/20 flex items-center justify-center text-luck-gold font-black">{cifra.cantidad}</div>
                          <span className="text-white font-black text-sm">{cifra.cantidad} Cifras</span>
                        </div>
                      </td>
                      <td className="p-5 font-mono text-zinc-400">${parseFloat(cifra.cupoMaximoPorNumero).toFixed(2)}</td>
                      <td className="p-5 font-mono text-zinc-400">${parseFloat(cifra.valorMinimoTicket).toFixed(2)}</td>
                      <td className="p-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${cifra.activo ? 'bg-green-500/5 text-green-500 border-green-500/20' : 'bg-red-500/5 text-red-500 border-red-500/20'}`}>
                          {cifra.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="p-5 pr-8">
                        <div className="flex justify-end gap-2.5">
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleEdit(cifra)} className="p-2 bg-zinc-900/40 border border-white/5 rounded-lg text-zinc-500 hover:text-luck-gold transition-colors"><LuPencil size={15} /></motion.button>
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleDelete(cifra.id)} className="p-2 bg-zinc-900/40 border border-white/5 rounded-lg text-zinc-500 hover:text-red-500 transition-colors"><LuTrash2 size={15} /></motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="p-24 text-center"><LuInbox size={50} className="mx-auto text-luck-gold opacity-30" /><p className="text-[10px] font-black uppercase text-white mt-4 tracking-widest opacity-30">No se encontraron registros</p></td></tr>
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

      {showModal && <CifraModal isOpen={showModal} onClose={() => setShowModal(false)} initialData={selectedCifra} fetchData={fetchData} />}
    </motion.div>
  )
}

export default Cifras