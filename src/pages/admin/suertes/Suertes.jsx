import SuerteFilters from '@/components/filters/SuerteFilters'
import SuerteHeader from '@/components/headers/SuerteHeader'
import SuerteModal from '@/components/SuerteModal'
import SuerteTable from '@/components/tables/SuerteTable'
import useSuertes from '@/hooks/useSuertes'
import { motion } from 'framer-motion'

const Suertes = () => {
  const {
    selectedPuntoId,
    setSelectedPuntoId,
    puntosVenta,
    setSelectedSuerte,
    setShowModal,
    showModal,
    setActiveTab,
    cifras,
    activeTab,
    filteredSuertes,
    handleEdit,
    selectedSuerte,
    fetchData,

  } = useSuertes()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full pb-10">
      <SuerteHeader
        selectedPuntoId={selectedPuntoId}
        setSelectedPuntoId={setSelectedPuntoId}
        puntosVenta={puntosVenta}
        setSelectedSuerte={setSelectedSuerte}
        setShowModal={setShowModal}
      />
      {/* Pestañas de Cifras */}
      <SuerteFilters
        setActiveTab={setActiveTab}
        cifras={cifras}
        activeTab={activeTab}
      />

      {/* Tabla con Premios por Punto de Venta */}
      <SuerteTable
        filteredSuertes={filteredSuertes}
        handleEdit={handleEdit}
      />

      <SuerteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialData={selectedSuerte}
        cifras={cifras}
        fetchData={fetchData}
        selectedSuerte={selectedSuerte}
        selectedPuntoId={selectedPuntoId} // Pasamos el punto seleccionado al modal para guardar
      />
    </motion.div>
  )
}

export default Suertes
