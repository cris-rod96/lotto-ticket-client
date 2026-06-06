import { pdf } from '@react-pdf/renderer'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  LuBanknote,
  LuCircleAlert,
  LuCreditCard,
  LuLoader,
  LuPlus,
  LuTicket,
  LuTrash2,
  LuUserPlus,
  LuX,
} from 'react-icons/lu'
import Swal from 'sweetalert2'

import { cajaAPI, ticketAPI } from '@/api/index.api'
import TicketTemplate from '@/templates/TicketTemplate'

const TicketModal = ({
  isOpen,
  onClose,
  puntosVenta,
  sorteos,
  usuario,
  fetchData,
  suertes = [],
}) => {
  const [puntoVentaId, setPuntoVentaId] = useState('')
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

  // Estados opcionales del Cliente
  const [clienteNombres, setClienteNombres] = useState('')
  const [clienteCedula, setClienteCedula] = useState('')
  const [clienteWhatsapp, setClienteWhatsapp] = useState('')

  const sorteoSeleccionado = useMemo(
    () => sorteos.find((s) => s.id === sorteoId),
    [sorteoId, sorteos]
  )

  const numCifras = sorteoSeleccionado?.Cifra?.cantidad || 2

  // Carga reactiva de caja basada en el Punto de Venta seleccionado por el Admin
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
          setError('EL PUNTO DE VENTA SELECCIONADO NO TIENE UNA CAJA ABIERTA EN ESTE TURNO')
        })
    } else {
      setCaja(null)
    }
  }, [isOpen, puntoVentaId])

  // Desvanecer el error automáticamente tras 3.2 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('')
      }, 3200)
      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    setTempNumero('')
    setTempMonto('')
    setError('')
  }, [sorteoId, numCifras])

  const agregarJugada = async () => {
    if (!tempNumero || !tempMonto) return
    if (!puntoVentaId) return setError('SELECCIONE UN PUNTO DE VENTA')
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

  const handlePrintAutomatico = async (ticketCreado) => {
    try {
      const suertesParaImprimir = suertes && suertes.length > 0 ? suertes : []

      const doc = <TicketTemplate ticket={ticketCreado} suertes={suertesParaImprimir} />
      const blob = await pdf(doc).toBlob()
      const url = URL.createObjectURL(blob)

      const iframe = document.createElement('iframe')
      iframe.style.position = 'fixed'
      iframe.style.right = '0'
      iframe.style.bottom = '0'
      iframe.style.width = '0'
      iframe.style.height = '0'
      iframe.style.border = '0'
      iframe.src = url

      document.body.appendChild(iframe)

      setTimeout(() => {
        try {
          iframe.contentWindow.focus()
          iframe.contentWindow.print()
        } catch (printError) {
          Swal.fire({
            icon: 'error',
            title: 'Error al imprimir',
            text: `Fallo al  invocar print() en el iframe: ${printError}`,
          })
        }

        setTimeout(() => {
          document.body.removeChild(iframe)
          URL.revokeObjectURL(url)
        }, 3000)
      }, 600)
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `'Error en la generación del búfer de impresión: ${error}`,
      })
    }
  }

  const emitirTicket = async () => {
    if (jugadas.length === 0) return
    if (!puntoVentaId) return setError('ERROR DE CONFIGURACIÓN: SELECCIONE PUNTO DE VENTA')
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
        clienteNombres: clienteNombres.trim() || null,
        clienteCedula: clienteCedula.trim() || null,
        clienteWhatsapp: clienteWhatsapp.trim() || null,
      }

      const response = await ticketAPI.vender(payload)
      if (response.status === 201) {
        const ticketCreado = response.data?.data?.ticket

        if (ticketCreado) {
          await handlePrintAutomatico(ticketCreado)
        }

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
        setClienteNombres('')
        setClienteCedula('')
        setClienteWhatsapp('')
        setPuntoVentaId('')
        setSorteoId('')
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
                Emisión de Ticket (Admin)
              </h2>
              <p className="text-luck-gold text-[9px] font-bold uppercase tracking-[0.2em]">
                Punto de Venta Autorizado
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
          {/* PANEL IZQUIERDO */}
          <div className="col-span-12 lg:col-span-5 p-8 border-r border-white/5 flex flex-col gap-5 overflow-y-auto custom-scroll-minimal">
            {/* Terminal Status */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex justify-between items-center shrink-0">
              <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                Estado de Terminal:
              </span>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${caja?.id ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}
                />
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${caja?.id ? 'text-emerald-500' : 'text-red-500'}`}
                >
                  {caja?.id ? 'Caja Abierta / Activa' : 'Caja Cerrada / Inactiva'}
                </span>
              </div>
            </div>

            {/* Ubicación / Punto de Venta */}
            <div className="space-y-2 shrink-0">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
                Punto de Venta
              </label>
              <select
                disabled={jugadas.length > 0}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:border-luck-gold/60 outline-none transition-all cursor-pointer uppercase font-bold tracking-wide"
                value={puntoVentaId}
                onChange={(e) => setPuntoVentaId(e.target.value)}
              >
                <option value="" disabled className="bg-[#111615] text-zinc-400 font-bold">
                  SELECCIONAR UBICACIÓN...
                </option>
                {puntosVenta.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#111615] text-white font-bold">
                    {p.nombre.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorteo */}
            <div className="space-y-2 shrink-0">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
                Sorteo Disponible
              </label>
              <select
                disabled={jugadas.length > 0}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:border-luck-gold/60 outline-none transition-all cursor-pointer font-bold tracking-wide"
                value={sorteoId}
                onChange={(e) => setSorteoId(e.target.value)}
              >
                <option value="" disabled className="bg-[#111615] text-zinc-400 font-bold">
                  SELECCIONAR SORTEO...
                </option>
                {sorteos.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#111615] text-white font-bold">
                    {s.Catalogo?.nombre.toUpperCase()} ({s.Cifra?.cantidad} CIFRAS)
                  </option>
                ))}
              </select>
            </div>

            {/* Datos Cliente */}
            <div className="p-5 bg-zinc-950/40 border border-white/5 rounded-[1.8rem] space-y-4 shrink-0">
              <div className="flex items-center gap-2 text-zinc-500 ml-1">
                <LuUserPlus size={14} className="text-luck-gold" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Identificación del Cliente (Opcional)
                </span>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="NOMBRES COMPLETOS DEL CLIENTE"
                  className="w-full bg-zinc-900/40 border border-white/5 rounded-xl p-3.5 text-xs text-white placeholder:text-zinc-700 outline-none focus:border-luck-gold/30 transition-all uppercase font-medium"
                  value={clienteNombres}
                  onChange={(e) => setClienteNombres(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="CÉDULA / RUC"
                    className="w-full bg-zinc-900/40 border border-white/5 rounded-xl p-3.5 text-xs text-white placeholder:text-zinc-700 outline-none focus:border-luck-gold/30 transition-all font-medium"
                    value={clienteCedula}
                    onChange={(e) => setClienteCedula(e.target.value.replace(/\D/g, ''))}
                  />
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="Nº WHATSAPP"
                    className="w-full bg-zinc-900/40 border border-white/5 rounded-xl p-3.5 text-xs text-white placeholder:text-zinc-700 outline-none focus:border-luck-gold/30 transition-all font-medium"
                    value={clienteWhatsapp}
                    onChange={(e) => setClienteWhatsapp(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>
            </div>

            {/* Métodos de Pago */}
            <div className="space-y-2 shrink-0">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
                Método de Pago
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setMetodoPago('Efectivo')}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border transition-all text-[10px] font-black uppercase ${
                    metodoPago === 'Efectivo'
                      ? 'bg-luck-gold text-black border-luck-gold shadow-lg shadow-luck-gold/10'
                      : 'bg-zinc-900/50 text-zinc-500 border-white/5'
                  }`}
                >
                  <LuBanknote size={15} /> Efectivo
                </button>
                <button
                  onClick={() => setMetodoPago('Transferencia')}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border transition-all text-[10px] font-black uppercase ${
                    metodoPago === 'Transferencia'
                      ? 'bg-luck-gold text-black border-luck-gold shadow-lg shadow-luck-gold/10'
                      : 'bg-zinc-900/50 text-zinc-500 border-white/5'
                  }`}
                >
                  <LuCreditCard size={15} /> Transferencia
                </button>
              </div>
            </div>

            {/* Referencia Digital */}
            <AnimatePresence>
              {metodoPago === 'Transferencia' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden shrink-0"
                >
                  <input
                    type="text"
                    placeholder="Nº COMPROBANTE DE TRANSFERENCIA"
                    className="w-full bg-luck-gold/5 border border-luck-gold/20 rounded-xl p-3.5 text-xs text-white placeholder:text-luck-gold/30 outline-none focus:border-luck-gold transition-all"
                    value={referenciaPago}
                    onChange={(e) => setReferenciaPago(e.target.value.toUpperCase())}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Entrada de Números */}
            <div className="p-6 bg-zinc-950/40 border border-white/5 rounded-[2rem] space-y-4 shrink-0 mt-auto">
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
                    name={`jugada_luck_${Math.random()}`}
                    id="campo-no-autofill"
                    maxLength={numCifras}
                    placeholder="00"
                    autoComplete="off"
                    className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-3.5 text-center text-3xl font-black text-white focus:border-luck-gold outline-none transition-all"
                    value={tempNumero}
                    onChange={(e) => {
                      setError('')
                      setTempNumero(e.target.value.replace(/\D/g, ''))
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block text-center">
                    Inversión $
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-3.5 text-center text-3xl font-black text-white focus:border-luck-gold outline-none transition-all"
                    value={tempMonto}
                    onChange={(e) => {
                      setError('')
                      setTempMonto(e.target.value)
                    }}
                  />
                </div>
              </div>

              <button
                onClick={agregarJugada}
                disabled={loading || !caja?.id}
                className="w-full bg-luck-gold hover:bg-yellow-500 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest transition-all shadow-lg disabled:opacity-20"
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

          {/* PANEL DERECHO INTERACTIVO */}
          <div className="col-span-12 lg:col-span-7 p-8 bg-black/40 flex flex-col overflow-hidden relative">
            <h3 className="text-zinc-600 font-black text-[10px] uppercase tracking-[0.3em] mb-6">
              Contenido del Ticket
            </h3>

            <div className="flex-1 overflow-y-auto pr-2 custom-scroll-minimal space-y-2 flex flex-col justify-start relative">
              <AnimatePresence mode="wait">
                {error && jugadas.length === 0 ? (
                  /* CASO 1: ERROR CON LISTA VACÍA -> CORREGIDO A OSCURO REFINADO */
                  <motion.div
                    key="error-screen"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center p-8 border border-red-500/20 bg-red-500/[0.02] rounded-[2rem] max-w-md mx-auto my-auto shadow-2xl shadow-red-500/[0.02]"
                  >
                    <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 border border-red-500/20 shadow-inner">
                      <LuCircleAlert size={28} />
                    </div>
                    <p className="text-[11px] font-black tracking-widest text-red-500 text-center uppercase leading-relaxed">
                      {error}
                    </p>
                    <span className="text-[8px] font-bold text-zinc-600 tracking-tighter uppercase mt-4 animate-pulse">
                      Cerrando alerta automáticamente...
                    </span>
                  </motion.div>
                ) : jugadas.length > 0 ? (
                  /* LISTA REAL DE JUGADAS */
                  <div className="space-y-2 w-full">
                    {jugadas.map((j) => (
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
                    ))}
                  </div>
                ) : (
                  /* VISTA POR DEFECTO CON LISTA VACÍA */
                  <motion.div
                    key="empty-screen"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center opacity-10 my-auto"
                  >
                    <LuTicket size={60} strokeWidth={1} />
                    <p className="font-black uppercase tracking-[0.4em] text-[9px] mt-4">
                      Esperando selección...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CASO 2: ERROR CON ELEMENTOS -> TOAST FLOTANTE OSCURO DE ALTA FIDELIDAD */}
              <AnimatePresence>
                {error && jugadas.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute bottom-4 left-4 right-4 bg-black/80 border border-red-500/40 backdrop-blur-md p-4 rounded-2xl flex items-center gap-4 shadow-2xl z-50 shadow-red-500/10"
                  >
                    <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                      <LuCircleAlert size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-black uppercase text-red-500 tracking-wider">
                        Atención Operador
                      </p>
                      <p className="text-white font-bold text-[11px] uppercase tracking-tight">
                        {error}
                      </p>
                    </div>
                    <button
                      onClick={() => setError('')}
                      className="text-zinc-500 hover:text-white text-[10px] font-black uppercase px-2 py-1 bg-white/5 rounded-md transition-all"
                    >
                      OK
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FOOTER */}
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

export default TicketModal
