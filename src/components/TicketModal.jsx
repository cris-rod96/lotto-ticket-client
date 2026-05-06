import { cajaAPI, ticketAPI } from '@/api/index.api'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { LuLoader, LuPlus, LuTicket, LuTrash2, LuX } from 'react-icons/lu'

const TicketModal = ({ isOpen, onClose, puntosVenta, sorteos, usuario, fetchData }) => {
  const [puntoVentaId, setPuntoVentaId] = useState('')
  const [sorteoId, setSorteoId] = useState('')
  const [jugadas, setJugadas] = useState([])
  const [tempNumero, setTempNumero] = useState('')
  const [tempMonto, setTempMonto] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [caja, setCaja] = useState(null)

  const sorteoSeleccionado = useMemo(
    () => sorteos.find((s) => s.id === sorteoId),
    [sorteoId, sorteos]
  )

  const numCifras = sorteoSeleccionado?.Cifra?.cantidad || 2

  useEffect(() => {
    if (puntoVentaId) {
      cajaAPI
        .obtenerCajaAbierta(puntoVentaId)
        .then((res) => {
          const { caja: cajaAbierta } = res.data
          console.log(cajaAbierta)
          setCaja(cajaAbierta)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [puntoVentaId])

  // Resetear inputs si cambian las reglas del sorteo
  useEffect(() => {
    setTempNumero('')
    setTempMonto('')
    setError('')
  }, [sorteoId, numCifras])

  // 1. VALIDACIÓN DE CUPO (AL AÑADIR JUGADA)
  const agregarJugada = async () => {
    if (!tempNumero || !tempMonto) return
    if (!sorteoId) {
      setError('POR FAVOR SELECCIONE UN SORTEO')
      return
    }
    if (tempNumero.length !== numCifras) {
      setError(`REQUERIDO: ${numCifras} CIFRAS`)
      return
    }

    // BLOQUEO DIRECTO: Si el número ya existe en el detalle del frontend
    const yaExiste = jugadas.some((j) => j.numero === tempNumero)
    if (yaExiste) {
      setError(`EL NÚMERO ${tempNumero} YA ESTÁ EN EL TICKET`)
      return
    }

    setLoading(true)
    setError('')

    try {
      // Validación preventiva de cupo
      const response = await ticketAPI.verificarCupo(sorteoId, tempNumero, parseFloat(tempMonto))

      if (response.status !== 200) {
        setError(response.data.message || 'SIN CUPO DISPONIBLE')
        return
      }

      setJugadas([
        {
          id: crypto.randomUUID(),
          numero: tempNumero,
          monto: parseFloat(tempMonto),
        },
        ...jugadas,
      ])

      setTempNumero('')
      setTempMonto('')
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'ERROR DE DISPONIBILIDAD')
    } finally {
      setLoading(false)
    }
  }

  // 2. EMISIÓN DEL TICKET FINAL (TRANSACCIONAL)
  const emitirTicket = async () => {
    // Validaciones básicas antes de disparar
    if (jugadas.length === 0) return
    if (!puntoVentaId) return setError('SELECCIONE PUNTO DE VENTA')
    if (!caja?.id) return setError('NO HAY UNA CAJA ABIERTA REGISTRADA')

    setLoading(true)
    setError('')

    try {
      const payload = {
        SorteoId: sorteoId,
        PuntoVentaId: puntoVentaId,
        UsuarioId: usuario?.id, // ID del usuario logueado
        CajaId: caja?.id, // ID de la caja activa
        detalles: jugadas.map((j) => ({
          numeroJugado: j.numero,
          montoApostado: j.monto,
        })),
      }

      // Llamada al nuevo servicio transaccional
      const response = await ticketAPI.vender(payload)

      if (response.status === 201) {
        alert('TICKET GENERADO CON ÉXITO')
        setJugadas([])
        onClose()
        if (fetchData) fetchData()
      }
    } catch (err) {
      console.log(err)
      // PUNTO MEDIO: Si el cupo se agotó en el milisegundo final,
      // el backend devuelve 400/500 y aquí lo mostramos sin cerrar el modal.
      const msg = err.response?.data?.message || 'ERROR AL GENERAR TICKET'
      setError(`VENTA RECHAZADA: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  const totalTicket = jugadas.reduce((acc, curr) => acc + curr.monto, 0)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-left">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0c0d0d] border border-white/10 w-full max-w-6xl h-[85vh] rounded-[2rem] overflow-hidden flex flex-col"
      >
        {/* HEADER */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center text-left">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20">
              <LuTicket size={24} />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-black text-white uppercase italic text-left">
                Emitir Nuevo Ticket
              </h2>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest text-left">
                Módulo de ventas autorizado
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-all"
          >
            <LuX size={20} />
          </button>
        </div>

        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          {/* PANEL IZQUIERDO */}
          <div className="col-span-12 lg:col-span-5 p-10 border-r border-white/5 space-y-8 overflow-y-auto text-left">
            <div className="space-y-6">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1 text-left">
                  Punto de Venta
                </label>
                <select
                  disabled={jugadas.length > 0}
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-[#D4AF37]/30 outline-none"
                  value={puntoVentaId}
                  onChange={(e) => setPuntoVentaId(e.target.value)}
                >
                  <option value="" disabled>
                    -- SELECCIONAR --
                  </option>
                  {puntosVenta.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1 text-left">
                  Sorteo Disponible
                </label>
                <select
                  disabled={jugadas.length > 0}
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-[#D4AF37]/30 outline-none"
                  value={sorteoId}
                  onChange={(e) => setSorteoId(e.target.value)}
                >
                  <option value="" disabled>
                    SELECCIONAR SORTEO...
                  </option>
                  {sorteos.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.numero} - {s.Catalogo?.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* AREA DE INGRESO */}
            <div className="p-8 bg-zinc-950/50 border border-[#D4AF37]/10 rounded-[2rem] space-y-6">
              <div className="flex justify-between items-center">
                <span className="bg-[#D4AF37] text-black text-[9px] font-black px-3 py-1 rounded-full uppercase">
                  Ingreso de Jugada
                </span>
                <span className="text-zinc-500 text-[9px] font-black uppercase tracking-tighter">
                  {numCifras} Cifras Activas
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-center">
                  <span className="text-[10px] font-black text-zinc-600 uppercase">Número</span>
                  <input
                    type="text"
                    maxLength={numCifras}
                    placeholder="00"
                    disabled={loading}
                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 text-center text-3xl font-black text-white focus:border-[#D4AF37] outline-none"
                    value={tempNumero}
                    onChange={(e) => setTempNumero(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <div className="space-y-2 text-center">
                  <span className="text-[10px] font-black text-zinc-600 uppercase">
                    Inversión ($)
                  </span>
                  <input
                    type="number"
                    placeholder="5.00"
                    disabled={loading}
                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 text-center text-3xl font-black text-white focus:border-[#D4AF37] outline-none"
                    value={tempMonto}
                    onChange={(e) => setTempMonto(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-[10px] font-black uppercase text-center border border-red-500/20 bg-red-500/5 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <button
                onClick={agregarJugada}
                disabled={loading}
                className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 uppercase text-[11px] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <LuLoader className="animate-spin" size={18} />
                ) : (
                  <LuPlus size={18} strokeWidth={3} />
                )}
                Añadir al Ticket
              </button>
            </div>
          </div>

          {/* PANEL DERECHO */}
          <div className="col-span-12 lg:col-span-7 p-10 bg-black/20 flex flex-col overflow-hidden text-left">
            <h3 className="text-zinc-500 font-black text-xs uppercase tracking-[0.3em] mb-8 text-left">
              Detalle de Venta
            </h3>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar text-left">
              <AnimatePresence mode="popLayout">
                {jugadas.length > 0 ? (
                  jugadas.map((j) => (
                    <motion.div
                      key={j.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-between items-center bg-zinc-900/40 border border-white/5 p-5 rounded-2xl"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-xl bg-zinc-950 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-black text-2xl uppercase">
                          {j.numero}
                        </div>
                        <span className="text-zinc-500 text-[10px] font-black uppercase">
                          Jugada
                        </span>
                      </div>
                      <div className="flex items-center gap-8">
                        <span className="text-2xl font-black text-white">
                          ${j.monto.toFixed(2)}
                        </span>
                        <button
                          onClick={() => setJugadas(jugadas.filter((item) => item.id !== j.id))}
                          className="text-zinc-700 hover:text-red-500 transition-colors"
                        >
                          <LuTrash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale">
                    <LuTicket size={80} strokeWidth={1} />
                    <p className="font-black uppercase tracking-[0.5em] text-[10px] mt-4 text-center">
                      Esperando Jugadas...
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* TOTALIZADOR */}
            <div className="mt-8 p-8 bg-zinc-950/80 border border-white/5 rounded-[2.5rem]">
              <div className="flex justify-between items-center mb-6">
                <div className="text-left">
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1 text-left">
                    Total Acumulado
                  </p>
                  <p className="text-5xl font-black text-white italic tracking-tighter text-left">
                    ${totalTicket.toFixed(2)}
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-green-500/5 border border-green-500/10 text-green-500 text-[9px] font-black uppercase">
                  Listo para emitir
                </div>
              </div>
              <button
                disabled={jugadas.length === 0 || loading}
                onClick={emitirTicket}
                className="w-full bg-white text-black font-black py-4 rounded-xl uppercase text-[11px] tracking-[0.2em] transition-all disabled:opacity-20 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {loading && <LuLoader className="animate-spin" size={18} />}
                Confirmar y Generar Ticket
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default TicketModal
