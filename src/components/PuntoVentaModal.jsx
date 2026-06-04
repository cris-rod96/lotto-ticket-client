import { puntosVentaAPI } from '@/api/index.api'
import { PROVINCIAS } from '@/data/provincias' // Asegúrate de tener este archivo exportado
import { useEffect, useState } from 'react'
import { LuStore } from 'react-icons/lu'
import Swal from 'sweetalert2'
import Modal from './Modal'

const PuntoVentaModal = ({ isOpen, onClose, initialData, fetchData }) => {
  const [loading, setLoading] = useState(false)

  // Estados para los selectores
  const [provincia, setProvincia] = useState('')
  const [canton, setCanton] = useState('')

  const initialState = {
    nombre: '',
    ubicacion: '',
    activo: true,
  }

  const [formData, setFormData] = useState(initialState)

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Construir formato: CANTÓN, PROVINCIA
    const ubicacionFinal = `${canton}, ${provincia}`
    const dataToSend = { ...formData, ubicacion: ubicacionFinal }

    try {
      if (initialData) {
        await puntosVentaAPI.actualizarInformacion(initialData.id, dataToSend)
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'Punto de venta actualizado correctamente',
        })
      } else {
        await puntosVentaAPI.crear(dataToSend)
        Swal.fire({ icon: 'success', title: 'Creado', text: 'Punto de venta registrado con éxito' })
      }
      fetchData()
      onClose()
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al procesar el punto de venta'
      Swal.fire({ icon: 'error', title: 'Error', text: msg })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialData && initialData.ubicacion) {
      setFormData({ nombre: initialData.nombre, activo: initialData.activo })
      // Intentar parsear "CANTON, PROVINCIA"
      const parts = initialData.ubicacion.split(', ')
      if (parts.length === 2) {
        setCanton(parts[0])
        setProvincia(parts[1])
      }
    } else {
      setFormData(initialState)
      setProvincia('')
      setCanton('')
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
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
            Nombre de la Sucursal
          </label>
          <input
            type="text"
            required
            className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3.5 px-4 text-sm text-white focus:border-luck-gold/30 outline-none"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          />
        </div>

        {/* SELECTS DE GEOGRAFÍA */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
              Provincia
            </label>
            <select
              required
              value={provincia}
              onChange={(e) => {
                setProvincia(e.target.value)
                setCanton('')
              }}
              className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3.5 px-4 text-sm text-white focus:border-luck-gold/30 outline-none"
            >
              <option value="">Seleccionar...</option>
              {Object.keys(PROVINCIAS).map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
              Cantón
            </label>
            <select
              required
              disabled={!provincia}
              value={canton}
              onChange={(e) => setCanton(e.target.value)}
              className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3.5 px-4 text-sm text-white focus:border-luck-gold/30 outline-none disabled:opacity-50"
            >
              <option value="">Seleccionar...</option>
              {provincia &&
                PROVINCIAS[provincia].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
          <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest block mb-3">
            Estado Operativo
          </label>
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setFormData({ ...formData, activo: !formData.activo })}
          >
            <div
              className={`w-12 h-6 rounded-full p-1 transition-all ${formData.activo ? 'bg-green-500/20' : 'bg-red-500/20'}`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-all ${formData.activo ? 'bg-green-500 translate-x-6' : 'bg-red-500 translate-x-0'}`}
              ></div>
            </div>
            <span
              className={`text-[10px] font-black tracking-widest ${formData.activo ? 'text-green-400' : 'text-red-400'}`}
            >
              {formData.activo ? 'ACTIVO' : 'INACTIVO'}
            </span>
          </div>
        </div>

        <button
          disabled={loading || !provincia || !canton}
          type="submit"
          className="w-full bg-luck-gold hover:bg-yellow-600 text-black font-black py-4 rounded-xl transition-all uppercase text-[11px] tracking-[0.2em]"
        >
          {loading ? 'PROCESANDO...' : 'GUARDAR UBICACIÓN'}
        </button>
      </form>
    </Modal>
  )
}

export default PuntoVentaModal
