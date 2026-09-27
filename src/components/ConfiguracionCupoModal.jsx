import { configuracionCupoAPI } from '@/api/index.api' // Ajusta según tu archivo de rutas API
import { useEffect, useState } from 'react'
import { LuSlidersHorizontal } from 'react-icons/lu'
import Swal from 'sweetalert2'
import Modal from './Modal'

const ConfiguracionCupoModal = ({ isOpen, onClose, initialData, fetchData, catalogos = [], cifras = [] }) => {
  const [loading, setLoading] = useState(false)

  const initialState = {
    CatalogoId: '',
    CifraId: '',
    jornada: 'Mañanera',
    cupoMaximoDefault: '',
  }
  
  const [formData, setFormData] = useState(initialState)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (initialData) {
        await configuracionCupoAPI.actualizar(initialData.id, formData)
        Swal.fire({
          icon: 'success',
          title: 'Configuración actualizada con éxito',
          text: '',
        })
      } else {
        await configuracionCupoAPI.agregar(formData)
        Swal.fire({
          icon: 'success',
          title: 'Configuración de cupo agregada con éxito',
          text: '',
        })
      }

      fetchData()
      onClose()
    } catch (error) {
      const msg = error.response?.data?.error || 'Error al procesar la configuración de cupo'
      Swal.fire({
        icon: 'error',
        title: 'Error al procesar la solicitud',
        text: msg,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData(initialState)
    }
  }, [isOpen, initialData])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titulo={initialData ? 'Editar Configuración de Cupo' : 'Configuración de Cupo'}
      icon={LuSlidersHorizontal}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        
        {/* Selector de Catálogo / Lotería */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
            Lotería (Catálogo)
          </label>
          <select
            name="CatalogoId"
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white focus:border-luck-gold/50 outline-none transition-all"
            value={formData?.CatalogoId}
            onChange={(e) => setFormData({ ...formData, CatalogoId: e.target.value })}
            required
          >
            <option value="">Seleccione una lotería</option>
            {catalogos.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre || cat.descripcion || cat.pais || 'Lotería'}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de Tipo de Cifra y Jornada (Grid de 2 columnas) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
              Tipo de Cifra
            </label>
            <select
              name="CifraId"
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white focus:border-luck-gold/50 outline-none transition-all"
              value={formData?.CifraId}
              onChange={(e) => setFormData({ ...formData, CifraId: e.target.value })}
              required
            >
              <option value="">Seleccione cifra</option>
              {cifras.map((cifra) => (
                <option key={cifra.id} value={cifra.id}>
                  {cifra.cantidad} Cifras
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
              Jornada
            </label>
            <select
              name="jornada"
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white focus:border-luck-gold/50 outline-none transition-all"
              value={formData?.jornada}
              onChange={(e) => setFormData({ ...formData, jornada: e.target.value })}
              required
            >
              <option value="Mañanera">Mañanera</option>
              <option value="Matutina">Matutina</option>
              <option value="Vespertina">Vespertina</option>
              <option value="Nocturna">Nocturna</option>
            </select>
          </div>
        </div>

        {/* Input de Cupo Máximo Default */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
            Cupo Máximo por Defecto
          </label>
          <input
            name="cupoMaximoDefault"
            type="number"
            step="0.01"
            min="0"
            value={formData?.cupoMaximoDefault}
            onChange={(e) => setFormData({ ...formData, cupoMaximoDefault: e.target.value })}
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white focus:border-luck-gold/50 outline-none transition-all font-mono"
            placeholder="0.00"
            required
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
            disabled={loading}
            className="flex-1 bg-luck-gold hover:bg-yellow-600 text-black font-black py-4 rounded-2xl transition-all active:scale-95 uppercase text-xs tracking-widest shadow-lg shadow-luck-gold/10 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Confirmar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default ConfiguracionCupoModal