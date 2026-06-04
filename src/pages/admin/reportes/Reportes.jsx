import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  LuCalendar,
  LuDollarSign,
  LuMapPin,
  LuRefreshCw,
  LuTicket,
  LuTrendingUp,
  LuTrophy,
} from 'react-icons/lu'
import Swal from 'sweetalert2'

import { puntosVentaAPI, statsAPI } from '@/api/index.api'
import Title from '@/components/Titlte'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
}

const Reportes = () => {
  // ESTADOS DE FILTROS: Ahora fechas personalizadas
  const [fechaInicio, setFechaInicio] = useState(new Date().toLocaleDateString('en-CA'))
  console.log(new Date().toLocaleDateString('en-CA'))
  const [fechaFin, setFechaFin] = useState(new Date().toLocaleDateString('en-CA'))
  const [puntoVentaFilter, setPuntoVentaFilter] = useState('Todos')

  // ESTADOS DE DATOS REALES
  const [puntosVenta, setPuntosVenta] = useState([])
  const [sucursalesData, setSucursalesData] = useState([])
  const [loading, setLoading] = useState(true)

  // KPIs REALES GLOBALES
  const [kpis, setKpis] = useState({
    ventasTotales: 0.0,
    premiosPorPagar: 0.0,
    utilidadNeta: 0.0,
  })

  // Helper para buscar el nombre real de la sucursal
  const obtenerNombreSucursal = (id) => {
    const encontrar = puntosVenta.find((p) => p.id === id)
    return encontrar ? encontrar.nombre : 'Sucursal Desconocida'
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [respPuntos, respStats] = await Promise.all([
        puntosVentaAPI.listarTodos(),
        statsAPI.obtenerReporteFinanciero(fechaInicio, fechaFin, puntoVentaFilter),
      ])

      const listaPV = respPuntos.data?.puntosVentas || []
      setPuntosVenta(listaPV)

      if (respStats.data?.stats) {
        setKpis({
          ventasTotales: respStats.data.stats.ventasTotales || 0,
          premiosPorPagar: respStats.data.stats.premiosPorPagar || 0,
          utilidadNeta: respStats.data.stats.utilidadNeta || 0,
        })
      }

      setSucursalesData(respStats.data?.sucursales || [])
    } catch (error) {
      console.error('Error al cargar reportes operativos:', error)
      Swal.fire({
        title: 'Error',
        text: 'No se pudo estructurar el desglose financiero del panel',
        icon: 'error',
        background: '#111615',
        color: '#fff',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [fechaInicio, fechaFin, puntoVentaFilter])

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-10">
        <Title
          titulo="Módulo de Reportes"
          descripcion="Análisis financiero y control de riesgo operativo por sucursal"
        />

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#EAB308' }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchData}
          className="bg-luck-gold text-black font-black py-3.5 px-6 rounded-2xl flex items-center gap-2 uppercase text-sm shadow-lg shadow-luck-gold/10 transition-colors"
        >
          <LuRefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Actualizando...' : 'Actualizar'}
        </motion.button>
      </div>

      {/* BARRA DE FILTROS: RANGOS DE FECHA Y PUNTO VENTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-8 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* INPUT FECHA INICIO */}
        <div className="relative w-full">
          <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 ml-1 tracking-widest">
            Fecha Inicio
          </label>
          <div className="relative">
            <LuCalendar
              className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold z-10 pointer-events-none"
              size={18}
            />
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full bg-[#1a1f1e] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-sm uppercase font-bold custom-date-input"
            />
          </div>
        </div>

        {/* INPUT FECHA FIN */}
        <div className="relative w-full">
          <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 ml-1 tracking-widest">
            Fecha Fin
          </label>
          <div className="relative">
            <LuCalendar
              className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold z-10 pointer-events-none"
              size={18}
            />
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full bg-[#1a1f1e] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-sm uppercase font-bold custom-date-input"
            />
          </div>
        </div>

        {/* SELECT PUNTO DE VENTA */}
        <div className="relative w-full">
          <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 ml-1 tracking-widest">
            Punto de Venta
          </label>
          <div className="relative">
            <LuMapPin
              className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold z-10"
              size={18}
            />
            <select
              value={puntoVentaFilter}
              onChange={(e) => setPuntoVentaFilter(e.target.value)}
              className="w-full bg-[#1a1f1e] border border-white/10 rounded-2xl py-3.5 pl-12 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-sm appearance-none cursor-pointer uppercase font-bold"
            >
              <option value="Todos">Todos los puntos</option>
              {puntosVenta.map((punto) => (
                <option key={punto.id} value={punto.id}>
                  {punto.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* GRID DE KPIS FINANCIEROS */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      >
        <motion.div
          variants={cardVariants}
          className="bg-[#111615] border border-white/5 rounded-3xl p-6 flex flex-col shadow-xl"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black text-zinc-500 uppercase">Ventas Totales</span>
            <LuDollarSign size={20} className="text-luck-gold" />
          </div>
          <h3 className="text-2xl font-black text-white italic">
            ${kpis.ventasTotales.toFixed(2)}
          </h3>
        </motion.div>

        <motion.div
          variants={cardVariants}
          className="bg-[#111615] border border-white/5 rounded-3xl p-6 flex flex-col shadow-xl"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black text-zinc-500 uppercase">
              Carga Total de Premios
            </span>
            <LuTrendingUp size={20} className="text-red-500" />
          </div>
          <h3 className="text-2xl font-black text-white italic">
            ${kpis.premiosPorPagar.toFixed(2)}
          </h3>
        </motion.div>

        <motion.div
          variants={cardVariants}
          className="bg-[#111615] border border-white/5 rounded-3xl p-6 flex flex-col shadow-xl"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black text-zinc-500 uppercase">Utilidad Liquida</span>
            <LuDollarSign size={20} className="text-green-500" />
          </div>
          <h3
            className={`text-2xl font-black italic ${kpis.utilidadNeta >= 0 ? 'text-green-400' : 'text-red-500'}`}
          >
            ${kpis.utilidadNeta.toFixed(2)}
          </h3>
        </motion.div>
      </motion.div>

      {/* TABLA DE DESGLOSE */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111615] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden"
      >
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em]">
                <th className="py-6 px-4">Sucursal</th>
                <th className="py-6 px-4 text-center">Tickets</th>
                <th className="py-6 px-4">Venta</th>
                <th className="py-6 px-4 text-center">Ganadores</th>
                <th className="py-6 px-4">Premios</th>
                <th className="py-6 px-4">Otros Flujos</th>
                <th className="py-6 px-4 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {loading ? (
                [1, 2, 3].map((n) => <tr key={n} className="animate-pulse h-16 bg-white/5" />)
              ) : sucursalesData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-zinc-600 uppercase text-xs tracking-widest"
                  >
                    No hay registros
                  </td>
                </tr>
              ) : (
                sucursalesData.map((item) => (
                  <tr
                    key={item.sucursalId}
                    className="border-t border-white/[0.03] hover:bg-white/[0.02] transition-colors tabular-nums"
                  >
                    {/* Nombre Sucursal - Tamaño normal y legible */}
                    <td className="py-6 px-4 font-bold text-white text-sm">
                      {obtenerNombreSucursal(item.sucursalId).toUpperCase()}
                    </td>

                    {/* Tickets */}
                    <td className="py-6 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg text-sm text-zinc-300 border border-white/5">
                        <LuTicket size={12} className="text-luck-gold" />
                        <span className="font-bold">{item.ticketsVendidos}</span>
                      </div>
                    </td>

                    {/* Venta */}
                    <td className="py-6 px-4 font-semibold text-zinc-200 text-sm">
                      ${item.montoVendido.toFixed(2)}
                    </td>

                    {/* Ganadores */}
                    <td className="py-6 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 text-sm text-zinc-300">
                        <LuTrophy size={12} className="text-luck-gold" />
                        <span className="font-bold">{item.ticketsGanadores}</span>
                      </div>
                    </td>

                    {/* Premios */}
                    <td className="py-6 px-4 font-semibold text-zinc-300 text-sm">
                      ${item.montoPremios.toFixed(2)}
                    </td>

                    {/* Otros Flujos - Ajustados a tamaño pequeño para no abrumar */}
                    <td className="py-6 px-4 text-[11px] leading-4">
                      <span className="text-emerald-500 font-bold">
                        +$ {item.otrosIngresos.toFixed(2)}
                      </span>
                      <br />
                      <span className="text-orange-500 font-bold">
                        -$ {item.otrosEgresos.toFixed(2)}
                      </span>
                    </td>

                    {/* Balance - Color condicional sin exagerar el tamaño */}
                    <td
                      className={`py-6 px-4 text-right font-black text-sm ${
                        item.utilidadNeta < 0 ? 'text-red-500' : 'text-emerald-400'
                      }`}
                    >
                      ${item.utilidadNeta.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Reportes
