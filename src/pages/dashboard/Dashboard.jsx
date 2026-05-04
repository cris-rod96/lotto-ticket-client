import { DASHBOARD_ITEMS } from '@/data/Items' // Importa la data de arriba
import { NavLink } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className="text-4xl font-black uppercase italic text-white flex items-center gap-3">
          <span className="w-2 h-10 bg-luck-gold rounded-sm inline-block" />
          Dashboard Principal
        </h1>
        <p className="text-zinc-400 text-sm font-medium mt-2 ml-5 tracking-wide">
          Sincronización de datos en tiempo real
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DASHBOARD_ITEMS.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className="group relative bg-[#111615] border border-white/10 p-8 rounded-[2rem] min-h-[250px] flex flex-col justify-between transition-all duration-300 hover:border-luck-gold/50 hover:bg-[#161c1b]"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-luck-gold transition-colors shadow-lg">
                  <item.icon size={28} />
                </div>
                <div className="h-2 w-2 rounded-full bg-luck-gold shadow-[0_0_10px_#EAB308]" />
              </div>

              <div className="space-y-1">
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                  {item.label}
                </p>
                <h2 className="text-3xl font-bold text-white tracking-normal">{item.value}</h2>
              </div>
            </div>

            <div className="relative z-10 mt-6">
              <p className="text-sm text-zinc-500 font-medium group-hover:text-zinc-300 transition-colors">
                {item.desc}
              </p>
              <p className="text-xs text-luck-gold font-bold mt-1 uppercase tracking-tight">
                {item.stats}
              </p>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  )
}
export default Dashboard
