import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  LuChevronLeft,
  LuChevronRight,
  LuCircleX,
  LuHistory,
  LuLayoutDashboard,
  LuPlus,
  LuSearch,
  LuStore,
  LuUser,
  LuWallet,
} from 'react-icons/lu'

// Componentes y API
import { cajaAPI, puntosVentaAPI } from '@/api/index.api'
import CajaOperacionesModal from '@/components/CajaOperacionesModal'
import Title from '@/components/Titlte'
import { useCajaStore } from '@/store/useCajaStore'
import { useOutletContext } from 'react-router-dom'

const CajasAdmin = () => {
  const { setIsLoading, setLoadingMsg } = useOutletContext()
  const { setCaja, setCajas, cajas, caja } = useCajaStore()

  const [modalType, setModalType] = useState(null)
  const [puntoSeleccionado, setPuntoSeleccionado] = useState('')
  const [listaPuntos, setListaPuntos] = useState([])

  // Lógica de Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const formatter = new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' })

  // 1. Cargar todos los puntos de venta existentes
  useEffect(() => {
    const cargarPuntos = async () => {
      try {
        const { data } = await puntosVentaAPI.listarTodos()
        setListaPuntos(data.puntosVentas || [])
      } catch (error) {
        console.error('Error cargando puntos:', error)
      }
    }
    cargarPuntos()
  }, [])

  // 2. Cargar la caja del punto que el Admin elija
  useEffect(() => {
    if (!puntoSeleccionado) return

    const sincronizarPunto = async () => {
      setIsLoading(true)
      setLoadingMsg('Consultando estado de sucursal...')
      setCurrentPage(1) // Resetear página al cambiar de punto
      try {
        const [respHistorial, respActual] = await Promise.all([
          cajaAPI.listarPorPuntoVenta(puntoSeleccionado),
          cajaAPI.obtenerCajaAbierta(puntoSeleccionado),
        ])
        setCajas(respHistorial.data.cajas || [])
        setCaja(respActual.data.caja || null)
      } catch (error) {
        setCaja(null)
        setCajas([])
      } finally {
        setIsLoading(false)
      }
    }
    sincronizarPunto()
  }, [puntoSeleccionado, setCaja, setCajas, setIsLoading, setLoadingMsg])

  // 3. Cálculos de Paginación
  const totalPages = Math.ceil(cajas.length / itemsPerPage)
  const currentData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage
    const lastPageIndex = firstPageIndex + itemsPerPage
    return cajas.slice(firstPageIndex, lastPageIndex)
  }, [currentPage, cajas])

  const esCajaAbierta = caja?.estado === 'Abierta'

  return (
    <div className="w-full pb-10">
      {/* CABECERA CORREGIDA Y ALINEADA */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="w-full md:w-auto">
          <Title
            titulo="AUDITORÍA DE CAJAS"
            descripcion="SUPERVISIÓN Y CONTROL DE FLUJOS POR SUCURSAL"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
          {/* SELECTOR DE SUCURSAL */}
          <div className="relative min-w-[280px] w-full md:w-auto">
            <LuStore
              className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold"
              size={18}
            />
            <select
              value={puntoSeleccionado}
              onChange={(e) => setPuntoSeleccionado(e.target.value)}
              className="w-full bg-[#111615] border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.15em] py-4 pl-12 pr-10 rounded-2xl appearance-none focus:border-luck-gold/50 outline-none cursor-pointer transition-all"
            >
              <option value="">Seleccione Punto de Venta </option>
              {listaPuntos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* BOTONES DE OPERACIÓN REMOTA */}
          <AnimatePresence mode="wait">
            {puntoSeleccionado && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex gap-2 w-full md:w-auto"
              >
                {esCajaAbierta ? (
                  <>
                    <button
                      onClick={() => setModalType('inyectar')}
                      className="flex-1 md:flex-none bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase text-[10px] tracking-widest border border-white/5"
                    >
                      <LuPlus className="text-luck-gold" size={16} /> Inyectar
                    </button>
                    <button
                      onClick={() => setModalType('cerrar')}
                      className="flex-1 md:flex-none bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase text-[10px] tracking-widest border border-red-500/20"
                    >
                      <LuCircleX size={16} /> Forzar Cierre
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setModalType('abrir')}
                    className="flex-1 md:flex-none bg-green-500/10 hover:bg-green-500/20 text-green-500 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase text-[10px] tracking-widest border border-green-500/20"
                  >
                    <LuWallet size={16} /> Apertura Remota
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {puntoSeleccionado ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* ESTADO DEL RESPONSABLE */}
            <div className="bg-[#111615] border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-6 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-luck-gold/10 flex items-center justify-center text-luck-gold border border-luck-gold/10">
                <LuUser size={32} />
              </div>
              <div>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">
                  Cajero Asignado
                </span>
                <p className="text-white font-black text-xl uppercase tracking-tight">
                  {caja?.Usuario?.nombresCompletos || 'SIN SESIÓN ACTIVA'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`w-2 h-2 rounded-full ${esCajaAbierta ? 'bg-green-500 animate-pulse' : 'bg-zinc-700'}`}
                  ></span>
                  <span className="text-[10px] text-luck-gold font-bold uppercase tracking-widest italic">
                    {esCajaAbierta ? 'Punto Operativo' : 'Sucursal Cerrada'}
                  </span>
                </div>
              </div>
            </div>

            {/* BALANCE DEL PUNTO */}
            <div className="bg-[#111615] border border-white/5 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <LuWallet size={120} className="text-luck-gold" />
              </div>
              <span className="text-[10px] font-black text-luck-gold uppercase tracking-widest block mb-2">
                Efectivo en Caja
              </span>
              <p className="text-4xl font-mono font-black text-white tracking-tighter">
                {formatter.format(caja?.saldoActual || 0)}
              </p>
              <div className="flex gap-6 mt-4 pt-4 border-t border-white/5 text-[9px] font-black uppercase italic text-zinc-500">
                <span>Apertura: {formatter.format(caja?.montoApertura || 0)}</span>
                <span className="text-green-600">
                  Inyecciones: {formatter.format(caja?.totalInyecciones || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* HISTORIAL / AUDITORÍA */}
          <div className="bg-[#111615] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
              <div>
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                  <LuHistory size={16} className="text-luck-gold" /> Auditoría de Sesiones
                </h3>
              </div>

              {/* PAGINADOR */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="p-2 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-20 transition-all"
                  >
                    <LuChevronLeft size={18} />
                  </button>
                  <span className="text-[10px] font-black text-white px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="p-2 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-20 transition-all"
                  >
                    <LuChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-zinc-500 uppercase text-[9px] font-black tracking-[0.2em] bg-zinc-900/50">
                    <th className="p-6 pl-10">Fecha de Turno</th>
                    <th className="p-6">Base Inicial</th>
                    <th className="p-6">Cierre Final</th>
                    <th className="p-6">Diferencia</th>
                    <th className="p-6">Estado</th>
                    <th className="p-6 text-right pr-10">Ver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {currentData.map((c) => (
                    <tr key={c.id} className="group hover:bg-white/[0.02]">
                      <td className="p-6 pl-10">
                        <span className="text-white font-bold text-sm block">
                          {new Date(c.createdAt).toLocaleDateString('es-EC', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="text-[8px] text-zinc-600 font-black">
                          REF: {c.id.slice(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="p-6 text-zinc-400 font-mono font-bold">
                        {formatter.format(c.montoApertura)}
                      </td>
                      <td className="p-6 text-zinc-400 font-mono font-bold">
                        {c.montoCierre ? formatter.format(c.montoCierre) : '---'}
                      </td>
                      <td
                        className={`p-6 font-mono font-bold text-sm ${c.diferencia < 0 ? 'text-red-500' : c.diferencia > 0 ? 'text-green-500' : 'text-zinc-500'}`}
                      >
                        {c.diferencia !== null && c.diferencia !== undefined
                          ? formatter.format(c.diferencia)
                          : '---'}
                      </td>
                      <td className="p-6">
                        <span
                          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${c.estado === 'Abierta' ? 'border-green-500/20 text-green-500 bg-green-500/5' : 'border-white/5 text-zinc-500'}`}
                        >
                          {c.estado}
                        </span>
                      </td>
                      <td className="p-6 text-right pr-10">
                        <button className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold transition-all">
                          <LuSearch size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      ) : (
        /* VISTA VACÍA INICIAL */
        <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-white/5 rounded-[3rem] opacity-30">
          <LuLayoutDashboard size={60} className="mb-4 text-luck-gold" />
          <p className="text-xs font-black uppercase tracking-[0.4em]">
            Seleccione un punto de venta para auditar
          </p>
        </div>
      )}

      {modalType && (
        <CajaOperacionesModal
          type={modalType}
          onClose={() => setModalType(null)}
          puntoVentaId={puntoSeleccionado}
          cajaActiva={caja}
        />
      )}
    </div>
  )
}

export default CajasAdmin
