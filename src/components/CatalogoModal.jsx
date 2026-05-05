import { catalogoAPI } from '@/api/index.api'
import { useEffect, useState } from 'react'
import { LuLibrary, LuLoader, LuSave } from 'react-icons/lu'
import Swal from 'sweetalert2'
import Modal from './Modal'

const CatalogoModal = ({ isOpen, onClose, initialData, fetchData }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    pais: 'EC',
    activo: true,
  })
  const [loading, setLoading] = useState(false)

  // Sincronizar el estado interno con la data inicial o resetear si es nuevo
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        pais: initialData.pais || 'EC',
        activo: initialData.activo ?? true,
      })
    } else {
      setFormData({ nombre: '', pais: 'EC', activo: true })
    }
  }, [initialData, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (initialData?.id) {
        // Lógica de Actualización
        await catalogoAPI.actualizar(initialData.id, formData)
        Swal.fire({
          icon: 'success',
          title: 'Actualización exitosa',
          text: 'Se ha actualizado la información del juego',
        })
      } else {
        // Lógica de Creación
        await catalogoAPI.agregar(formData)
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'El nuevo juego se ha añadido correctamente',
        })
      }
      onClose(true) // Cerramos pasando true para que el padre refresque la lista
      fetchData()
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al procesar el catálogo'
      Swal.fire({
        icon: 'error',
        title: 'Error al procesar',
        text: msg,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'activo' ? value === 'true' : value,
    }))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onClose(false)}
      titulo={initialData ? 'Editar Juego' : 'Nuevo Juego al Catálogo'}
      icon={LuLibrary}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre del Sorteo */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
            Nombre del Sorteo
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white focus:border-luck-gold/50 outline-none transition-all placeholder:text-zinc-700"
            placeholder="Ej: Lotto Relámpago"
            required
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* País */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
              País
            </label>
            <div className="relative">
              <select
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white focus:border-luck-gold/50 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="EC">Ecuador (EC)</option>
                <option value="AR">Argentina (AR)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
              Estado
            </label>
            <div className="relative">
              <select
                name="activo"
                value={formData.activo.toString()}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white focus:border-luck-gold/50 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 text-xs">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={() => onClose(false)}
            disabled={loading}
            className="flex-1 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-500 font-bold py-4 rounded-2xl transition-all uppercase text-xs tracking-widest border border-white/5 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-luck-gold hover:bg-yellow-600 text-black font-black py-4 rounded-2xl transition-all active:scale-95 uppercase text-xs tracking-widest shadow-lg shadow-luck-gold/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <LuLoader className="animate-spin" size={18} /> : <LuSave size={18} />}
            {initialData ? 'Actualizar' : 'Registrar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default CatalogoModal
