import Title from '@/components/Titlte'
import { AnimatePresence, motion } from 'framer-motion'
import { LuCircleX, LuPlus, LuWallet } from 'react-icons/lu'

const CajasVendedorHeader = ({ isCajaAbierta, onOpenModal }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
      <div className="w-full md:w-auto">
        <Title
          titulo="CONTROL DE MI CAJA"
          descripcion="GESTIÓN DE APERTURA, CIERRE Y FLUJO DE EFECTIVO"
        />
      </div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 w-full md:w-auto justify-end"
        >
          {isCajaAbierta && (
            <button
              onClick={() => onOpenModal('inyectar')}
              className="flex-1 md:flex-none bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 uppercase text-[10px] tracking-widest border border-white/5"
            >
              <LuPlus className="text-luck-gold" size={18} /> Inyectar
            </button>
          )}

          {isCajaAbierta ? (
            <button
              onClick={() => onOpenModal('cerrar')}
              className="flex-1 md:flex-none bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 uppercase text-[10px] tracking-widest border border-red-500/20"
            >
              <LuCircleX size={18} /> Cerrar Turno
            </button>
          ) : (
            <button
              onClick={() => onOpenModal('abrir')}
              className="flex-1 md:flex-none bg-green-500/10 hover:bg-green-500/20 text-green-500 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 uppercase text-[10px] tracking-widest border border-green-500/20"
            >
              <LuWallet size={18} /> Abrir Caja
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default CajasVendedorHeader
