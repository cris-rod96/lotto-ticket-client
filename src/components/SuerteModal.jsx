import { suerteAPI } from '@/api/index.api'
import { useEffect, useState } from 'react'
import { LuClover, LuDollarSign } from 'react-icons/lu'
import Swal from 'sweetalert2'
import Modal from './Modal'

const SuerteModal = ({ isOpen, onClose, initialData, cifras, fetchData, selectedSuerte }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    descripcion: '',
    premio: '',
    CifraId: '',
    activo: true,
  })

  useEffect(() => {
    if (initialData) setFormData(initialData)
    else setFormData({ descripcion: '', premio: '', CifraId: '', activo: true })
  }, [initialData, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (selectedSuerte) {
        await suerteAPI.actualizarPremio(selectedSuerte.id, formData)
        Swal.fire({
          icon: 'success',
          title: 'Suerte actualizada',
          text: 'Se actualizó la suerte correctamente',
        })
      } else {
        await suerteAPI.agregar(formData)
        Swal.fire({
          icon: 'success',
          title: 'Suerte agregada',
          text: 'Se agreagó la suerte correctamente',
        })
      }

      fetchData()
      onClose()
    } catch (error) {
      const msg = error?.response?.data?.message || 'Error al procesar la suerte'
      Swal.fire({
        icon: 'error',
        title: 'Error al procesar la suerte',
        text: msg,
      })
    } finally {
      setLoading(false)
    }
  }

  const nivelesSuerte = [
    'PRIMERA SUERTE',
    'SEGUNDA SUERTE',
    'TERCERA SUERTE',
    'CUARTA SUERTE',
    'QUINTA SUERTE',
    'SEXTA SUERTE',
    'SÉPTIMA SUERTE',
    'OCTAVA SUERTE',
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titulo={initialData ? 'EDITAR CONFIGURACIÓN' : 'NUEVA CONFIGURACIÓN'}
      icon={LuClover}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
            Nivel de Suerte
          </label>
          <select
            required
            className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-luck-gold/30 outline-none"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          >
            <option value="">SELECCIONAR NIVEL...</option>
            {nivelesSuerte.map((nivel) => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
              Cifras Relacionadas
            </label>
            <select
              required
              className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-luck-gold/30 outline-none"
              value={formData.CifraId}
              onChange={(e) => setFormData({ ...formData, CifraId: e.target.value })}
            >
              <option value="">SELECCIONAR...</option>
              {cifras.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.cantidad} CIFRAS
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
              Monto del Premio
            </label>
            <div className="relative">
              <LuDollarSign
                className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold"
                size={16}
              />
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 pl-10 text-sm text-white focus:border-luck-gold/30 outline-none"
                value={formData.premio}
                onChange={(e) => setFormData({ ...formData, premio: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-white/[0.02] rounded-2xl border border-white/5">
          <input
            type="checkbox"
            id="activo"
            className="w-5 h-5 accent-luck-gold"
            checked={formData.activo}
            onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
          />
          <label
            htmlFor="activo"
            className="text-[10px] font-black uppercase text-zinc-400 tracking-widest cursor-pointer"
          >
            Suerte Activa para Sorteos
          </label>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-luck-gold hover:bg-yellow-600 text-black font-black py-4 rounded-xl transition-all active:scale-95 uppercase text-xs tracking-[0.2em] shadow-lg shadow-luck-gold/10 mt-2 disabled:opacity-50"
        >
          {loading ? 'GUARDANDO...' : 'GUARDAR CONFIGURACIÓN'}
        </button>
      </form>
    </Modal>
  )
}

export default SuerteModal
