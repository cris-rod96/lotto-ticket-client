import { motion } from 'framer-motion'
import { LuTriangleAlert } from 'react-icons/lu'
// Importación de Link de react-router-dom
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#0b0f0e] flex flex-col items-center justify-center p-4 z-[9999] overflow-hidden">
      {/* Efecto de luces de fondo sutiles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-luck-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-green-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center relative z-10 flex flex-col items-center max-w-md w-full">
        {/* Icono animado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-24 h-24 rounded-[2rem] bg-luck-gold/10 border border-luck-gold/20 flex items-center justify-center text-luck-gold mb-8 shadow-2xl shadow-luck-gold/5"
        >
          <LuTriangleAlert size={44} strokeWidth={1.5} />
        </motion.div>

        {/* Código de Error 404 Grande */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 font-mono tracking-tighter mb-2"
        >
          404
        </motion.h1>

        {/* Título y Mensaje */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl font-bold text-zinc-200 uppercase tracking-wide mb-3"
        >
          Página no encontrada
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-zinc-500 font-medium text-sm mb-10 max-w-sm"
        >
          El enlace que seguiste podría estar roto o la página pudo haber sido eliminada
          permanentemente.
        </motion.p>

        {/* Botón de Acción usando Link de react-router-dom envuelto en motion */}
        <Link to="/dashboard" className="w-full">
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            whileHover={{ scale: 1.03, backgroundColor: '#EAB308' }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-luck-gold text-black font-black py-4 px-6 rounded-2xl flex items-center justify-center uppercase text-xs tracking-wider shadow-xl shadow-luck-gold/10 transition-colors cursor-pointer"
          >
            Volver al Inicio
          </motion.button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
