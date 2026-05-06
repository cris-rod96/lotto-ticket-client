import { rolAPI } from '@/api/index.api'
import { useEffect, useState } from 'react'
import { LuShieldCheck } from 'react-icons/lu'
import Swal from 'sweetalert2'
import Modal from './Modal'

const RolModal = ({ isOpen, onClose, initialData, fetchData }) => {
  const [loading, setLoading] = useState(false)
  const initialState = { nombre: '' }
  const [formData, setFormData] = useState(initialState)

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (initialData) {
        await rolAPI.actualizar(initialData.id, formData)
        Swal.fire({ icon: 'success', title: 'Actualizado', text: 'Rol actualizado' })
      } else {
        await rolAPI.agregar(formData)
        Swal.fire({ icon: 'success', title: 'Creado', text: 'Rol creado con éxito' })
      }
      fetchData()
      onClose()
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al procesar el rol'
      Swal.fire({ icon: 'error', title: 'Error', text: msg })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialData) {
      setFormData({ nombre: initialData.nombre || '' })
    } else {
      setFormData(initialState)
    }
  }, [initialData, isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titulo={initialData ? 'EDITAR ROL' : 'NUEVO ROL'}
      icon={LuShieldCheck}
    >
      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
            Nombre del Rol
          </label>
          <input
            type="text"
            required
            className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3.5 px-4 text-sm text-white 
                       focus:border-luck-gold/30 outline-none transition-all placeholder:text-zinc-700"
            placeholder="Ej: ADMINISTRADOR, VENDEDOR..."
            value={formData.nombre}
            onChange={(e) => setFormData({ nombre: e.target.value.toUpperCase() })}
          />
          <p className="text-[9px] text-zinc-500 italic ml-1">
            * El nombre se guardará automáticamente en mayúsculas.
          </p>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-luck-gold hover:bg-yellow-600 text-black font-black py-4 rounded-xl transition-all 
                     active:scale-[0.98] uppercase text-[11px] tracking-[0.2em] shadow-lg shadow-luck-gold/10"
        >
          {loading ? 'GUARDANDO...' : 'CONFIRMAR ROL'}
        </button>
      </form>
    </Modal>
  )
}

export default RolModal
