import Title from '@/components/Titlte'
import { DASHBOARD_ITEMS } from '@/data/Items'
import { useAuthStore } from '@/store/useAuthStore'
import { LuLock } from 'react-icons/lu' // Icono para el bloqueo
import { NavLink } from 'react-router-dom'

const Dashboard = () => {
  const esAdministrador = useAuthStore((store) => store.esAdministrador)

  return (
    <div className="w-full pb-10">
      <Title
        titulo="Dashboard"
        descripcion={
          esAdministrador
            ? 'Panel administrativo global'
            : 'Panel de operaciones (Funciones restringidas)'
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DASHBOARD_ITEMS.map((item, index) => {
          // Determinamos si esta card específica debe estar bloqueada
          const estaBloqueado = item.soloAdmin && !esAdministrador

          return (
            <NavLink
              key={index}
              to={estaBloqueado ? '#' : item.path}
              // Si está bloqueado, quitamos el hover y bajamos la opacidad
              className={`group relative border p-8 rounded-[2rem] min-h-[250px] flex flex-col justify-between transition-all duration-300 shadow-2xl
                ${
                  estaBloqueado
                    ? 'bg-[#0a0d0c] border-white/5 opacity-40 cursor-not-allowed grayscale'
                    : 'bg-[#111615] border-white/10 hover:border-luck-gold/50 hover:bg-[#161c1b]'
                }`}
              onClick={(e) => estaBloqueado && e.preventDefault()}
            >
              {/* Overlay de Bloqueo (Solo se ve si está bloqueado) */}
              {estaBloqueado && (
                <div className="absolute top-6 right-6 z-20 text-zinc-600">
                  <LuLock size={20} />
                </div>
              )}

              {/* Brillo de fondo (Solo para los activos) */}
              {!estaBloqueado && (
                <div className="absolute inset-0 bg-gradient-to-br from-luck-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />
              )}

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div
                    className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 shadow-lg
                    ${estaBloqueado ? 'bg-zinc-950 border-white/5 text-zinc-700' : 'bg-zinc-900 border-white/5 text-zinc-400 group-hover:text-luck-gold'}`}
                  >
                    <item.icon size={28} />
                  </div>
                  {!estaBloqueado && (
                    <div className="h-2 w-2 rounded-full bg-luck-gold shadow-[0_0_10px_#EAB308]" />
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                    {item.label}
                  </p>
                  <h2 className="text-3xl font-black text-white italic tracking-tight uppercase">
                    {estaBloqueado ? 'SOLO ADMIN' : item.value}
                  </h2>
                </div>
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t border-white/[0.03]">
                <p className="text-sm text-zinc-600 font-medium transition-colors">
                  {estaBloqueado ? 'Requiere permisos de administrador' : item.desc}
                </p>
                <p
                  className={`text-xs font-black mt-1 uppercase tracking-tighter ${estaBloqueado ? 'text-zinc-700' : 'text-luck-gold'}`}
                >
                  {estaBloqueado ? 'Bloqueado' : item.stats}
                </p>
              </div>
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}

export default Dashboard
