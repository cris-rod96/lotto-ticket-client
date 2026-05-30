import DetalleResultadoModal from '@/components/DetalleResultadoModal'
import ResultadoFilters from '@/components/filters/ResultadoFilters'
import FlyerResultadosModal from '@/components/FlyerResultadosModal'
import ResultadoHeaderVendedor from '@/components/headers/ResultadoHeaderVendedor' // Versión sin botón
import ResultadoTable from '@/components/tables/ResultadoTable'
import useResultados from '@/hooks/useResultados'
import ReporteGanadoresPDF from '@/utils/pdf/reporteGanadores'
import { pdf } from '@react-pdf/renderer'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}
const rowVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

const ResultadosVendedor = () => {
  // Nota: El hook ahora hace todo el filtrado en el servidor
  const {
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
    showDetalle,
    setShowDetalle,
    selectedResultado,
    showFlyerModal,
    groupedFlyerData,
  } = useResultados()

  const handleGenerarReporteGanadores = async (resultado) => {
    const doc = <ReporteGanadoresPDF data={resultado} />
    const blob = await pdf(doc).toBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Reporte_${resultado.Sorteo?.Catalogo?.nombre}_${resultado.Sorteo?.numero}.pdf`
    link.click()
  }

  // Lógica optimizada para preparar el flyer
  const handlePrepareFlyer = (resultado) => {
    setGroupedFlyerData(resultado) // Los datos ya vienen filtrados por el servidor
    setShowFlyerModal(true)
  }

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      <ResultadoHeaderVendedor />

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
      />

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

export default ResultadosVendedor
