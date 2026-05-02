import { useAuthStore } from '@/store/useAuthStore'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const logout = useAuthStore((state) => state.logout)

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-black/20 backdrop-blur-md border-b border-white/5 z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <img src="/logo_principal.jpg" alt="Logo" className="h-10" />
        <span className="text-luck-gold font-display font-black text-sm tracking-tighter">
          EL GOLPE
        </span>
      </div>

      <div className="flex gap-6 text-[10px] font-black uppercase text-white/60 tracking-widest">
        <Link to="/dashboard" className="hover:text-luck-gold transition-colors">
          Inicio
        </Link>
        <Link to="/ventas" className="hover:text-luck-gold transition-colors">
          Vender
        </Link>
        <button
          onClick={logout}
          className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
        >
          Salir
        </button>
      </div>
    </nav>
  )
}

export default Navbar
