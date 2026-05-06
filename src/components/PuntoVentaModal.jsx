import { puntosVentaAPI } from '@/api/index.api'
import { useEffect, useState } from 'react'
import { LuMapPin, LuStore } from 'react-icons/lu'
import Swal from 'sweetalert2'
import Modal from './Modal'

const PuntoVentaModal = ({ isOpen, onClose, initialData, fetchData }) => {
  const [loading, setLoading] = useState(false)

  const initialState = {
    nombre: '',
    ubicacion: '',
    activo: true,
  }

  const [formData, setFormData] = useState(initialState)

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (initialData) {
        // Asumiendo que tienes este método en tu API
        await puntosVentaAPI.actualizarInformacion(initialData.id, formData)

        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'Punto de venta actualizado correctamente',
        })
      } else {
        await puntosVentaAPI.crear(formData)
        Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'Punto de venta registrado con éxito',
        })
      }
      fetchData()
      onClose()
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al procesar el punto de venta'
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: msg,
      })
    } finally {
      setLoading(false)
    }
  }

  // Cargar datos al editar (cuando el modal se abre o cambia initialData)
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        ubicacion: initialData.ubicacion || '',
        activo: initialData.activo ?? true,
      })
    } else {
      setFormData(initialState)
    }
  }, [initialData, isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titulo={initialData ? 'EDITAR PUNTO DE VENTA' : 'NUEVO PUNTO DE VENTA'}
      icon={LuStore}
    >
      <form onSubmit={handleSave} className="space-y-5">
        {/* Nombre del Punto */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
            Nombre de la Sucursal / Punto
          </label>
          <div className="relative">
            <LuStore className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              type="text"
              required
              className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white 
                         focus:border-luck-gold/30 outline-none transition-all placeholder:text-zinc-700"
              placeholder="Ej: Agencia Central"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
          </div>
        </div>

        {/* Ubicación */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
            Ubicación / Dirección
          </label>
          <div className="relative">
            <LuMapPin
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              size={16}
            />
            <input
              type="text"
              required
              className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white 
                         focus:border-luck-gold/30 outline-none transition-all placeholder:text-zinc-700"
              placeholder="Ej: Av. Principal y Calle 10"
              value={formData.ubicacion}
              onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
            />
          </div>
        </div>

        {/* Switch Activo (Copiado de tu diseño de Usuario) */}
        <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
          <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest block mb-3">
            Estado Operativo
          </label>

          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setFormData({ ...formData, activo: !formData.activo })}
          >
            <div
              className={`w-12 h-6 rounded-full p-1 transition-all ${
                formData.activo ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-all ${
                  formData.activo ? 'bg-green-500 translate-x-6' : 'bg-red-500 translate-x-0'
                }`}
              ></div>
            </div>
            <span
              className={`text-[10px] font-black tracking-widest ${
                formData.activo ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {formData.activo ? 'PUNTO ABIERTO / ACTIVO' : 'PUNTO CERRADO / INACTIVO'}
            </span>
          </div>
        </div>

        {/* Botón de Acción */}
        <button
          disabled={loading}
          type="submit"
          className="w-full bg-luck-gold hover:bg-yellow-600 text-black font-black py-4 rounded-xl transition-all 
                     active:scale-[0.98] uppercase text-[11px] tracking-[0.2em] shadow-lg shadow-luck-gold/10 mt-2"
        >
          {loading ? 'PROCESANDO...' : initialData ? 'GUARDAR CAMBIOS' : 'REGISTRAR PUNTO'}
        </button>
      </form>
    </Modal>
  )
}

export default PuntoVentaModal
