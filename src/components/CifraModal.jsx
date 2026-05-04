import { LuBinary } from 'react-icons/lu'
import Modal from './Modal'

const CifraModal = ({ isOpen, onClose, initialData }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titulo={initialData ? 'Editar Cifra' : 'Nueva Cifra'}
      icon={LuBinary}
    >
      <form className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
              Cantidad (min 2)
            </label>
            <input
              type="number"
              min="2"
              defaultValue={initialData?.cantidad || 2}
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white focus:border-luck-gold/50 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
              Estado
            </label>
            <select className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white focus:border-luck-gold/50 outline-none transition-all">
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
            Cupo Máximo por Número
          </label>
          <input
            type="number"
            step="0.01"
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white focus:border-luck-gold/50 outline-none transition-all font-mono"
            placeholder="0.00"
          />
        </div>

        {/* Botones de acción estandarizados */}
        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-500 font-bold py-4 rounded-2xl transition-all uppercase text-xs tracking-widest"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 bg-luck-gold hover:bg-yellow-600 text-black font-black py-4 rounded-2xl transition-all active:scale-95 uppercase text-xs tracking-widest shadow-lg shadow-luck-gold/10"
          >
            Confirmar
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default CifraModal
