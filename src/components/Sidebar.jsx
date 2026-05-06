import { useAuthStore } from '@/store/useAuthStore'
import { useCajaStore } from '@/store/useCajaStore'
import { useEffect, useState } from 'react'
import {
  LuBinary,
  LuChevronLeft,
  LuClover,
  LuDice5,
  LuLayoutDashboard,
  LuLibrary,
  // ESTE ES EL ICONO CORREGIDO
  LuLoader,
  LuLogOut,
  LuSettings,
  LuShieldCheck,
  LuStore,
  LuTicket,
  LuTrendingUp,
  LuTrophy,
  LuUsers,
  LuWallet,
} from 'react-icons/lu'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [countdown, setCountdown] = useState(5)

  const location = useLocation()
  const navigate = useNavigate()

  // Traemos las acciones del store
  const logout = useAuthStore((state) => state.logout)
  // Si tienes otros stores que limpiar (como en el ejemplo original: caja, empresa), añádelos aquí:
  const clearCaja = useCajaStore((state) => state.clearCaja)

  const menuItems = [
    { title: 'Dashboard', icon: <LuLayoutDashboard />, path: '/dashboard' },
    { title: 'Venta de Tickets', icon: <LuTicket />, path: '/tickets' },
    { title: 'Gestión de Suertes', icon: <LuClover />, path: '/suertes' },
    { title: 'Catálogo de Juegos', icon: <LuLibrary />, path: '/catalogo' },
    { title: 'Gestión de Sorteos', icon: <LuDice5 />, path: '/sorteos' },
    { title: 'Resultados de Sorteos', icon: <LuTrophy />, path: '/resultados' },
    { title: 'Gestión de Cifras', icon: <LuBinary />, path: '/cifras' },
    { title: 'Gestión de Cajas', icon: <LuWallet />, path: '/cajas' },
    { title: 'Reportes', icon: <LuTrendingUp />, path: '/reportes' },
    { title: 'Puntos de Venta', icon: <LuStore />, path: '/puntos-venta' },
    { title: 'Gestión de Usuarios', icon: <LuUsers />, path: '/usuarios' },
    { title: 'Gestión de Roles', icon: <LuShieldCheck />, path: '/roles' },
    { title: 'Configuración', icon: <LuSettings />, path: '/configuracion' },
  ]

  // Lógica del Cierre Seguro (Temporizador y Limpieza)
  useEffect(() => {
    let timer
    // 1. Si comienza el cierre, inicia el contador
    if (isLoggingOut && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000)
    }
    // 2. Cuando el contador llega a 0, ejecuta la limpieza real
    else if (countdown === 0) {
      logout() // Limpia token y usuario

      clearCaja()

      navigate('/inicio-sesion') // Ruta final a la que redirigir
    }
    // Limpieza del intervalo si el componente se desmonta
    return () => clearInterval(timer)
  }, [isLoggingOut, countdown, logout, navigate])

  return (
    <>
      {/* OVERLAY DE CIERRE SEGURO (Se renderiza fuera del Sidebar) */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[100] bg-[#000d0a]/95 backdrop-blur-2xl flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* Animación de carga con el icono CORREGIDO (LuLoader) */}
            <LuLoader className="text-[#D4AF37] animate-spin" size={100} strokeWidth={1.5} />
            {/* Número del contador centrado */}
            <span className="absolute text-3xl font-black text-white">{countdown}</span>
          </div>
          <h2 className="mt-8 text-white font-black uppercase tracking-[0.4em] text-sm italic">
            Cerrando Sesión de Forma Segura
          </h2>
          <p className="text-[#D4AF37]/60 text-[10px] mt-2 font-bold uppercase tracking-widest">
            Limpiando datos y asegurando conexión...
          </p>
        </div>
      )}

      {/* CONTENEDOR PRINCIPAL DEL SIDEBAR */}
      <div
        className={`h-screen sticky top-0 left-0 z-50 transition-all duration-500 ease-in-out flex flex-col shadow-[10px_0_50px_rgba(0,0,0,1)] overflow-x-hidden ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Fondo con imagen de fichas y overlay mejorado */}
        <div className="absolute inset-0 z-[-1] pointer-events-none">
          <img
            src="/fichas.jpg"
            alt="Fondo de fichas"
            className="w-full h-full object-cover opacity-40"
          />
          {/* Degradado oscuro característico */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#000d0a]/40 via-[#001410]/60 to-[#000d0a]/40 backdrop-blur-[2px]" />
        </div>

        {/* Header del Sidebar con Logo y botón de colapsar */}
        <div className="relative p-6 mb-2 flex items-center justify-between border-b border-white/5 bg-black/40">
          <div
            className={`transition-all duration-500 overflow-hidden ${
              isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
            }`}
          >
            <img
              src="/logo_principal.png"
              alt="Logo"
              className="h-8 brightness-95 contrast-125 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
            />
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-all border border-[#D4AF37]/20 shadow-inner"
          >
            <LuChevronLeft
              className={`transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Navegación - Sección central con scroll independiente */}
        <nav className="flex-1 px-3 mt-4 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#001a14] font-black shadow-[0_4px_20px_rgba(212,175,55,0.25)]'
                    : 'text-gray-300 hover:bg-white/[0.05] hover:text-[#D4AF37]'
                }`}
              >
                {/* Icono del ítem de menú */}
                <span
                  className={`text-xl flex-shrink-0 transition-colors ${
                    isActive ? 'text-[#001a14]' : 'text-[#D4AF37]/80 group-hover:text-[#D4AF37]'
                  }`}
                >
                  {item.icon}
                </span>

                {/* Texto del ítem - Animación de ancho para colapsar */}
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap ${
                    isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'
                  }`}
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em]">
                    {item.title}
                  </span>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Footer del Sidebar con Botón de Salida */}
        <div className="p-4 bg-black/60 border-t border-white/5">
          <button
            // Activa el estado de Cierre Seguro en lugar de hacer logout directamente
            onClick={() => setIsLoggingOut(true)}
            className="w-full flex items-center justify-center gap-3 py-3.5 text-red-500/80 border border-red-500/10 hover:border-red-500/40 hover:bg-red-500/10 rounded-xl transition-all font-bold uppercase text-[9px] tracking-widest active:scale-95"
          >
            <LuLogOut size={18} />
            <div
              className={`transition-all duration-500 overflow-hidden ${
                isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[150px] opacity-100'
              }`}
            >
              <span className="whitespace-nowrap pl-1">Cerrar Sesión</span>
            </div>
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar
