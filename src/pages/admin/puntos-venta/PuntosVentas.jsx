import { motion } from 'framer-motion'

import DetallePuntoModal from '@/components/DetallePuntoModal'
import PuntoVentaModal from '@/components/PuntoVentaModal'
import PuntoVentaFilters from '@/components/filters/PuntoVentaFilters'
import PuntoVentaHeader from '@/components/headers/PuntoVentaHeader'
import PuntoVentaTable from '@/components/tables/PuntoVentaTable'
import usePuntoVenta from '@/hooks/usePuntoVenta'

// Variantes de animación consistentes
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const rowVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.99, transition: { duration: 0.15 } },
}

const PuntosVenta = () => {
  const {
    selectedPunto,
    setShowModal,
    setSelectedPunto,
    locationFilter,
    setLocationFilter,
    uniqueLocations,
    statusFilter,
    setStatusFilter,
    currentData,
    currentPage,
    setCurrentPage,
    totalPages,
    loading,
    openDetailView,
    calcularRecaudacion,
    handleEdit,
    handleDeletePunto,
    handleRestorePunto,
    showModal,
    fetchData,
    viewModal,
    setViewModal,
  } = usePuntoVenta()

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      <PuntoVentaHeader setSelectedPunto={setSelectedPunto} setShowModal={setShowModal} />

      <PuntoVentaFilters
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        uniqueLocations={uniqueLocations}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <PuntoVentaTable
        containerVariants={containerVariants}
        rowVariants={rowVariants}
        currentData={currentData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        loading={loading}
        openDetailView={openDetailView}
        calcularRecaudacion={calcularRecaudacion}
        handleEdit={handleEdit}
        handleDeletePunto={handleDeletePunto}
        handleRestorePunto={handleRestorePunto}
      />

      <PuntoVentaModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialData={selectedPunto}
        fetchData={fetchData}
      />
      <DetallePuntoModal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ ...viewModal, open: false })}
        title={viewModal.title}
        data={viewModal.data}
        type={viewModal.type}
      />
    </motion.div>
  )
}

export default PuntosVenta
