import { suerteAPI } from '@/api/index.api'
import { useEffect, useState } from 'react'
import { LuClover, LuDollarSign } from 'react-icons/lu'
import Swal from 'sweetalert2'
import Modal from './Modal'

const SuerteModal = ({
  isOpen,
  onClose,
  initialData,
  cifras,
  fetchData,
  selectedSuerte,
  selectedPuntoId,
}) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    descripcion: '',
    premio: '',
    CifraId: '',
    activo: true,
  })

  useEffect(() => {
    if (initialData) {
      // Al editar, mapeamos los datos para que el input de premio muestre el valor correcto
      setFormData({
        descripcion: initialData.descripcion || '',
        premio: initialData.premio || '', // Este viene del map que hicimos en el componente padre
        CifraId: initialData.CifraId || '',
        activo: initialData.activo ?? true,
      })
    } else {
      setFormData({ descripcion: '', premio: '', CifraId: '', activo: true })
    }
  }, [initialData, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validación de seguridad
    if (!selectedPuntoId && selectedSuerte) {
      return Swal.fire({
        icon: 'warning',
        title: 'Punto de Venta no seleccionado',
        text: 'Debes seleccionar un punto de venta para asignar el premio.',
      })
    }

    setLoading(true)
    try {
      // Preparamos el payload incluyendo el ID del punto de venta
      const payload = {
        ...formData,
        PuntoVentaId: selectedPuntoId,
      }

      if (selectedSuerte) {
        // En tu backend, esta ruta ahora debería buscar/actualizar en DetallesSuerte
        await suerteAPI.actualizarPremio(selectedSuerte.id, payload)
        Swal.fire({
          icon: 'success',
          title: 'Configuración actualizada',
          text: 'Se actualizó el premio para este punto de venta correctamente',
        })
      } else {
        // Al agregar una nueva suerte maestra, el backend debería encargarse de
        // crear los DetallesSuerte por defecto para los puntos existentes si así lo decides
        await suerteAPI.agregar(payload)
        Swal.fire({
          icon: 'success',
          title: 'Suerte agregada',
          text: 'Se agregó la nueva suerte al catálogo correctamente',
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
    'SEPTIMA SUERTE',
    'OCTAVA SUERTE',
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titulo={initialData ? 'EDITAR PREMIO LOCAL' : 'NUEVA SUERTE MAESTRA'}
      icon={LuClover}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Aviso de Punto de Venta actual */}
        {selectedPuntoId && (
          <div className="bg-luck-gold/5 border border-luck-gold/20 p-3 rounded-xl text-center">
            <p className="text-[9px] font-black uppercase text-luck-gold tracking-[0.2em]">
              Editando premios para el punto de venta seleccionado
            </p>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
            Nivel de Suerte
          </label>
          <select
            required
            disabled={!!initialData} // No permitimos cambiar la descripción al editar, solo el premio
            className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-luck-gold/30 outline-none disabled:opacity-50"
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
              disabled={!!initialData} // No permitimos cambiar la cifra al editar
              className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-luck-gold/30 outline-none disabled:opacity-50"
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
              Monto del Premio ($)
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
