import { LuDice5 } from 'react-icons/lu'
import Modal from './Modal'

const SorteoModal = ({ isOpen, onClose, initialData }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titulo={initialData ? 'EDITAR SORTEO' : 'NUEVO SORTEO'}
      icon={LuDice5}
    >
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
              Sorteo #
            </label>
            <input
              type="text"
              className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-sm text-white focus:border-luck-gold/30 outline-none transition-all"
              placeholder="000"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
              Jornada
            </label>
            <select className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-sm text-white focus:border-luck-gold/30 outline-none cursor-pointer">
              <option value="Matutina">MATUTINA</option>
              <option value="Vespertina">VESPERTINA</option>
              <option value="Nocturna">NOCTURNA</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
              Fecha Sorteo
            </label>
            <input
              type="date"
              className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-sm text-white focus:border-luck-gold/30 outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
              Hora Sorteo
            </label>
            <input
              type="time"
              className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-sm text-white focus:border-luck-gold/30 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 bg-red-500/5 p-4 rounded-2xl border border-red-500/10">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-red-400/60 tracking-widest ml-1">
              Cierre de Ventas
            </label>
            <input
              type="date"
              className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-sm text-white focus:border-red-500/30 outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-red-400/60 tracking-widest ml-1">
              Hora Límite
            </label>
            <input
              type="time"
              className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-sm text-white focus:border-red-500/30 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
              Tipo de Juego
            </label>
            <select className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-sm text-white focus:border-luck-gold/30 outline-none">
              <option value="">SELECCIONAR...</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
              Configuración
            </label>
            <select className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-sm text-white focus:border-luck-gold/30 outline-none">
              <option value="">SELECCIONAR...</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-luck-gold hover:bg-yellow-600 text-black font-black py-4 rounded-xl transition-all active:scale-95 uppercase text-xs tracking-[0.2em] shadow-lg shadow-luck-gold/10 mt-4"
        >
          GUARDAR SORTEO
        </button>
      </form>
    </Modal>
  )
}

export default SorteoModal
