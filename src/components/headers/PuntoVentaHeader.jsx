import Title from '@/components/Titlte'
import { motion } from 'framer-motion'
import { LuPlus } from 'react-icons/lu'
const PuntoVentaHeader = ({ setSelectedPunto, setShowModal }) => {
  return (
    <div className="flex justify-between items-center mb-10">
      <Title titulo="Puntos de Venta" descripcion="Sucursales y centros de operación" />
      <motion.button
        whileHover={{ scale: 1.02, backgroundColor: '#EAB308' }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setSelectedPunto(null)
          setShowModal(true)
        }}
        className="bg-luck-gold text-black font-black py-3 px-6 rounded-2xl flex items-center gap-2 uppercase text-xs shadow-lg shadow-luck-gold/10 transition-colors"
      >
        <LuPlus size={16} strokeWidth={3} /> Nuevo Punto
      </motion.button>
    </div>
  )
}

export default PuntoVentaHeader
