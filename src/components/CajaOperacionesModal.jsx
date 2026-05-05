import { cajaAPI, usuarioAPI } from '@/api/index.api'
import { useAuthStore } from '@/store/useAuthStore'
import { useEffect, useState } from 'react'
import { LuCircleX, LuLoader, LuPlus, LuUser, LuWallet } from 'react-icons/lu'
import Swal from 'sweetalert2'
import Modal from './Modal'

const CajaOperacionesModal = ({ type, onClose, puntoVentaId, cajaActiva }) => {
  const { user, esAdministrador } = useAuthStore() // Usando la variable del store
  const [loadingLocal, setLoadingLocal] = useState(false)
  const [usuarios, setUsuarios] = useState([])

  const [formData, setFormData] = useState({
    monto: '',
    observaciones: '',
    usuarioId: esAdministrador ? '' : user?.id, // Auto-asigna si es vendedor
  })

  // Cargar lista de usuarios solo para Apertura realizada por Admin
  useEffect(() => {
    if (type === 'abrir' && esAdministrador) {
      const cargarUsuarios = async () => {
        try {
          const { data } = await usuarioAPI.listarTodos()
          setUsuarios(data.usuarios || [])
        } catch (error) {
          console.error('Error cargando usuarios:', error)
        }
      }
      cargarUsuarios()
    }
  }, [type, esAdministrador])

  const config = {
    abrir: {
      title: 'APERTURA DE CAJA',
      icon: LuWallet,
      btn: 'bg-luck-gold text-black',
      labelMonto: 'Monto de Apertura',
      action: async (data) =>
        await cajaAPI.abrirCaja({
          montoApertura: data.monto,
          saldoActual: data.monto,
          totalInyecciones: 0,
          observaciones: data.observaciones,
          PuntoVentaId: puntoVentaId,
          UsuarioId: data.usuarioId,
        }),
    },
    cerrar: {
      title: 'CIERRE DE TURNO',
      icon: LuCircleX,
      btn: 'bg-red-500 text-white',
      labelMonto: 'Monto de Cierre (Efectivo Real)',
      action: async (data) => {
        if (!cajaActiva?.id) throw new Error('No se encontró el ID de la caja activa')
        return await cajaAPI.cerrarCaja(cajaActiva.id, {
          montoCierre: data.monto,
          observaciones: data.observaciones,
          PuntoVentaId: puntoVentaId,
          estado: 'Cerrada',
        })
      },
    },
    inyectar: {
      title: 'INYECCIÓN DE CAPITAL',
      icon: LuPlus,
      btn: 'bg-green-500 text-white',
      labelMonto: 'Monto a Inyectar',
      action: async (data) => {
        if (!cajaActiva?.id) throw new Error('No hay una caja abierta para inyectar capital')
        return await cajaAPI.inyectarDinero({
          cajaId: cajaActiva.id,
          montoInyeccion: data.monto,
          observaciones: data.observaciones,
          PuntoVentaId: puntoVentaId,
        })
      },
    },
  }

  const currentConfig = config[type]
  const { title, icon: Icon, btn, labelMonto } = currentConfig

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.monto || parseFloat(formData.monto) < 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Monto inválido',
        text: 'El monto debe ser un número positivo',
      })
    }

    if (type === 'abrir' && !formData.usuarioId) {
      return Swal.fire({
        icon: 'error',
        title: 'Usuario requerido',
        text: 'Debes asignar un responsable para la caja',
      })
    }

    try {
      setLoadingLocal(true)
      await currentConfig.action({
        monto: parseFloat(formData.monto),
        observaciones: formData.observaciones,
        usuarioId: formData.usuarioId,
      })

      await Swal.fire({
        icon: 'success',
        title: '¡Operación Exitosa!',
        text: `${title} registrada correctamente.`,
        timer: 2000,
        showConfirmButton: false,
      })

      onClose()
      setTimeout(() => window.location.reload(), 500)
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la operación',
        text: error.response?.data?.message || error.message || 'Error en el servidor',
      })
    } finally {
      setLoadingLocal(false)
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} titulo={title} icon={Icon}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SELECTOR DE USUARIO: SOLO PARA ADMIN EN APERTURA */}
        {type === 'abrir' && esAdministrador && (
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
              Asignar Cajero Responsable
            </label>
            <div className="relative">
              <LuUser
                className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold"
                size={18}
              />
              <select
                required
                value={formData.usuarioId}
                onChange={(e) => setFormData({ ...formData, usuarioId: e.target.value })}
                className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-10 text-sm text-white focus:border-luck-gold/30 outline-none appearance-none cursor-pointer"
              >
                <option value="">Seleccione un cajero...</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombresCompletos}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* FEEDBACK PARA EL VENDEDOR: SOLO EN APERTURA */}
        {type === 'abrir' && !esAdministrador && (
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-luck-gold/10 flex items-center justify-center text-luck-gold">
              <LuUser size={20} />
            </div>
            <div>
              <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">
                Responsable del Turno
              </p>
              <p className="text-sm text-white font-bold uppercase">{user?.nombresCompletos}</p>
            </div>
          </div>
        )}

        {/* INPUT DE MONTO */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
            {labelMonto} ($)
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.monto}
            onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
            className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-5 text-xl font-mono font-black text-white focus:border-luck-gold/30 outline-none transition-all placeholder:text-zinc-800"
            placeholder="0.00"
            autoFocus
          />
        </div>

        {/* TEXTAREA DE OBSERVACIONES */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">
            Observaciones Adicionales
          </label>
          <textarea
            rows="3"
            value={formData.observaciones}
            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
            className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-sm text-zinc-300 focus:border-luck-gold/30 outline-none resize-none"
            placeholder="NOTAS SOBRE LA OPERACIÓN..."
          />
        </div>

        {/* BOTÓN DE ACCIÓN */}
        <button
          type="submit"
          disabled={loadingLocal}
          className={`w-full font-black py-5 rounded-2xl transition-all active:scale-95 uppercase text-[11px] tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 ${btn} ${loadingLocal ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loadingLocal ? (
            <>
              <LuLoader className="animate-spin" size={18} /> Procesando...
            </>
          ) : (
            'Confirmar Registro'
          )}
        </button>
      </form>
    </Modal>
  )
}

export default CajaOperacionesModal
