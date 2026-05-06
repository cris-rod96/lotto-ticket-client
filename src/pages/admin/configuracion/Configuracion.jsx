import { usuarioAPI } from '@/api/index.api'
import Title from '@/components/Titlte'
import { useAuthStore } from '@/store/useAuthStore'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { LuKey, LuSave, LuTriangleAlert, LuUser } from 'react-icons/lu'
import Swal from 'sweetalert2'

const Configuracion = () => {
  const { user, updateUser } = useAuthStore()
  const [perfil, setPerfil] = useState({ nombresCompletos: '', alias: '' })
  const [seguridad, setSeguridad] = useState({
    claveActual: '',
    nuevaClave: '',
    confirmarClave: '',
  })

  // Estado para errores de validación
  const [errores, setErrores] = useState({})

  useEffect(() => {
    if (user) {
      setPerfil(user)
    }
  }, [user])

  const handleSubmitInfo = async (e) => {
    e.preventDefault()
    try {
      const resp = await usuarioAPI.actualizarInformacion(user.id, {
        nombresCompletos: perfil.nombresCompletos,
      })
      const { usuario } = resp.data
      Swal.fire({
        icon: 'success',
        title: 'Información actualizada',
        text: 'Se actualizó la información del usuario correctamente.',
      })

      updateUser(usuario)
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al procesar la información del usuario'
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: msg,
      })
    }
  }

  const handleSubmitActualizarClave = async (e) => {
    e.preventDefault()

    // Validación preventiva antes de disparar la API
    if (Object.keys(errores).length > 0 || !seguridad.claveActual || !seguridad.nuevaClave) {
      return Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Por favor, corrige los errores antes de continuar.',
      })
    }

    try {
      // Usamos el método de tu API pasando el ID y los datos
      await usuarioAPI.actualizarClave(user.id, {
        claveActual: seguridad.claveActual,
        nuevaClave: seguridad.nuevaClave,
      })

      Swal.fire({
        icon: 'success',
        title: 'Contraseña actualizada',
        text: 'Tu contraseña se ha cambiado correctamente.',
        timer: 2000,
        showConfirmButton: false,
      })

      // RESETEO DE CAMPOS: Volvemos al estado inicial
      setSeguridad({
        claveActual: '',
        nuevaClave: '',
        confirmarClave: '',
      })
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al intentar cambiar la contraseña'
      Swal.fire({
        icon: 'error',
        title: 'Error de seguridad',
        text: msg,
      })
    }
  }

  useEffect(() => {
    const nuevosErrores = {}

    if (seguridad.nuevaClave && seguridad.claveActual === seguridad.nuevaClave) {
      nuevosErrores.nuevaClave = 'La nueva clave no puede ser igual a la actual'
    }

    if (seguridad.confirmarClave && seguridad.nuevaClave !== seguridad.confirmarClave) {
      nuevosErrores.confirmarClave = 'Las contraseñas no coinciden'
    }

    setErrores(nuevosErrores)
  }, [seguridad])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full pr-6">
      <Title
        titulo="Configuración"
        descripcion="Gestiona tu perfil personal y seguridad de la cuenta"
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10 w-full">
        {/* SECCIÓN PERFIL */}
        <div className="bg-[#111615] border border-white/5 rounded-[2rem] p-8 shadow-2xl w-full">
          {/* ... (Cabecera igual) */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-luck-gold/10 border border-luck-gold/20 flex items-center justify-center text-luck-gold">
              <LuUser size={24} />
            </div>
            <div>
              <h3 className="text-white font-black uppercase tracking-widest text-base">
                Información Personal
              </h3>
              <p className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-bold">
                Datos de cuenta
              </p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmitInfo}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                Nombres Completos
              </label>
              <input
                type="text"
                className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3.5 px-5 text-sm text-white focus:border-luck-gold/30 outline-none transition-all"
                value={perfil.nombresCompletos}
                onChange={(e) => setPerfil({ ...perfil, nombresCompletos: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                Alias / Usuario
              </label>
              <input
                type="text"
                disabled
                className="w-full bg-zinc-900/40 border border-white/5 rounded-xl py-3.5 px-5 text-sm text-zinc-600 font-mono cursor-not-allowed"
                value={perfil.alias}
              />
            </div>
            <button className="bg-luck-gold hover:bg-yellow-600 text-black font-black py-3.5 px-8 rounded-xl flex items-center gap-2 uppercase text-[11px] tracking-[0.15em] shadow-lg shadow-luck-gold/10 transition-all active:scale-95 mt-4">
              <LuSave size={16} strokeWidth={3} /> Guardar Cambios
            </button>
          </form>
        </div>

        {/* SECCIÓN SEGURIDAD */}
        <div className="bg-[#111615] border border-white/5 rounded-[2rem] p-8 shadow-2xl w-full">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-luck-gold/10 border border-luck-gold/20 flex items-center justify-center text-luck-gold">
              <LuKey size={24} />
            </div>
            <div>
              <h3 className="text-white font-black uppercase tracking-widest text-base">
                Seguridad
              </h3>
              <p className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-bold">
                Cambio de clave
              </p>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmitActualizarClave}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                Clave Actual
              </label>
              <input
                type="password"
                className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3.5 px-5 text-sm text-white focus:border-luck-gold/30 outline-none transition-all"
                value={seguridad.claveActual}
                onChange={(e) => setSeguridad({ ...seguridad, claveActual: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Nueva Clave */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Nueva Clave
                </label>
                <input
                  type="password"
                  className={`w-full bg-zinc-950 border rounded-xl py-3.5 px-5 text-sm text-white outline-none transition-all ${
                    errores.nuevaClave
                      ? 'border-red-500/50 focus:border-red-500'
                      : 'border-white/5 focus:border-luck-gold/30'
                  }`}
                  value={seguridad.nuevaClave}
                  onChange={(e) => setSeguridad({ ...seguridad, nuevaClave: e.target.value })}
                />
                <AnimatePresence>
                  {errores.nuevaClave && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1 flex items-center gap-1"
                    >
                      <LuTriangleAlert size={10} /> {errores.nuevaClave}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Confirmar Clave */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Confirmar
                </label>
                <input
                  type="password"
                  className={`w-full bg-zinc-950 border rounded-xl py-3.5 px-5 text-sm text-white outline-none transition-all ${
                    errores.confirmarClave
                      ? 'border-red-500/50 focus:border-red-500'
                      : 'border-white/5 focus:border-luck-gold/30'
                  }`}
                  value={seguridad.confirmarClave}
                  onChange={(e) => setSeguridad({ ...seguridad, confirmarClave: e.target.value })}
                />
                <AnimatePresence>
                  {errores.confirmarClave && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1 flex items-center gap-1"
                    >
                      <LuTriangleAlert size={10} /> {errores.confirmarClave}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button
              type="submit" // Asegurar el tipo submit
              disabled={
                Object.keys(errores).length > 0 ||
                !seguridad.nuevaClave ||
                !seguridad.claveActual ||
                !seguridad.confirmarClave
              }
              className="w-full border-2 border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-white font-black py-3.5 rounded-xl uppercase text-[11px] tracking-[0.2em] transition-all mt-4 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              Actualizar Contraseña
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  )
}

export default Configuracion
