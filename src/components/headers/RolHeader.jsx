import { motion } from 'framer-motion'
import { LuPlus } from 'react-icons/lu'
import Title from '../Titlte'
const RolHeader = ({ setSelectedRol, setShowModal }) => {
  return (
    <div className="flex justify-between items-center mb-10">
      <Title titulo="Gestión de Roles" descripcion="Niveles de acceso y permisos del sistema" />
      <motion.button
        whileHover={{ scale: 1.02, backgroundColor: '#EAB308' }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setSelectedRol(null)
          setShowModal(true)
        }}
        className="bg-luck-gold text-black font-black py-3 px-6 rounded-2xl flex items-center gap-2 uppercase text-[10px] tracking-widest shadow-lg shadow-luck-gold/10 transition-colors"
      >
        <LuPlus size={16} strokeWidth={3} /> Nuevo Rol
      </motion.button>
    </div>
  )
}

export default RolHeader
