import Loading from '@/components/Loading'
import { useAuthStore } from '@/store/useAuthStore'
import { useCajaStore } from '@/store/useCajaStore'
import { useEffect, useState } from 'react'
import {
  LuCalendarDays,
  LuCoins,
  LuLoader,
  LuLogOut,
  LuTicket,
  LuTrophy,
  LuUser,
} from 'react-icons/lu'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const VendedorLayout = () => {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  const caja = useCajaStore((state) => state.caja)
  const clearCaja = useCajaStore((state) => state.clearCaja)

  // Estados para la carga global de vistas
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')

  // Estados exclusivos para la lógica del Cierre Seguro
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [countdown, setCountdown] = useState(5)

  // Sincronizado con tu store: saldoActual
  const obtenerSaldoCaja = () => {
    if (!caja || caja.saldoActual === undefined || caja.saldoActual === null) return null
    return parseFloat(caja.saldoActual).toFixed(2)
  }

  // Efecto que controla el temporizador del Cierre Seguro
  useEffect(() => {
    let timer
    if (isLoggingOut && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000)
    } else if (countdown === 0) {
      logout()
      clearCaja()
      navigate('/inicio-sesion')
    }
    return () => clearInterval(timer)
  }, [isLoggingOut, countdown, logout, navigate, clearCaja])

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿CERRAR SESIÓN?',
      text: 'Se dará por terminada tu actividad en la terminal actual.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EAB308',
      cancelButtonColor: '#71717a',
      confirmButtonText: 'SÍ, SALIR',
      cancelButtonText: 'CANCELAR',
    })

    if (result.isConfirmed) {
      // Activamos el overlay y la cuenta regresiva en lugar de redirigir inmediatamente
      setIsLoggingOut(true)
    }
  }

  // Estilo de pestañas del menú de navegación
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
      isActive
        ? 'bg-luck-gold text-black shadow-md shadow-luck-gold/20'
        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
    }`

  const saldoMostrado = obtenerSaldoCaja()

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white antialiased">
      {/* OVERLAY DE CIERRE SEGURO (Misma estética adaptada a tu paleta de colores) */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[100] bg-[#000d0a]/95 backdrop-blur-2xl flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            <LuLoader className="text-luck-gold animate-spin" size={100} strokeWidth={1.5} />
            <span className="absolute text-3xl font-black text-white">{countdown}</span>
          </div>
          <h2 className="mt-8 text-white font-black uppercase tracking-[0.4em] text-sm italic">
            Cerrando Sesión de Forma Segura
          </h2>
          <p className="text-luck-gold/60 text-[10px] mt-2 font-bold uppercase tracking-widest">
            Limpiando datos y asegurando conexión...
          </p>
        </div>
      )}

      {/* Pantalla de carga global de las vistas internas */}
      {isLoading && <Loading mensaje={loadingMsg} />}

      {/* HEADER PREMIUM MINIMALISTA */}
      <header className="w-full bg-[#0d0e0e]/80 border-b border-white/[0.06] sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* LOGO E INFO DE PUNTO DE VENTA */}
          <div className="flex items-center gap-3">
            <NavLink to={'/'} className="cursor-pointer">
              <img
                src="/logo_principal.png"
                alt="El Golpe de la Suerte"
                className="h-9 w-auto object-contain"
              />
            </NavLink>
            <div className="hidden md:block text-left border-l border-white/10 pl-3">
              <p className="text-[10px] font-bold text-luck-gold uppercase tracking-wider">
                Golpe de la Suerte
              </p>
            </div>
          </div>

          {/* NAVEGACIÓN ESTILO TABS */}
          <nav className="flex items-center bg-white/[0.02] border border-white/[0.05] p-1 rounded-xl gap-1">
            <NavLink to="/tickets" className={linkClass}>
              <LuTicket size={14} strokeWidth={2.5} />
              <span>Tickets</span>
            </NavLink>
            <NavLink to="/mis-sorteos" className={linkClass}>
              <LuCalendarDays size={14} strokeWidth={2.5} />
              <span>Sorteos</span>
            </NavLink>
            <NavLink to="/cajas" className={linkClass}>
              <LuCoins size={14} strokeWidth={2.5} />
              <span>Mi Caja</span>
            </NavLink>
            <NavLink to="/resultados" className={linkClass}>
              <LuTrophy size={14} strokeWidth={2.5} />
              <span>Resultados</span>
            </NavLink>
          </nav>

          {/* INFO DE CAJA Y BOTÓN ÚNICO DE SESIÓN */}
          <div className="flex items-center gap-4">
            {/* Monitor de Caja Superior */}
            <div className="bg-white/[0.02] border border-white/[0.05] px-3 py-1.5 rounded-xl flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-0.5">
                  Caja en Línea
                </span>
                <span
                  className={`text-xs font-mono font-bold ${saldoMostrado !== null ? 'text-emerald-400' : 'text-zinc-500'}`}
                >
                  {saldoMostrado !== null ? `$${saldoMostrado}` : 'NO ACTIVA'}
                </span>
              </div>
              <div
                className={`w-2 h-2 rounded-full ${saldoMostrado !== null ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-zinc-600'}`}
              />
            </div>

            {/* BOTÓN ÚNICO: FUSIÓN DE VENDEDOR + LOGOUT CON EFECTO HOVER */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.05] p-1.5 px-3 rounded-xl cursor-pointer text-xs font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all group"
              title="Cerrar Sesión de Terminal"
            >
              <LuUser
                size={13}
                className="text-luck-gold group-hover:text-red-400 transition-colors"
              />
              <span className="max-w-[100px] truncate hidden md:inline font-bold uppercase tracking-wider">
                {user?.nombre || 'Vendedor'}
              </span>
              <div className="h-3 w-px bg-white/10 mx-0.5 group-hover:bg-red-500/20 transition-colors hidden md:block" />
              <LuLogOut size={13} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL */}
      <main className="flex-1 p-6 md:p-8 bg-[#0a0f0e] relative overflow-y-auto">
        {/* Aura ambiental de fondo */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-luck-gold/[0.03] blur-[100px] pointer-events-none opacity-40" />

        <div className="max-w-[1550px] mx-auto relative z-10">
          <Outlet context={{ setIsLoading, setLoadingMsg, isLoading }} />
        </div>
      </main>
    </div>
  )
}

export default VendedorLayout
