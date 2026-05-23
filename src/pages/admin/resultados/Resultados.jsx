import { resultadoAPI } from '@/api/index.api'
import DetalleResultadoModal from '@/components/DetalleResultadoModal'
import FlyerResultadosModal from '@/components/FlyerResultadosModal'
import ResultadoModal from '@/components/ResultadoModal'
import Title from '@/components/Titlte'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  LuChevronLeft,
  LuChevronRight,
  LuClock,
  LuEye,
  LuFileText,
  LuFilter,
  LuImage,
  LuInbox,
  LuPlus,
  LuTrendingDown,
  LuTrendingUp,
  LuTrophy,
} from 'react-icons/lu'

import ReporteGanadoresPDF from '@/utils/pdf/reporteGanadores'
import { pdf } from '@react-pdf/renderer'

// Variantes para animaciones de la tabla
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const rowVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

const Resultados = () => {
  const [showModal, setShowModal] = useState(false)
  const [showDetalle, setShowDetalle] = useState(false)
  const [showFlyerModal, setShowFlyerModal] = useState(false)
  const [selectedResultado, setSelectedResultado] = useState(null)
  const [groupedFlyerData, setGroupedFlyerData] = useState(null)

  // NUEVOS ESTADOS PARA FILTROS SELECTORES
  const [jornadaFilter, setJornadaFilter] = useState('Todos')
  const [utilidadFilter, setUtilidadFilter] = useState('Todos')

  const [resultados, setResultados] = useState([])
  const [loading, setLoading] = useState(true)

  // --- LÓGICA DE PAGINACIÓN ---
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const fetchData = async () => {
    setLoading(true)
    try {
      const resp = await resultadoAPI.listar()
      setResultados(resp.data?.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Filtrado de resultados mediante puros selects de alto contraste
  const filteredResults = useMemo(() => {
    return resultados.filter((r) => {
      const jornadaSorteo = r.Sorteo?.jornada || ''
      const utilidadNeta = parseFloat(r.Sorteo?.utilidadNeta || 0)

      const matchesJornada = jornadaFilter === 'Todos' || jornadaSorteo === jornadaFilter

      let matchesUtilidad = true
      if (utilidadFilter === 'Positiva') matchesUtilidad = utilidadNeta >= 0
      if (utilidadFilter === 'Negativa') matchesUtilidad = utilidadNeta < 0

      return matchesJornada && matchesUtilidad
    })
  }, [resultados, jornadaFilter, utilidadFilter])

  // Paginación computada
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage)
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredResults.slice(start, start + itemsPerPage)
  }, [filteredResults, currentPage])

  // Resetear página automáticamente al cambiar los filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [jornadaFilter, utilidadFilter])

  const handleOpenDetalle = (resultado) => {
    setSelectedResultado(resultado)
    setShowDetalle(true)
  }

  const handleGenerarReporteGanadores = async (resultado) => {
    try {
      console.log('Generando PDF...')
      const doc = <ReporteGanadoresPDF data={resultado} />
      const blob = await pdf(doc).toBlob()

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Reporte_Ganadores_${resultado.Sorteo?.Catalogo?.nombre}_${resultado.Sorteo?.numero}.pdf`
      link.click()

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error al generar el PDF:', error)
    }
  }

  const handlePrepareFlyer = (resultado) => {
    const numSorteo = resultado.Sorteo?.numero
    const jornada = resultado.Sorteo?.jornada
    const nombreCatalogo = resultado.Sorteo?.Catalogo?.nombre

    const registrosRelacionados = resultados.filter(
      (r) =>
        r.Sorteo?.numero === numSorteo &&
        r.Sorteo?.jornada === jornada &&
        r.Sorteo?.Catalogo?.nombre === nombreCatalogo
    )

    const dataUnificada = {
      ...resultado,
      DetallesResultados: registrosRelacionados.flatMap((r) => r.DetallesResultados || []),
      cifrasDisponibles: registrosRelacionados.map((r) => r.Sorteo?.Cifra?.cantidad),
    }

    setGroupedFlyerData(dataUnificada)
    setShowFlyerModal(true)
  }

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      <div className="flex justify-between items-end mb-8">
        <Title
          titulo="Historial de Resultados"
          descripcion="Monitoreo de ventas, premios y utilidad neta por sorteo"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="bg-luck-gold hover:bg-yellow-600 text-black font-black py-3 px-6 rounded-2xl flex items-center gap-2 transition-all uppercase italic text-sm shadow-lg shadow-luck-gold/20"
        >
          <LuPlus size={20} /> Registrar Resultado
        </motion.button>
      </div>

      {/* BARRA DE FILTROS SELECTS DE ALTO CONTRASTE */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-6 shadow-xl flex flex-col sm:flex-row items-center gap-4"
      >
        {/* SELECT 1: JORNADAS CORREGIDAS */}
        <div className="relative w-full sm:w-64">
          <LuClock className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" size={18} />
          <select
            value={jornadaFilter}
            onChange={(e) => setJornadaFilter(e.target.value)}
            className="w-full bg-[#1a1f1e] border border-white/10 rounded-2xl py-3.5 pl-12 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-sm appearance-none cursor-pointer uppercase font-bold"
          >
            <option value="Todos" className="bg-[#1a1f1e] text-white">
              Todas las jornadas
            </option>
            <option value="Matutina" className="bg-[#1a1f1e] text-white">
              Matutina
            </option>
            <option value="Vespertina" className="bg-[#1a1f1e] text-white">
              Vespertina
            </option>
            <option value="Nocturna" className="bg-[#1a1f1e] text-white">
              Nocturna
            </option>
          </select>
        </div>

        {/* SELECT 2: RENDIMIENTO / UTILIDAD NETA */}
        <div className="relative w-full sm:w-64">
          <LuFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" size={18} />
          <select
            value={utilidadFilter}
            onChange={(e) => setUtilidadFilter(e.target.value)}
            className="w-full bg-[#1a1f1e] border border-white/10 rounded-2xl py-3.5 pl-12 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-sm appearance-none cursor-pointer uppercase font-bold"
          >
            <option value="Todos" className="bg-[#1a1f1e] text-white">
              Todas las utilidades
            </option>
            <option value="Positiva" className="bg-[#1a1f1e] text-white">
              Ganancia (Positiva)
            </option>
            <option value="Negativa" className="bg-[#1a1f1e] text-white">
              Pérdida (Negativa)
            </option>
          </select>
        </div>

        <div className="ml-auto px-4 hidden sm:block">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            {filteredResults.length} Registros Filtrados
          </span>
        </div>
      </motion.div>

      {/* TABLA */}
      <motion.div
        variants={containerVariants}
        className="bg-[#111615] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-zinc-400 uppercase text-[10px] font-black tracking-[0.2em]">
                <th className="p-6">Sorteo</th>
                <th className="p-6">Fecha / Hora</th>
                <th className="p-6">Ventas</th>
                <th className="p-6">Premios</th>
                <th className="p-6">Utilidad Neta</th>
                <th className="p-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              <AnimatePresence mode="popLayout" initial={false}>
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-20 text-center animate-pulse text-zinc-500 font-black italic"
                    >
                      CARGANDO...
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((res) => {
                    const sorteo = res.Sorteo
                    const recaudado = parseFloat(sorteo?.montoRecaudado || 0)
                    const premios = parseFloat(sorteo?.montoPorPagar || 0)
                    const utilidad = parseFloat(sorteo?.utilidadNeta || 0)
                    const esPositivo = utilidad >= 0

                    return (
                      <motion.tr
                        key={res.id}
                        variants={rowVariants}
                        layout
                        className="group hover:bg-white/[0.01] transition-colors"
                      >
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-luck-gold/10 flex items-center justify-center text-luck-gold border border-luck-gold/20">
                              <LuTrophy size={20} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-white font-bold text-base uppercase">
                                {sorteo?.Catalogo?.nombre} - {sorteo?.jornada}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-black">
                                № {sorteo?.numero} ({sorteo?.Cifra?.cantidad} cifras)
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 text-zinc-300 font-bold">
                          {sorteo?.fechaSorteo}{' '}
                          <span className="block text-[10px] text-zinc-500">
                            {sorteo?.horaSorteo}
                          </span>
                        </td>
                        <td className="p-6 text-white font-black italic tracking-tighter">
                          ${recaudado.toFixed(2)}
                        </td>
                        <td className="p-6 text-luck-gold font-black italic tracking-tighter">
                          ${premios.toFixed(2)}
                        </td>
                        <td className="p-6">
                          <div
                            className={`flex items-center gap-2 font-black italic ${esPositivo ? 'text-emerald-400' : 'text-red-400'}`}
                          >
                            {esPositivo ? <LuTrendingUp size={18} /> : <LuTrendingDown size={18} />}
                            ${utilidad.toFixed(2)}
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenDetalle(res)}
                              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-400 hover:text-luck-gold transition-all uppercase text-[10px] font-black"
                              title="Detalles"
                            >
                              <LuEye size={16} />
                            </button>
                            <button
                              onClick={() => handlePrepareFlyer(res)}
                              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-white/5 rounded-xl text-emerald-400 hover:border-emerald-400/30 transition-all uppercase text-[10px] font-black"
                              title="Flyer"
                            >
                              <LuImage size={16} />
                            </button>
                            <button
                              onClick={() => handleGenerarReporteGanadores(res)}
                              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-white/5 rounded-xl text-blue-400 hover:text-blue-300 transition-all uppercase text-[10px] font-black"
                              title="Reporte PDF"
                            >
                              <LuFileText size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })
                ) : (
                  /* ESTADO VACÍO */
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan="6" className="p-32 text-center">
                      <div className="flex flex-col items-center justify-center opacity-20">
                        <LuInbox size={60} className="mb-4 text-luck-gold" />
                        <p className="text-xs font-black uppercase tracking-[0.4em] text-white">
                          No se encontraron registros
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-2">
                          Prueba cambiando los selectores de filtro
                        </p>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex items-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-10 disabled:hover:text-zinc-500 transition-all"
              >
                <LuChevronLeft size={20} />
              </button>

              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${
                      currentPage === i + 1
                        ? 'bg-luck-gold text-black'
                        : 'text-zinc-500 hover:bg-white/5'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold disabled:opacity-10 disabled:hover:text-zinc-500 transition-all"
              >
                <LuChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* MODALES */}
      {showModal && (
        <ResultadoModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          fetchData={fetchData}
        />
      )}
      {showDetalle && (
        <DetalleResultadoModal
          isOpen={showDetalle}
          onClose={() => setShowDetalle(false)}
          data={selectedResultado}
        />
      )}
      {showFlyerModal && (
        <FlyerResultadosModal
          isOpen={showFlyerModal}
          onClose={() => setShowFlyerModal(false)}
          data={groupedFlyerData}
        />
      )}
    </motion.div>
  )
}

export default Resultados
