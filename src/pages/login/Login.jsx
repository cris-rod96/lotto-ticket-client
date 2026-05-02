import { motion } from 'framer-motion'
import { useState } from 'react'
import { FiArrowRight } from 'react-icons/fi'
import { LuEye, LuEyeOff, LuLock, LuShieldCheck, LuUser } from 'react-icons/lu'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen bg-luck-green-dark flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* --- FONDO MEJORADO --- */}
      <div className="absolute inset-0 z-0">
        {/* Capa 1: Grid tecnológico sutil */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            size: '40px 40px',
          }}
        />

        {/* Capa 2: Orbes de luz con movimiento errático */}
        <motion.div
          animate={{
            x: [0, 50, -20, 0],
            y: [0, -30, 40, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 -left-20 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-luck-green-bright/20 rounded-full blur-[100px]"
        />

        <motion.div
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 50, -20, 0],
            scale: [1, 1.1, 1, 1.1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear', delay: 1 }}
          className="absolute bottom-1/4 -right-20 w-[250px] h-[250px] sm:w-[450px] sm:h-[450px] bg-luck-gold/10 rounded-full blur-[100px]"
        />

        {/* Capa 3: "Partículas" de brillo (Tréboles de luz) */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100 }}
            animate={{
              opacity: [0, 0.3, 0],
              y: -500,
              x: Math.sin(i) * 100,
            }}
            transition={{
              duration: 10 + i,
              repeat: Infinity,
              delay: i * 2,
              ease: 'easeInOut',
            }}
            className="absolute bottom-0 w-1 h-1 bg-luck-gold rounded-full blur-[1px]"
            style={{ left: `${15 * i + 10}%` }}
          />
        ))}
      </div>

      {/* --- CONTENEDOR DEL FORMULARIO --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm sm:max-w-md"
      >
        {/* Tarjeta con borde iluminado */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-luck-gold/20 to-luck-green-bright/20 rounded-[2.5rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

          <div className="relative bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl p-8 sm:p-12">
            <div className="flex flex-col items-center mb-10">
              <motion.img
                whileHover={{ rotate: [0, -5, 5, 0] }}
                src="/logo_principal.png"
                alt="El Golpe de la Suerte"
                className="w-32 sm:w-44 mb-6 drop-shadow-[0_0_25px_rgba(251,191,36,0.5)]"
              />
              <h1 className="font-display text-2xl sm:text-3xl font-black text-white text-center tracking-tighter">
                SISTEMA{' '}
                <span className="bg-gradient-to-r from-luck-gold to-yellow-200 bg-clip-text text-transparent">
                  GESTIÓN
                </span>
              </h1>
            </div>

            <form className="space-y-6">
              <div className="space-y-2">
                <div className="relative group">
                  <LuUser
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold"
                    size={18}
                  />
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-luck-gold/20 focus:bg-white/10 transition-all"
                    placeholder="Usuario"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <LuLock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold"
                    size={18}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-luck-gold/20 focus:bg-white/10 transition-all"
                    placeholder="Contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-luck-gold"
                  >
                    {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-luck-gold via-yellow-500 to-luck-gold-dark text-luck-green-dark font-display font-black py-4 rounded-2xl shadow-[0_0_20px_rgba(251,191,36,0.4)] flex items-center justify-center gap-3"
              >
                ACCEDER AHORA <FiArrowRight size={20} />
              </motion.button>
            </form>

            <div className="mt-8 flex justify-center items-center gap-2 text-[10px] text-white/30 font-bold uppercase tracking-widest">
              <LuShieldCheck className="text-luck-green-bright" />
              Terminal de Venta Autorizada
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
