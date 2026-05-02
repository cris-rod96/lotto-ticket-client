import { useAuthStore } from '@/store/useAuthStore'
import { useState } from 'react'
import {
  LuArrowLeftRight,
  LuBinary,
  LuChevronLeft,
  LuDice5,
  LuLayoutDashboard,
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
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const logout = useAuthStore((state) => state.logout)

  const menuItems = [
    { title: 'Dashboard', icon: <LuLayoutDashboard />, path: '/dashboard' },
    { title: 'Ventas de Tickets', icon: <LuTicket />, path: '/tickets' },
    { title: 'Gestión de Sorteos', icon: <LuDice5 />, path: '/sorteos' },
    { title: 'Resultados de Sorteos', icon: <LuTrophy />, path: '/resultados' },
    { title: 'Gestión de Cifras', icon: <LuBinary />, path: '/cifras' },
    { title: 'Control de Caja', icon: <LuWallet />, path: '/caja' },
    { title: 'Movimientos Diarios', icon: <LuArrowLeftRight />, path: '/movimientos' },
    { title: 'Reportes y Estadísticas', icon: <LuTrendingUp />, path: '/reportes' },
    { title: 'Puntos de Venta', icon: <LuStore />, path: '/puntos-venta' },
    { title: 'Usuarios del Sistema', icon: <LuUsers />, path: '/usuarios' },
    { title: 'Roles y Permisos', icon: <LuShieldCheck />, path: '/roles' },
    { title: 'Configuración', icon: <LuSettings />, path: '/config' },
  ]

  return (
    <div
      className={`h-screen sticky top-0 left-0 z-50 transition-all duration-500 ease-in-out flex flex-col shadow-[10px_0_50px_rgba(0,0,0,1)] overflow-x-hidden ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Fondo con imagen y overlay mejorado para legibilidad total */}
      <div className="absolute inset-0 z-[-1] pointer-events-none">
        {/* La imagen ahora tiene una opacidad del 40% para que no compita con el texto */}
        <img
          src="/fichas.jpg"
          alt="Fondo de fichas"
          className="w-full h-full object-cover opacity-40"
        />
        {/* Bajamos la opacidad del degradado a /40 y /60 para permitir transparencia */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#000d0a]/40 via-[#001410]/60 to-[#000d0a]/40 backdrop-blur-[2px]" />
      </div>

      {/* Header con Logo */}
      <div className="relative p-6 mb-2 flex items-center justify-between border-b border-white/5 bg-black/40">
        <div
          className={`transition-all duration-500 overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}
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

      {/* Navegación - Corrección de bug de texto y scroll */}
      <nav className="flex-1 px-3 mt-4 space-y-1.5 overflow-y-auto overflow-x-hidden custom-sidebar-scroll">
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
              <span
                className={`text-xl flex-shrink-0 transition-colors ${
                  isActive ? 'text-[#001a14]' : 'text-[#D4AF37]/80 group-hover:text-[#D4AF37]'
                }`}
              >
                {item.icon}
              </span>

              {/* Contenedor de texto animado para evitar el bug del scroll y el parpadeo */}
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

      {/* Footer / Salida */}
      <div className="p-4 bg-black/60 border-t border-white/5">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 py-3.5 text-red-500/80 border border-red-500/10 hover:border-red-500/40 hover:bg-red-500/10 rounded-xl transition-all font-bold uppercase text-[9px] tracking-widest"
        >
          <LuLogOut size={18} />
          <div
            className={`transition-all duration-500 overflow-hidden ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[150px] opacity-100'}`}
          >
            <span className="whitespace-nowrap pl-1">Cerrar Sesión</span>
          </div>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
