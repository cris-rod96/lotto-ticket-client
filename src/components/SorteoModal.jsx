import { useEffect, useState } from 'react'
import { LuDice5 } from 'react-icons/lu'
import Modal from './Modal'

const SorteoModal = ({ isOpen, onClose, initialData, catalogos, cifras, onSave }) => {
  // Estado inicial alineado con tu modelo de Sequelize
  const initialState = {
    numero: '',
    jornada: 'Matutina',
    fechaSorteo: '',
    horaSorteo: '',
    fechaCierre: '',
    horaCierre: '',
    CatalogoId: '',
    CifraId: '',
    estado: 'Abierto',
  }

  const [formData, setFormData] = useState(initialState)

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData(initialState)
    }
  }, [initialData, isOpen])

  // Lógica para calcular el cierre automático (5 min antes)
  const handleHoraSorteoChange = (e) => {
    const horaSorteo = e.target.value
    const [horas, minutos] = horaSorteo.split(':').map(Number)

    const fechaAux = new Date()
    fechaAux.setHours(horas, minutos, 0)

    // Restamos 5 minutos
    fechaAux.setMinutes(fechaAux.getMinutes() - 5)

    const horaCierre = fechaAux.toTimeString().slice(0, 5)

    setFormData({
      ...formData,
      horaSorteo,
      horaCierre,
      // Por defecto, la fecha de cierre es la misma del sorteo
      fechaCierre: formData.fechaSorteo,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titulo={initialData ? 'EDITAR SORTEO' : 'NUEVO SORTEO'}
      icon={LuDice5}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
              Sorteo #
            </label>
            <input
              type="text"
              required
              className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-sm text-white focus:border-luck-gold/30 outline-none transition-all"
              placeholder="000"
              value={formData.numero}
              onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
              Jornada
            </label>
            <select
              className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-sm text-white focus:border-luck-gold/30 outline-none cursor-pointer"
              value={formData.jornada}
              onChange={(e) => setFormData({ ...formData, jornada: e.target.value })}
            >
              <option value="Matutina">MATUTINA</option>
              <option value="Vespertina">VESPERTINA</option>
              <option value="Nocturna">NOCTURNA</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
              Fecha Sorteo
            </label>
            <input
              type="date"
              required
              className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-sm text-white focus:border-luck-gold/30 outline-none"
              value={formData.fechaSorteo}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fechaSorteo: e.target.value,
                  fechaCierre: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
              Hora Sorteo
            </label>
            <input
              type="time"
              required
              className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-sm text-white focus:border-luck-gold/30 outline-none"
              value={formData.horaSorteo}
              onChange={handleHoraSorteoChange}
            />
          </div>
        </div>

        {/* Sección de Cierre (Cálculo Automático) */}
        <div className="grid grid-cols-2 gap-4 bg-red-500/5 p-4 rounded-2xl border border-red-500/10">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-red-400/60 tracking-widest ml-1">
              Cierre de Ventas
            </label>
            <input
              type="date"
              readOnly // Evitamos errores manuales ya que depende del sorteo
              className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-sm text-zinc-400 outline-none"
              value={formData.fechaCierre}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-red-400/60 tracking-widest ml-1">
              Hora Límite (-5min)
            </label>
            <input
              type="time"
              readOnly
              className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-sm text-zinc-400 outline-none"
              value={formData.horaCierre}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
              Catálogo
            </label>
            <select
              required
              className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-sm text-white focus:border-luck-gold/30 outline-none"
              value={formData.CatalogoId}
              onChange={(e) => setFormData({ ...formData, CatalogoId: e.target.value })}
            >
              <option value="">SELECCIONAR...</option>
              {catalogos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
              Cifras
            </label>
            <select
              required
              className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-sm text-white focus:border-luck-gold/30 outline-none"
              value={formData.CifraId}
              onChange={(e) => setFormData({ ...formData, CifraId: e.target.value })}
            >
              <option value="">SELECCIONAR...</option>
              {cifras.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.cantidad}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-luck-gold hover:bg-yellow-600 text-black font-black py-4 rounded-xl transition-all active:scale-95 uppercase text-xs tracking-[0.2em] shadow-lg shadow-luck-gold/10 mt-4"
        >
          {initialData ? 'ACTUALIZAR SORTEO' : 'GUARDAR SORTEO'}
        </button>
      </form>
    </Modal>
  )
}

export default SorteoModal
