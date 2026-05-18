import { cajaAPI, ticketAPI } from '@/api/index.api'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { LuBanknote, LuCreditCard, LuLoader, LuPlus, LuTicket, LuTrash2, LuX } from 'react-icons/lu'
import Swal from 'sweetalert2'

const TicketModalVendedor = ({ isOpen, onClose, sorteos, usuario, fetchData }) => {
  // El punto de venta ya viene directo desde el usuario logueado
  const puntoVentaId = usuario?.PuntoVentaId

  const [sorteoId, setSorteoId] = useState('')
  const [jugadas, setJugadas] = useState([])
  const [tempNumero, setTempNumero] = useState('')
  const [tempMonto, setTempMonto] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [caja, setCaja] = useState(null)

  // Estados de pago
  const [metodoPago, setMetodoPago] = useState('Efectivo')
  const [referenciaPago, setReferenciaPago] = useState('')

  const sorteoSeleccionado = useMemo(
    () => sorteos.find((s) => s.id === sorteoId),
    [sorteoId, sorteos]
  )

  const numCifras = sorteoSeleccionado?.Cifra?.cantidad || 2

  // Carga automática de la caja asignada al vendedor al abrir el modal
  useEffect(() => {
    if (isOpen && puntoVentaId) {
      cajaAPI
        .obtenerCajaAbierta(puntoVentaId)
        .then((res) => {
          const { caja: cajaAbierta } = res.data
          setCaja(cajaAbierta)
          setError('')
        })
        .catch(() => {
          setCaja(null)
          setError('TU PUNTO DE VENTA NO TIENE UNA CAJA ABIERTA EN ESTE TURNO')
        })
    }
  }, [isOpen, puntoVentaId])

  useEffect(() => {
    setTempNumero('')
    setTempMonto('')
    setError('')
  }, [sorteoId, numCifras])

  const agregarJugada = async () => {
    if (!tempNumero || !tempMonto) return
    if (!sorteoId) return setError('SELECCIONE UN SORTEO')
    if (tempNumero.length !== numCifras) return setError(`REQUERIDO: ${numCifras} CIFRAS`)

    const yaExiste = jugadas.some((j) => j.numero === tempNumero)
    if (yaExiste) return setError(`EL NÚMERO ${tempNumero} YA ESTÁ EN EL TICKET`)

    setLoading(true)
    setError('')

    try {
      const response = await ticketAPI.verificarCupo(sorteoId, tempNumero, parseFloat(tempMonto))
      if (response.status !== 200) {
        setError(response.data.message || 'SIN CUPO DISPONIBLE')
        return
      }

      setJugadas([
        { id: crypto.randomUUID(), numero: tempNumero, monto: parseFloat(tempMonto) },
        ...jugadas,
      ])
      setTempNumero('')
      setTempMonto('')
    } catch (err) {
      setError(err.response?.data?.message || 'ERROR DE DISPONIBILIDAD')
    } finally {
      setLoading(false)
    }
  }

  const emitirTicket = async () => {
    if (jugadas.length === 0) return
    if (!puntoVentaId) return setError('ERROR DE CONFIGURACIÓN: SIN SUCURSAL ASIGNADA')
    if (!caja?.id) return setError('OPERACIÓN DETENIDA: NO HAY UNA CAJA ABIERTA')

    if (metodoPago === 'Transferencia' && !referenciaPago) {
      return setError('DEBE INGRESAR LA REFERENCIA DE PAGO')
    }

    setLoading(true)
    try {
      const payload = {
        SorteoId: sorteoId,
        PuntoVentaId: puntoVentaId,
        UsuarioId: usuario?.id,
        CajaId: caja?.id,
        detalles: jugadas.map((j) => ({ numeroJugado: j.numero, montoApostado: j.monto })),
        metodoPago,
        referenciaPago: metodoPago === 'Transferencia' ? referenciaPago : null,
      }

      const response = await ticketAPI.vender(payload)
      if (response.status === 201) {
        Swal.fire({
          title: 'ÉXITO',
          text: 'Ticket generado correctamente',
          icon: 'success',
          background: '#ffffff',
          color: '#111615',
          confirmButtonColor: '#EAB308',
          customClass: { popup: 'rounded-[2rem] border border-black/5' },
        })
        setJugadas([])
        setReferenciaPago('')
        setMetodoPago('Efectivo')
        onClose()
        if (fetchData) fetchData()
      }
    } catch (err) {
      setError(`VENTA RECHAZADA: ${err.response?.data?.message || 'ERROR'}`)
    } finally {
      setLoading(false)
    }
  }

  const totalTicket = jugadas.reduce((acc, curr) => acc + curr.monto, 0)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <style>{`
        .custom-scroll-minimal::-webkit-scrollbar { width: 4px; }
        .custom-scroll-minimal::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll-minimal::-webkit-scrollbar-thumb { background: rgba(234, 179, 8, 0.2); border-radius: 10px; }
        .custom-scroll-minimal::-webkit-scrollbar-thumb:hover { background: rgba(234, 179, 8, 0.5); }
      `}</style>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0c0d0d] border border-white/10 w-full max-w-6xl h-[85vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* HEADER */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-luck-gold/10 flex items-center justify-center text-luck-gold border border-luck-gold/20">
              <LuTicket size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase italic tracking-tight">
                Nueva Emisión de Ticket
              </h2>
              <p className="text-luck-gold text-[9px] font-bold uppercase tracking-[0.2em]">
                Punto de Venta: {usuario?.PuntoVenta?.nombre || 'Mi Sucursal'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all"
          >
            <LuX size={22} />
          </button>
        </div>

        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          {/* PANEL IZQUIERDO: CONFIGURACIÓN */}
          <div className="col-span-12 lg:col-span-5 p-8 border-r border-white/5 flex flex-col gap-6 overflow-y-auto custom-scroll-minimal">
            <div className="space-y-4">
              {/* Información fija de su caja actual */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                  Estado de Terminal:
                </span>
                <div className="flex items-center gap-2">
                  {/* Un pequeño círculo indicador para darle un toque más Pro */}
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${caja?.id ? 'bg-emerald-500' : 'bg-red-500'}`}
                  />
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${caja?.id ? 'text-emerald-500' : 'text-red-500'}`}
                  >
                    {caja?.id ? 'Caja Abierta / Activa' : 'Caja Cerrada / Inactiva'}
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
                  Sorteo Disponible
                </label>
                <select
                  disabled={jugadas.length > 0}
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-3.5 text-xs text-white focus:border-luck-gold/40 outline-none transition-all cursor-pointer"
                  value={sorteoId}
                  onChange={(e) => setSorteoId(e.target.value)}
                >
                  <option value="" disabled>
                    SELECCIONAR SORTEO...
                  </option>
                  {sorteos.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.Catalogo?.nombre} ({s.Cifra?.cantidad} Cifras)
                    </option>
                  ))}
                </select>
              </div>

              {/* METODOS DE PAGO */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
                  Método de Pago
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMetodoPago('Efectivo')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all text-[10px] font-black uppercase ${
                      metodoPago === 'Efectivo'
                        ? 'bg-luck-gold text-black border-luck-gold shadow-lg shadow-luck-gold/20'
                        : 'bg-zinc-900/50 text-zinc-500 border-white/5'
                    }`}
                  >
                    <LuBanknote size={16} /> Efectivo
                  </button>
                  <button
                    onClick={() => setMetodoPago('Transferencia')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all text-[10px] font-black uppercase ${
                      metodoPago === 'Transferencia'
                        ? 'bg-luck-gold text-black border-luck-gold shadow-lg shadow-luck-gold/20'
                        : 'bg-zinc-900/50 text-zinc-500 border-white/5'
                    }`}
                  >
                    <LuCreditCard size={16} /> Transferencia
                  </button>
                </div>
              </div>

              {/* CAMPO REFERENCIA DIGITAL */}
              <AnimatePresence>
                {metodoPago === 'Transferencia' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-1.5"
                  >
                    <label className="text-[10px] font-black uppercase text-luck-gold tracking-widest ml-1">
                      Referencia / Comprobante
                    </label>
                    <input
                      type="text"
                      placeholder="INGRESE Nº OPERACIÓN"
                      className="w-full bg-luck-gold/10 border border-luck-gold/30 rounded-xl p-3.5 text-xs text-white placeholder:text-luck-gold/30 outline-none focus:border-luck-gold transition-all"
                      value={referenciaPago}
                      onChange={(e) => setReferenciaPago(e.target.value.toUpperCase())}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AREA DE INGRESO DE NÚMEROS */}
            <div className="p-6 bg-zinc-950/40 border border-white/5 rounded-[2rem] space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-luck-gold text-[10px] font-black uppercase tracking-widest">
                  Entrada de Datos
                </span>
                <span className="bg-white/5 text-zinc-500 text-[9px] font-black px-2 py-1 rounded-md">
                  {numCifras} CIFRAS
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block text-center">
                    Número
                  </span>
                  <input
                    type="text"
                    maxLength={numCifras}
                    placeholder="00"
                    className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-center text-3xl font-black text-white focus:border-luck-gold focus:ring-1 focus:ring-luck-gold/20 outline-none transition-all"
                    value={tempNumero}
                    onChange={(e) => setTempNumero(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block text-center">
                    Inversión $
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-center text-3xl font-black text-white focus:border-luck-gold focus:ring-1 focus:ring-luck-gold/20 outline-none transition-all"
                    value={tempMonto}
                    onChange={(e) => setTempMonto(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-[9px] font-black uppercase text-center bg-red-500/10 py-2.5 rounded-xl border border-red-500/20">
                  {error}
                </p>
              )}

              <button
                onClick={agregarJugada}
                disabled={loading || !caja?.id}
                className="w-full bg-luck-gold hover:bg-yellow-500 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-luck-gold/10 disabled:opacity-20"
              >
                {loading ? (
                  <LuLoader className="animate-spin" size={18} />
                ) : (
                  <LuPlus size={18} strokeWidth={4} />
                )}
                Añadir Jugada
              </button>
            </div>
          </div>

          {/* PANEL DERECHO: LISTA DE JUGADAS */}
          <div className="col-span-12 lg:col-span-7 p-8 bg-black/40 flex flex-col overflow-hidden">
            <h3 className="text-zinc-600 font-black text-[10px] uppercase tracking-[0.3em] mb-6">
              Contenido del Ticket
            </h3>

            <div className="flex-1 overflow-y-auto pr-2 custom-scroll-minimal space-y-2">
              <AnimatePresence mode="popLayout">
                {jugadas.length > 0 ? (
                  jugadas.map((j) => (
                    <motion.div
                      key={j.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex justify-between items-center bg-[#111615] border border-white/[0.03] p-4 rounded-2xl hover:border-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-lg bg-black border border-white/5 flex items-center justify-center text-luck-gold font-black text-xl italic shadow-inner">
                          {j.numero}
                        </div>
                        <div>
                          <p className="text-zinc-500 text-[8px] font-black uppercase tracking-tighter">
                            Número Jugado
                          </p>
                          <p className="text-white text-[10px] font-bold">Validado</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-lg font-black text-white tracking-tighter">
                          ${j.monto.toFixed(2)}
                        </span>
                        <button
                          onClick={() => setJugadas(jugadas.filter((item) => item.id !== j.id))}
                          className="p-2 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <LuTrash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-10">
                    <LuTicket size={60} strokeWidth={1} />
                    <p className="font-black uppercase tracking-[0.4em] text-[9px] mt-4">
                      Esperando selección...
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* FOOTER: TOTAL Y EMISIÓN */}
            <div className="mt-6 p-6 bg-zinc-900/50 border border-white/5 rounded-[2rem]">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1">
                    Monto Total a Pagar
                  </p>
                  <p className="text-4xl font-black text-white tracking-tighter italic">
                    ${totalTicket.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                    {jugadas.length} JUGADAS
                  </span>
                  <div
                    className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase ${
                      metodoPago === 'Transferencia'
                        ? 'bg-luck-gold/10 border-luck-gold/20 text-luck-gold'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                    }`}
                  >
                    {metodoPago === 'Transferencia' ? 'Pago Digital' : 'Terminal Online'}
                  </div>
                </div>
              </div>
              <button
                disabled={jugadas.length === 0 || loading || !caja?.id}
                onClick={emitirTicket}
                className="w-full bg-white hover:bg-zinc-200 text-black font-black py-4 rounded-2xl uppercase text-[10px] tracking-[0.2em] transition-all disabled:opacity-20 active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl"
              >
                {loading && <LuLoader className="animate-spin" size={16} />}
                Confirmar Venta y Emitir
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default TicketModalVendedor
