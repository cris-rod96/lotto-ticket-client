import { sorteoAPI } from '@/api/index.api'
import SorteoModal from '@/components/SorteoModal'
import Title from '@/components/Titlte'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { LuCalendar, LuClock, LuGlobe, LuPencil, LuPlus, LuSearch, LuTrash2 } from 'react-icons/lu'

// Variantes para la cascada de la tabla
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

  const [sorteos, setSorteos] = useState([
    // {
    //   id: '1',
    //   numero: '2540',
    //   jornada: 'Nocturna',
    //   fechaSorteo: '2026-05-04',
    //   horaSorteo: '21:00',
    //   juego: 'Lotto',
    //   pais: 'Ecuador',
    //   cifras: 2,
    //   estado: 'Abierto',
    //   montoRecaudado: 450.5,
    // },
    // {
    //   id: '2',
    //   numero: '1102',
    //   jornada: 'Matutina',
    //   fechaSorteo: '2026-05-05',
    //   horaSorteo: '11:00',
    //   juego: 'Quini 6',
    //   pais: 'Argentina',
    //   cifras: 3,
    //   estado: 'Abierto',
    //   montoRecaudado: 120.0,
    // },
  ])

  const fetchData = async () => {
    try {
      const resp = await sorteoAPI.listarTodos()
      console.log(resp)
    } catch (error) {
      console.log(error)
    }
  }

  const handleEdit = (sorteo) => {
    setSelectedSorteo(sorteo)
    setShowModal(true)
  }

  const filteredSorteos = sorteos.filter(
    (s) => s.numero.includes(searchTerm) || s.juego.toLowerCase().includes(searchTerm.toLowerCase())
  )
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      {/* Encabezado Alineado Centrado */}
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

      {/* Barra de Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-8"
      >
        <div className="relative">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input
            type="text"
            placeholder="Buscar por número o nombre de juego..."
            className="w-full bg-zinc-950/40 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-luck-gold/40 transition-all placeholder:text-zinc-600 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Tabla Estilizada y Animada */}
      <motion.div
        variants={containerVariants}
        className="bg-[#111615] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] text-zinc-500 uppercase text-[11px] font-bold tracking-[0.15em]">
              <th className="p-7">Sorteo</th>
              <th className="p-7">Lotería / País</th>
              <th className="p-7 text-center">Cifras</th>
              <th className="p-7 text-center">Jornada</th>
              <th className="p-7">Fecha / Hora</th>
              <th className="p-7 text-center">Estado</th>
              <th className="p-7 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            <AnimatePresence mode="popLayout">
              {filteredSorteos.map((sorteo) => (
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
                        #{sorteo.numero.slice(-2)}
                      </motion.div>
                      <span className="text-white font-black text-xl tracking-tighter italic">
                        {sorteo.numero}
                      </span>
                    </div>
                  </td>
                  <td className="p-7">
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-200 font-bold text-[13px] uppercase tracking-wide">
                        {sorteo.juego}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-black uppercase">
                        <LuGlobe size={12} className="text-luck-gold/50" /> {sorteo.pais}
                      </div>
                    </div>
                  </td>
                  <td className="p-7 text-center">
                    <div className="inline-flex w-9 h-9 rounded-xl bg-zinc-900 border border-white/5 items-center justify-center text-zinc-300 font-black text-xs shadow-lg">
                      {sorteo.cifras}
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
                          : 'bg-red-500/5 text-red-500 border-red-500/20'
                      }`}
                    >
                      {sorteo.estado}
                    </span>
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
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {filteredSorteos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-20 text-center text-zinc-600 font-bold uppercase text-xs tracking-widest"
          >
            No hay sorteos programados que coincidan
          </motion.div>
        )}
      </motion.div>

      <SorteoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialData={selectedSorteo}
      />
    </motion.div>
  )
}

export default Sorteos
