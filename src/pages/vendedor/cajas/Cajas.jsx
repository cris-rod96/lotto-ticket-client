import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  LuChevronLeft,
  LuChevronRight,
  LuCircleX,
  LuHistory,
  LuPlus,
  LuSearch,
  LuUser,
  LuWallet,
} from 'react-icons/lu'

// Componentes propios
import CajaOperacionesModal from '@/components/CajaOperacionesModal'
import Title from '@/components/Titlte'

// Hooks y API
import { cajaAPI } from '@/api/index.api'
import { useAuthStore } from '@/store/useAuthStore'
import { useCajaStore } from '@/store/useCajaStore'
import { useOutletContext } from 'react-router-dom'

const CajasVendedor = () => {
  // 1. ESTADOS Y CONTEXTOS
  const { user } = useAuthStore()
  const { setIsLoading, setLoadingMsg } = useOutletContext()
  const { isCajaAbierta, cajas, setCaja, setCajas, caja } = useCajaStore()

  const [modalType, setModalType] = useState(null)

  // Lógica de Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const formatter = new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
  })

  // 2. CARGA DE DATOS ÚNICA PARA EL VENDEDOR
  useEffect(() => {
    const cargarDatosFinancieros = async () => {
      if (!user?.PuntoVentaId) return

      setIsLoading(true)
      setLoadingMsg('Sincronizando terminal de cobro...')

      try {
        const [respHistorial, respActual] = await Promise.all([
          cajaAPI.listarPorPuntoVenta(user.PuntoVentaId),
          cajaAPI.obtenerCajaAbierta(user.PuntoVentaId),
        ])

        setCajas(respHistorial.data.cajas || [])
        setCaja(respActual.data.caja || null)
      } catch (error) {
        console.error('Error cargando datos de caja:', error)
      } finally {
        setIsLoading(false)
      }
    }

    cargarDatosFinancieros()
  }, [user?.PuntoVentaId, setCaja, setCajas, setIsLoading, setLoadingMsg])

  // 3. CÁLCULOS DE PAGINACIÓN
  const totalPages = Math.ceil(cajas.length / itemsPerPage)
  const currentData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage
    const lastPageIndex = firstPageIndex + itemsPerPage
    return cajas.slice(firstPageIndex, lastPageIndex)
  }, [currentPage, cajas])

  return (
    <div className="w-full pb-10">
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="w-full md:w-auto">
          <Title
            titulo="CONTROL DE MI CAJA"
            descripcion="GESTIÓN DE APERTURA, CIERRE Y FLUJO DE EFECTIVO"
          />
        </div>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 w-full md:w-auto justify-end"
          >
            {isCajaAbierta && (
              <button
                onClick={() => setModalType('inyectar')}
                className="flex-1 md:flex-none bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 uppercase text-[10px] tracking-widest border border-white/5"
              >
                <LuPlus className="text-luck-gold" size={18} /> Inyectar
              </button>
            )}

            {isCajaAbierta ? (
              <button
                onClick={() => setModalType('cerrar')}
                className="flex-1 md:flex-none bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 uppercase text-[10px] tracking-widest border border-red-500/20"
              >
                <LuCircleX size={18} /> Cerrar Turno
              </button>
            ) : (
              <button
                onClick={() => setModalType('abrir')}
                className="flex-1 md:flex-none bg-green-500/10 hover:bg-green-500/20 text-green-500 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 uppercase text-[10px] tracking-widest border border-green-500/20"
              >
                <LuWallet size={18} /> Abrir Caja
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* TARJETAS DE ESTADO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-[#111615] border border-white/5 p-8 rounded-[2.5rem] shadow-xl flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-luck-gold/10 flex items-center justify-center text-luck-gold border border-luck-gold/10">
              <LuUser size={32} />
            </div>
            <div>
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">
                Vendedor Asignado
              </span>
              <p className="text-white font-black text-xl uppercase tracking-tight">
                {user?.nombresCompletos || 'Usuario en Turno'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`w-2 h-2 rounded-full ${isCajaAbierta ? 'bg-green-500 animate-pulse' : 'bg-zinc-700'}`}
                ></span>
                <span className="text-[10px] text-luck-gold font-bold uppercase tracking-widest italic">
                  {isCajaAbierta ? 'Punto de Venta Activo' : 'Sesión Finalizada'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#111615] border border-white/5 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <LuWallet size={120} className="text-luck-gold" />
            </div>
            <span className="text-[10px] font-black text-luck-gold uppercase tracking-widest block mb-2">
              Efectivo Disponible en Caja
            </span>
            <p className="text-4xl font-mono font-black text-white tracking-tighter">
              {formatter.format(caja?.saldoActual || 0)}
            </p>
            <div className="flex gap-6 mt-4 pt-4 border-t border-white/5">
              <div className="flex flex-col">
                <span className="text-[8px] text-zinc-600 font-black uppercase">
                  Monto Apertura
                </span>
                <span className="text-xs text-zinc-400 font-mono font-bold">
                  {formatter.format(caja?.montoApertura || 0)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-zinc-600 font-black uppercase">
                  Inyecciones Hoy
                </span>
                <span className="text-xs text-green-500 font-mono font-bold">
                  +{formatter.format(caja?.totalInyecciones || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TABLA DE HISTORIAL */}
        <div className="bg-[#111615] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
            <div>
              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                <LuHistory size={16} className="text-luck-gold" /> Registro de Sesiones
              </h3>
              <p className="text-[9px] text-zinc-500 uppercase font-bold mt-1 tracking-widest">
                Mostrando {currentData.length} de {cajas.length} registros
              </p>
            </div>

            {/* CONTROLES DE PAGINACIÓN */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="p-2 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-20 disabled:hover:text-zinc-500 transition-all"
                >
                  <LuChevronLeft size={20} />
                </button>
                <span className="text-[10px] font-black text-white px-2">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="p-2 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-20 disabled:hover:text-zinc-500 transition-all"
                >
                  <LuChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-zinc-500 uppercase text-[9px] font-black tracking-[0.2em] bg-zinc-900/50">
                  <th className="p-6 pl-10">Fecha / Registro</th>
                  <th className="p-6">Monto Inicial</th>
                  <th className="p-6">Monto Cierre</th>
                  <th className="p-6">Diferencia</th>
                  <th className="p-6">Estado Actual</th>
                  <th className="p-6 text-right pr-10">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {currentData.length > 0 ? (
                  currentData.map((c) => (
                    <tr key={c.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="p-6 pl-10">
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-sm uppercase">
                            {new Date(c.createdAt).toLocaleDateString('es-EC', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">
                            Ref: {c.id.split('-')[0]}
                          </span>
                        </div>
                      </td>
                      <td className="p-6 text-zinc-400 font-mono text-sm font-bold">
                        {formatter.format(c.montoApertura || 0.0)}
                      </td>
                      <td className="p-6 text-zinc-400 font-mono text-sm font-bold">
                        {c.montoCierre ? formatter.format(c.montoCierre) : 'En curso...'}
                      </td>
                      <td
                        className={`p-6 font-mono text-sm font-bold ${c.diferencia < 0 ? 'text-red-500' : c.diferencia > 0 ? 'text-green-500' : 'text-zinc-400'}`}
                      >
                        {c.diferencia !== null && c.diferencia !== undefined
                          ? formatter.format(c.diferencia)
                          : '---'}
                      </td>
                      <td className="p-6">
                        <span
                          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${c.estado === 'Abierta' ? 'bg-green-500/5 text-green-500 border-green-500/10' : 'bg-zinc-800 text-zinc-500 border-white/5'}`}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-20 text-center opacity-20">
                      <div className="flex flex-col items-center gap-3">
                        <LuHistory size={48} />
                        <span className="text-xs font-black uppercase tracking-widest">
                          Sin movimientos previos
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {modalType && (
        <CajaOperacionesModal
          type={modalType}
          onClose={() => setModalType(null)}
          puntoVentaId={user?.PuntoVentaId}
          cajaActiva={caja}
        />
      )}
    </div>
  )
}

export default CajasVendedor
