import { motion } from 'framer-motion'
import { LuPlus } from 'react-icons/lu'
import Title from '../Titlte'

const ResultadoHeader = ({ setShowModal }) => {
  return (
    <div className="flex justify-between items-end mb-8">
      <Title
        titulo="Historial de Resultados"
        descripcion="Monitoreo de ventas, premios y utilidad neta por sorteo"
      />
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowModal(true)}
        className="bg-luck-gold hover:bg-yellow-600 text-black font-black py-3 px-6 rounded-2xl flex items-center gap-2 transition-all uppercase italic text-sm shadow-lg shadow-luck-gold/20"
      >
        <LuPlus size={20} /> Registrar Resultado
      </motion.button>
    </div>
  )
}

export default ResultadoHeader
