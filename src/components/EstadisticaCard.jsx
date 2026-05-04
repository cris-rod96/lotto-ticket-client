import { LuActivity } from 'react-icons/lu'
const EstadisticaCard = ({ title, value, icon, trend, color }) => {
  return (
    <div className="relative overflow-hidden bg-white/[0.03] border border-white/10 p-6 rounded-2xl backdrop-blur-md group hover:border-[#D4AF37]/50 transition-all duration-500">
      {/* Efecto de luz al pasar el mouse */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#D4AF37]/10 blur-3xl group-hover:bg-[#D4AF37]/20 transition-all" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
          <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>

          {trend && (
            <div
              className={`mt-2 flex items-center gap-1 text-xs font-bold ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}
            >
              <LuActivity size={14} />
              <span>{trend > 0 ? `+${trend}%` : `${trend}%`} respecto a ayer</span>
            </div>
          )}
        </div>

        <div
          className={`p-3 rounded-xl bg-black/40 border border-white/5 text-2xl ${color || 'text-[#D4AF37]'}`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

export default EstadisticaCard
