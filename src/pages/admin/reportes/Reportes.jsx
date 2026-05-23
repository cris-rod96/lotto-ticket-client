import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  LuArrowDownRight,
  LuArrowUpRight,
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
  // ESTADOS DE FILTROS SELECTORES
  const [dateFilter, setDateFilter] = useState('Hoy')
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

  // Helper para buscar el nombre real de la sucursal usando su ID
  const obtenerNombreSucursal = (id) => {
    const encontrar = puntosVenta.find((p) => p.id === id)
    return encontrar ? encontrar.nombre : 'Sucursal Desconocida'
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [respPuntos, respStats] = await Promise.all([
        puntosVentaAPI.listarTodos(),
        statsAPI.obtenerReporteFinanciero(dateFilter, puntoVentaFilter),
      ])

      const listaPV = respPuntos.data?.puntosVentas || []
      setPuntosVenta(listaPV)

      // Seteamos las estadísticas globales de los KPIs superiores
      if (respStats.data?.stats) {
        console.log(respStats.data)
        setKpis({
          ventasTotales: respStats.data.stats.ventasTotales || 0,
          premiosPorPagar: respStats.data.stats.premiosPorPagar || 0,
          utilidadNeta: respStats.data.stats.utilidadNeta || 0,
        })
      }

      // Seteamos la matriz del desglose inferior por sucursal
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
  }, [dateFilter, puntoVentaFilter])

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

      {/* BARRA DE FILTROS SELECTS */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-8 flex flex-col sm:flex-row items-center gap-4"
      >
        {/* SELECT 1: RANGO DE TIEMPO */}
        <div className="relative w-full sm:w-64">
          <LuCalendar
            className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold"
            size={18}
          />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-[#1a1f1e] border border-white/10 rounded-2xl py-3.5 pl-12 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-sm appearance-none cursor-pointer uppercase font-bold"
          >
            <option value="Hoy" className="bg-[#1a1f1e]">
              Hoy
            </option>
            <option value="Ayer" className="bg-[#1a1f1e]">
              Ayer
            </option>
            <option value="Semana" className="bg-[#1a1f1e]">
              Últimos 7 días
            </option>
            <option value="Mes" className="bg-[#1a1f1e]">
              Mes Actual
            </option>
          </select>
        </div>

        {/* SELECT 2: PUNTO DE VENTA */}
        <div className="relative w-full sm:w-64">
          <LuMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" size={18} />
          <select
            value={puntoVentaFilter}
            onChange={(e) => setPuntoVentaFilter(e.target.value)}
            className="w-full bg-[#1a1f1e] border border-white/10 rounded-2xl py-3.5 pl-12 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-sm appearance-none cursor-pointer uppercase font-bold"
          >
            <option value="Todos" className="bg-[#1a1f1e]">
              Todos los puntos
            </option>
            {puntosVenta.map((punto) => (
              <option key={punto.id} value={punto.id} className="bg-[#1a1f1e]">
                {punto.nombre}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* GRID DE KPIS FINANCIEROS */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      >
        {/* CARD 1: VENTAS TOTALES */}
        <motion.div
          variants={cardVariants}
          className="bg-[#111615] border border-white/5 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Ventas Totales Consolidadas
            </span>
            <div className="p-3 rounded-xl bg-luck-gold/10 text-luck-gold border border-luck-gold/10">
              <LuDollarSign size={20} />
            </div>
          </div>
          <h3
            className={`text-2xl font-black text-white italic tracking-tight ${loading ? 'animate-pulse opacity-40' : ''}`}
          >
            ${kpis.ventasTotales.toFixed(2)}
          </h3>
        </motion.div>

        {/* CARD 2: PREMIOS POR SORTEOS */}
        <motion.div
          variants={cardVariants}
          className="bg-[#111615] border border-white/5 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Carga Total de Premios
            </span>
            <div className="p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/10">
              <LuTrendingUp size={20} />
            </div>
          </div>
          <h3
            className={`text-2xl font-black text-white italic tracking-tight ${loading ? 'animate-pulse opacity-40' : ''}`}
          >
            ${kpis.premiosPorPagar.toFixed(2)}
          </h3>
        </motion.div>

        {/* CARD 3: UTILIDAD NETA */}
        <motion.div
          variants={cardVariants}
          className="bg-[#111615] border border-white/5 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Utilidad Liquida Balanceada
            </span>
            <div className="p-3 rounded-xl bg-green-500/10 text-green-500 border border-green-500/10">
              <LuDollarSign size={20} />
            </div>
          </div>
          <h3
            className={`text-2xl font-black italic tracking-tight ${loading ? 'animate-pulse opacity-40' : ''} ${kpis.utilidadNeta >= 0 ? 'text-green-400' : 'text-red-500'}`}
          >
            ${kpis.utilidadNeta.toFixed(2)}
          </h3>
        </motion.div>
      </motion.div>

      {/* SECCIÓN INFERIOR PROFESIONAL: DESGLOSE QUIRÚRGICO POR SUCURSAL */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-[#111615] border border-white/5 rounded-[2.5rem] p-6 lg:p-8 shadow-2xl overflow-hidden"
      >
        <div className="mb-6">
          <h4 className="text-white font-black uppercase text-sm tracking-wider">
            Rendimiento de Caja y Ventas por Sucursal
          </h4>
          <p className="text-zinc-500 text-xs mt-1">
            Auditoría en tiempo real del flujo financiero por cada punto de venta físico activo.
          </p>
        </div>

        {/* CONTENEDOR DE TABLA RESPONSIVA */}
        <div className="w-full overflow-x-auto rounded-2xl border border-white/5 bg-[#161b1a]">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#1d2322] text-zinc-400 font-black text-[11px] uppercase tracking-wider border-b border-white/5">
                <th className="py-4 px-5">Sucursal</th>
                <th className="py-4 px-5 text-center">Tickets Vendidos</th>
                <th className="py-4 px-5">Total Venta</th>
                <th className="py-4 px-5 text-center">Ganadores</th>
                <th className="py-4 px-5">Total Premios</th>
                <th className="py-4 px-5">Otros Flujos (Caja)</th>
                <th className="py-4 px-5 text-right">Balance Neto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300 font-medium">
              {loading ? (
                // SKELETON DE CARGA PARA LA TABLA
                [1, 2, 3].map((n) => (
                  <tr key={n} className="animate-pulse">
                    <td className="py-5 px-5">
                      <div className="h-4 bg-white/10 rounded w-32" />
                    </td>
                    <td className="py-5 px-5">
                      <div className="h-4 bg-white/10 rounded w-12 mx-auto" />
                    </td>
                    <td className="py-5 px-5">
                      <div className="h-4 bg-white/10 rounded w-16" />
                    </td>
                    <td className="py-5 px-5">
                      <div className="h-4 bg-white/10 rounded w-12 mx-auto" />
                    </td>
                    <td className="py-5 px-5">
                      <div className="h-4 bg-white/10 rounded w-16" />
                    </td>
                    <td className="py-5 px-5">
                      <div className="h-4 bg-white/10 rounded w-20" />
                    </td>
                    <td className="py-5 px-5">
                      <div className="h-4 bg-white/10 rounded w-20 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : sucursalesData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-zinc-500 font-bold uppercase text-xs tracking-widest"
                  >
                    No se registran transacciones en este periodo
                  </td>
                </tr>
              ) : (
                sucursalesData.map((item) => (
                  <tr
                    key={item.sucursalId}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Nombre Sucursal */}
                    <td className="py-4 px-5 font-bold text-white tracking-wide">
                      {obtenerNombreSucursal(item.sucursalId)}
                    </td>

                    {/* Tickets Vendidos */}
                    <td className="py-4 px-5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg text-xs font-bold border border-white/5 text-zinc-400">
                        <LuTicket size={13} className="text-luck-gold" />
                        {item.ticketsVendidos}
                      </div>
                    </td>

                    {/* Monto Vendido */}
                    <td className="py-4 px-5 font-black text-white">
                      ${item.montoVendido.toFixed(2)}
                    </td>

                    {/* Cantidad Premiados */}
                    <td className="py-4 px-5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/5 rounded-lg text-xs font-bold border border-red-500/5 text-red-400/80">
                        <LuTrophy size={13} />
                        {item.ticketsGanadores}
                      </div>
                    </td>

                    {/* Monto en Premios */}
                    <td className="py-4 px-5 font-bold text-red-400">
                      ${item.montoPremios.toFixed(2)}
                    </td>

                    {/* Ajustes y Movimientos Operativos de Caja */}
                    <td className="py-4 px-5 text-xs">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-emerald-400 flex items-center font-bold">
                          <LuArrowUpRight size={12} className="mr-0.5" /> +$
                          {item.otrosIngresos.toFixed(2)}
                        </span>
                        <span className="text-orange-400 flex items-center font-bold">
                          <LuArrowDownRight size={12} className="mr-0.5" /> -$
                          {item.otrosEgresos.toFixed(2)}
                        </span>
                      </div>
                    </td>

                    {/* Balance Neto / Utilidad por Punto de Venta */}
                    <td className="py-4 px-5 text-right">
                      <span
                        className={`px-3 py-1.5 rounded-xl font-black text-xs tracking-tight shadow-sm italic ${
                          item.utilidadNeta >= 0
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                            : 'bg-red-500/10 text-red-500 border border-red-500/10'
                        }`}
                      >
                        ${item.utilidadNeta.toFixed(2)}
                      </span>
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
