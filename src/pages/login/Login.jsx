import { motion } from 'framer-motion'
import { useState } from 'react'
// Usando react-icons (Librería Lucide y Fi)
import { FiArrowRight } from 'react-icons/fi'
import { LuEye, LuEyeOff, LuLock, LuShieldCheck, LuUser } from 'react-icons/lu'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="min-h-screen bg-luck-green-dark flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Fondo Animado Responsivo */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-luck-emerald rounded-full blur-[120px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-sm sm:max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl p-6 sm:p-10">
          {/* Header - Ajuste de tamaño de logo según pantalla */}
          <div className="flex flex-col items-center mb-8">
            <img
              src="/logo_principal.png"
              alt="El Golpe de la Suerte"
              className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-[0_0_15px_rgba(251,191,36,0.3)] mb-4"
            />
            <h1 className="font-display text-xl sm:text-2xl font-black text-white text-center tracking-tight">
              ACCESO <span className="text-luck-gold">USUARIOS</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Input Usuario */}
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-xs font-bold text-luck-gold uppercase ml-1 flex items-center gap-2">
                <LuUser size={14} /> Usuario
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 sm:py-4 pl-4 pr-4 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-sm sm:text-base"
                  placeholder="Ej: admin_cris"
                />
              </div>
            </div>

            {/* Input Contraseña */}
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-xs font-bold text-luck-gold uppercase ml-1 flex items-center gap-2">
                <LuLock size={14} /> Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 sm:py-4 pl-4 pr-12 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-sm sm:text-base"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-luck-gold transition-colors"
                >
                  {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                </button>
              </div>
            </div>

            {/* Botón con Motion y Responsive Padding */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full mt-2 bg-gradient-to-r from-luck-gold to-luck-gold-dark text-luck-green-dark font-display font-black py-3.5 sm:py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 group text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-luck-green-dark/30 border-t-luck-green-dark rounded-full animate-spin" />
              ) : (
                <>
                  INGRESAR AL PANEL
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer Responsivo */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-white/40 font-bold uppercase">
            <div className="flex items-center gap-1.5">
              <LuShieldCheck size={14} className="text-luck-emerald" />
              Seguridad Activa
            </div>
            <p className="tracking-widest">v1.0.0</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
