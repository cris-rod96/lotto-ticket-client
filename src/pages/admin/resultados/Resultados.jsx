import DetalleResultadoModal from '@/components/DetalleResultadoModal'
import FlyerResultadosModal from '@/components/FlyerResultadosModal'
import ResultadoModal from '@/components/ResultadoModal'
import { motion } from 'framer-motion'

import ActualizarResultadoModal from '@/components/ActualizarResultadoModal'
import ResultadoFilters from '@/components/filters/ResultadoFilters'
import ResultadoHeader from '@/components/headers/ResultadoHeader'
import ResultadoTable from '@/components/tables/ResultadoTable'
import useResultados from '@/hooks/useResultados'
import ReporteGanadoresPDF from '@/utils/pdf/reporteGanadores'
import { pdf } from '@react-pdf/renderer'

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
  const {
    resultados,
    setGroupedFlyerData,
    setShowFlyerModal,
    setJornadaFilter,
    jornadaFilter,
    utilidadFilter,
    setUtilidadFilter,
    loading,
    currentData,
    handleOpenDetalle,
    totalPages,
    currentPage,
    setCurrentPage,
    showModal,
    setShowModal,
    fetchData,
    showDetalle,
    setShowDetalle,
    selectedResultado,
    showFlyerModal,
    groupedFlyerData,
    showEditModal,
    setShowEditModal,
    selectedEditResultado,
    handleActualizarResultado,
  } = useResultados()

  const handleGenerarReporteGanadores = async (resultado) => {
    try {
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

    // Filtra sobre los resultados de la página actual
    const registrosRelacionados = resultados.filter(
      (r) =>
        r.Sorteo?.numero === numSorteo &&
        r.Sorteo?.jornada === jornada &&
        r.Sorteo?.Catalogo?.nombre === nombreCatalogo
    )

    const dataUnificada = {
      ...resultado,
      // Si por alguna razón el par está en otra página, garantizamos que al menos use los detalles del registro actual
      DetallesResultados:
        registrosRelacionados.length > 0
          ? registrosRelacionados.flatMap((r) => r.DetallesResultados || [])
          : resultado.DetallesResultados || [],
      cifrasDisponibles:
        registrosRelacionados.length > 0
          ? registrosRelacionados.map((r) => r.Sorteo?.Cifra?.cantidad)
          : [resultado.Sorteo?.Cifra?.cantidad],
    }

    setGroupedFlyerData(dataUnificada)
    setShowFlyerModal(true)
  }

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      <ResultadoHeader setShowModal={setShowModal} />

      <ResultadoFilters
        filteredResults={currentData}
        setJornadaFilter={setJornadaFilter}
        jornadaFilter={jornadaFilter}
        utilidadFilter={utilidadFilter}
        setUtilidadFilter={setUtilidadFilter}
      />

      <ResultadoTable
        containerVariants={containerVariants}
        rowVariants={rowVariants}
        loading={loading}
        currentData={currentData}
        handleOpenDetalle={handleOpenDetalle}
        handlePrepareFlyer={handlePrepareFlyer}
        handleGenerarReporteGanadores={handleGenerarReporteGanadores}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleActualizarResultado={handleActualizarResultado}
      />
      {showEditModal && (
        <ActualizarResultadoModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          fetchData={fetchData}
          sorteoData={selectedEditResultado}
        />
      )}

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
