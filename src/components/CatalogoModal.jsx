import { LuLibrary } from 'react-icons/lu'
import Modal from './Modal'

const CatalogoModal = ({ isOpen, onClose, initialData }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titulo={initialData ? 'Editar Juego' : 'Nuevo Juego al Catálogo'}
      icon={LuLibrary}
    >
      <form className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
            Nombre del Sorteo
          </label>
          <input
            type="text"
            defaultValue={initialData?.nombre}
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white focus:border-luck-gold/50 outline-none transition-all"
            placeholder="Ej: Lotto Relámpago"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
              País
            </label>
            <select
              defaultValue={initialData?.pais || 'EC'}
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white focus:border-luck-gold/50 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="EC">Ecuador (EC)</option>
              <option value="AR">Argentina (AR)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
              Estado
            </label>
            <select
              defaultValue={initialData?.activo?.toString() || 'true'}
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white focus:border-luck-gold/50 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
        </div>

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
            {initialData ? 'Actualizar' : 'Registrar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default CatalogoModal
