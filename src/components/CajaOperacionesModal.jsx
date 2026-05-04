import { LuCircleX, LuPlus, LuWallet } from 'react-icons/lu'
import Modal from './Modal'

const CajaOperacionesModal = ({ type, onClose }) => {
  const config = {
    abrir: {
      title: 'APERTURA DE CAJA',
      icon: LuWallet,
      color: 'text-luck-gold',
      btn: 'bg-luck-gold text-black',
    },
    cerrar: {
      title: 'CIERRE DE TURNO',
      icon: LuCircleX,
      color: 'text-red-500',
      btn: 'bg-red-500 text-white',
    },
    inyectar: {
      title: 'INYECCIÓN DE CAPITAL',
      icon: LuPlus,
      color: 'text-green-500',
      btn: 'bg-green-500 text-white',
    },
  }

  const { title, icon: Icon, color, btn } = config[type]

  return (
    <Modal isOpen={true} onClose={onClose} titulo={title} icon={Icon}>
      <form className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
            Monto de la Operación ($)
          </label>
          <input
            type="number"
            className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-5 text-xl font-mono font-black text-white focus:border-luck-gold/30 outline-none transition-all placeholder:text-zinc-800"
            placeholder="0.00"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
            Observaciones / Notas
          </label>
          <textarea
            rows="3"
            className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-sm text-zinc-300 focus:border-luck-gold/30 outline-none resize-none"
            placeholder="DESCRIBA EL MOTIVO O DETALLE..."
          />
        </div>

        <button
          className={`w-full font-black py-5 rounded-2xl transition-all active:scale-95 uppercase text-[11px] tracking-[0.3em] shadow-2xl ${btn}`}
        >
          Confirmar {type}
        </button>
      </form>
    </Modal>
  )
}

export default CajaOperacionesModal
