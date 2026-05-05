import CatalogoModal from '@/components/CatalogoModal'
import Title from '@/components/Titlte'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { LuGlobe, LuPencil, LuPlus, LuSearch, LuTrash2 } from 'react-icons/lu'

// Variantes de animación
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
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

  const [catalogos, setCatalogos] = useState([
    { id: '1', nombre: 'Lotto', pais: 'EC', activo: true },
    { id: '2', nombre: 'Lotería Nacional', pais: 'EC', activo: true },
    { id: '3', nombre: 'Quini 6', pais: 'AR', activo: false },
  ])

  const filtered = catalogos.filter((c) =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      {/* HEADER AJUSTADO: items-center para alineación perfecta */}
      <div className="flex justify-between items-center mb-10">
        <Title
          titulo="Catálogo de Juegos"
          descripcion="Definición de productos de lotería por región"
        />
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#EAB308' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setSelectedItem(null)
            setShowModal(true)
          }}
          className="bg-luck-gold text-black font-black py-3.5 px-6 rounded-2xl flex items-center gap-2 uppercase text-sm shadow-lg shadow-luck-gold/10"
        >
          <LuPlus size={20} strokeWidth={3} /> Nuevo Juego
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
            placeholder="Buscar juego..."
            className="w-full bg-zinc-950/40 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-luck-gold/40 transition-all placeholder:text-zinc-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Tabla con Framer Motion */}
      <motion.div
        variants={containerVariants}
        className="bg-[#111615] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] text-zinc-500 uppercase text-[11px] font-bold tracking-[0.15em]">
              <th className="p-7">Nombre del Juego</th>
              <th className="p-7">País</th>
              <th className="p-7 text-center">Estado</th>
              <th className="p-7 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            <AnimatePresence mode="popLayout">
              {filtered.map((item) => (
                <motion.tr
                  key={item.id}
                  variants={rowVariants}
                  layout
                  className="group hover:bg-white/[0.01] transition-colors"
                >
                  <td className="p-7 font-bold text-white uppercase text-sm tracking-tight">
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
                  <td className="p-7">
                    <div className="flex justify-center">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          item.activo
                            ? 'bg-green-500/5 text-green-500 border-green-500/20'
                            : 'bg-red-500/5 text-red-500 border-red-500/20'
                        }`}
                      >
                        {item.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </td>
                  <td className="p-7">
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
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      <CatalogoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialData={selectedItem}
      />
    </motion.div>
  )
}

export default Catalogo
