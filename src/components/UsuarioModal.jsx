import { usuarioAPI } from '@/api/index.api'
import { useEffect, useState } from 'react'
import { LuUsers } from 'react-icons/lu'
import Swal from 'sweetalert2'
import Modal from './Modal'

const UsuarioModal = ({ isOpen, onClose, initialData, roles, puntosVenta, fetchData }) => {
  const [loading, setLoading] = useState(false)
  const initialState = {
    nombresCompletos: '',
    alias: '',
    clave: '',
    RolId: '',
    PuntoVentaId: '',
    activo: true,
  }

  const [formData, setFormData] = useState(initialState)

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (initialData) {
        await usuarioAPI.actualizarInformacion(initialData.id, formData)

        Swal.fire({
          icon: 'success',
          title: 'Información actualizada',
          text: 'La información del usuario ha sido actualizada',
        })
      } else {
        await usuarioAPI.agregar(formData)
        Swal.fire({
          icon: 'success',
          title: 'Registro creado',
          text: 'Usuario creado con éxito',
        })
      }
      fetchData()
      onClose()
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al procesar el usuario'
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: msg,
      })
    } finally {
      setLoading(false)
    }
  }

  // Cargar datos al editar
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombresCompletos: initialData.nombresCompletos || '',
        alias: initialData.alias || '',
        clave: '', // no mostrar nunca la clave existente
        RolId: initialData.RolId || '',
        PuntoVentaId: initialData.PuntoVentaId || '',
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
      titulo={initialData ? 'EDITAR USUARIO' : 'NUEVO USUARIO'}
      icon={LuUsers}
    >
      <form onSubmit={handleSave} className="space-y-4">
        {/* Nombres y Alias */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
              Nombres Completos
            </label>
            <input
              type="text"
              required
              className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-sm text-white 
                         focus:border-luck-gold/30 outline-none transition-all"
              placeholder="Nombre completo"
              value={formData.nombresCompletos}
              onChange={(e) => setFormData({ ...formData, nombresCompletos: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
              Alias
            </label>
            <input
              type="text"
              required
              className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-sm text-white 
                         focus:border-luck-gold/30 outline-none transition-all"
              placeholder="Alias único"
              value={formData.alias}
              onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
            />
          </div>
        </div>

        {/* Contraseña SOLO AL CREAR */}
        {!initialData && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-sm text-white 
                         focus:border-luck-gold/30 outline-none transition-all"
              placeholder="Contraseña inicial"
              value={formData.clave}
              onChange={(e) => setFormData({ ...formData, clave: e.target.value })}
            />
          </div>
        )}

        {/* Rol y Punto de Venta */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
              Rol
            </label>
            <select
              required
              className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-sm text-white 
                         focus:border-luck-gold/30 outline-none cursor-pointer"
              value={formData.RolId}
              onChange={(e) => setFormData({ ...formData, RolId: e.target.value })}
            >
              <option value="">SELECCIONAR...</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
              Punto de Venta
            </label>
            <select
              className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-sm text-white 
                         focus:border-luck-gold/30 outline-none cursor-pointer"
              value={formData.PuntoVentaId}
              onChange={(e) => setFormData({ ...formData, PuntoVentaId: e.target.value })}
            >
              <option value="">NINGUNO</option>
              {puntosVenta.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Switch Activo */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
            Estado del Usuario
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
              className={`text-xs font-black tracking-widest ${
                formData.activo ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {formData.activo ? 'ACTIVO' : 'INACTIVO'}
            </span>
          </div>
        </div>

        {/* Botón */}
        <button
          disabled={loading}
          type="submit"
          className="w-full bg-luck-gold hover:bg-yellow-600 text-black font-black py-4 rounded-xl transition-all active:scale-95 uppercase text-xs tracking-[0.2em] shadow-lg shadow-luck-gold/10 mt-4"
        >
          {loading ? 'GUARDANDO' : 'GUARDAR'}
        </button>
      </form>
    </Modal>
  )
}

export default UsuarioModal
