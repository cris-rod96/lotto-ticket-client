import Sidebar from '@/components/Sidebar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />

      {/* Fondo Neutro: Un gris muy oscuro (Zinc-950) */}
      <main className="flex-1 min-h-screen p-10 overflow-y-auto bg-[#0a0f0e] relative">
        {/* Sutil brillo ambiental en la esquina superior para dar profundidad */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-luck-gold/5 blur-[120px] pointer-events-none opacity-50" />

        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default MainLayout
