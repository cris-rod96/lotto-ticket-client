import { cifraAPI } from '@/api/index.api'
import { useEffect, useState } from 'react'
import { LuBinary } from 'react-icons/lu'
import Swal from 'sweetalert2'
import Modal from './Modal'

const CifraModal = ({ isOpen, onClose, initialData, fetchData }) => {
  const [loading, setLoading] = useState(false)

  const initialState = {
    cantidad: '',
    cupoMaximoPorNumero: '',
    valorMinimoTicket: '',
    estado: true,
  }
  const [formData, setFormData] = useState(initialState)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (initialData) {
        await cifraAPI.actualizarCupo(initialData.id, formData)
        Swal.fire({
          icon: 'success',
          title: 'Cifra actualizada con éxito',
          text: '',
        })
      } else {
        await cifraAPI.agregar(formData)
        Swal.fire({
          icon: 'success',
          title: 'Cifra agregada con éxito',
          text: '',
        })
      }

      fetchData()
      onClose()
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al procesar la cifra'
      Swal.fire({
        icon: 'error',
        title: 'Error al procesar la cifra',
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
      titulo={initialData ? 'Editar Cifra' : 'Nueva Cifra'}
      icon={LuBinary}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
              Cantidad Cifras
            </label>
            <input
              name="cantidad"
              type="number"
              min="2"
              placeholder="0"
              value={formData?.cantidad}
              onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white focus:border-luck-gold/50 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
              Estado
            </label>
            <select
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white focus:border-luck-gold/50 outline-none transition-all"
              value={formData?.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
            >
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
            name="cupoMaximoPorNumero"
            type="number"
            step="0.01"
            value={formData?.cupoMaximoPorNumero}
            onChange={(e) => setFormData({ ...formData, cupoMaximoPorNumero: e.target.value })}
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white focus:border-luck-gold/50 outline-none transition-all font-mono"
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
            Precio Mínimo
          </label>
          <input
            name="valorMinimoTicket"
            type="number"
            step="0.01"
            min={0.01}
            value={formData?.valorMinimoTicket}
            onChange={(e) => setFormData({ ...formData, valorMinimoTicket: e.target.value })}
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
            {loading ? 'Guardando...' : 'Confirmar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default CifraModal
