import ResultadoFilters from '@/components/filters/ResultadoFilters'
import FlyerResultadosModal from '@/components/FlyerResultadosModal'
import ResultadoHeaderVendedor from '@/components/headers/ResultadoHeaderVendedor'
import ResultadoVendedorTable from '@/components/tables/ResultadoVendedorTable'
import useResultadosPorPunto from '@/hooks/useResultadosPorPunto'
import { useAuthStore } from '@/store/useAuthStore'
import { motion } from 'framer-motion'

const ResultadosVendedor = () => {
  const { user } = useAuthStore()

  const {
    setGroupedFlyerData,
    setShowFlyerModal,
    setJornadaFilter,
    jornadaFilter,
    utilidadFilter,
    setUtilidadFilter,
    loading,
    currentData,
    totalPages,
    currentPage,
    setCurrentPage,
    showFlyerModal,
    groupedFlyerData,
  } = useResultadosPorPunto(user?.PuntoVentaId)

  const handlePrepareFlyer = (resultado) => {
    const numSorteo = resultado.Sorteo?.numero
    const jornada = resultado.Sorteo?.jornada
    const nombreCatalogo = resultado.Sorteo?.Catalogo?.nombre

    // Filtra sobre los resultados de la página actual
    const registrosRelacionados = currentData.filter(
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full pb-10">
      <ResultadoHeaderVendedor />

      <ResultadoFilters
        filteredResults={currentData}
        setJornadaFilter={setJornadaFilter}
        jornadaFilter={jornadaFilter}
        utilidadFilter={utilidadFilter}
        setUtilidadFilter={setUtilidadFilter}
      />

      <ResultadoVendedorTable
        loading={loading}
        currentData={currentData}
        handlePrepareFlyer={handlePrepareFlyer}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

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
