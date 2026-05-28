import { puntosVentaAPI } from '@/api/index.api'
import DetallePuntoModal from '@/components/DetallePuntoModal'
import PuntoVentaModal from '@/components/PuntoVentaModal'
import SuertesDetailModal from '@/components/SuertesDetailModal'
import PuntoVentaFilters from '@/components/filters/PuntoVentaFilters'
import PuntoVentaHeader from '@/components/headers/PuntoVentaHeader'
import PuntoVentaTable from '@/components/tables/PuntoVentaTable'
import usePuntoVenta from '@/hooks/usePuntoVenta'
import { motion } from 'framer-motion'
import { useState } from 'react' // Estados propios locales
import Swal from 'sweetalert2'

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

    // ==========================================================================
    // NUEVAS PROPS DESESTRUCTURADAS DESDE EL HOOK ADAPTADO
    // ==========================================================================
    modalTickets,
    ticketPage,
    ticketTotalPages,
    loadingModalTickets,
    cargarTicketsDelPunto,
  } = usePuntoVenta()

  // ==========================================================================
  // ESTADOS PROPIOS EXCLUSIVOS PARA EL MODAL DE SUERTES
  // ==========================================================================
  const [isSuertesOpen, setIsSuertesOpen] = useState(false)
  const [puntoSeleccionadoSuertes, setPuntoSeleccionadoSuertes] = useState(null)

  const handleOpenSuertes = async (punto) => {
    try {
      // 1. Buscamos los detalles específicos de suertes para este punto
      const resp = await puntosVentaAPI.obtenerDetalles(punto.id)

      // 2. Guardamos el punto con sus datos reales en el estado local
      setPuntoSeleccionadoSuertes(resp.data.detalle)
      setIsSuertesOpen(true)
    } catch (error) {
      const msg = error.response?.data?.message || 'No se pudieron cargar las suertes'
      Swal.fire({
        title: 'Error',
        text: msg,
        icon: 'error',
      })
    }
  }

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
        onVerSuertes={handleOpenSuertes}
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

      {/* MODIFICADO: Inyectamos los estados paginados del hook para que la UI responda */}
      <DetallePuntoModal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ ...viewModal, open: false })}
        title={viewModal.title}
        data={viewModal.data}
        type={viewModal.type}
        // Nuevas propiedades requeridas por el modal histórico
        modalTickets={modalTickets}
        ticketPage={ticketPage}
        ticketTotalPages={ticketTotalPages}
        loadingModalTickets={loadingModalTickets}
        cargarTicketsDelPunto={cargarTicketsDelPunto}
      />

      {/* Tu modal independiente controlado por tus estados locales propios */}
      <SuertesDetailModal
        isOpen={isSuertesOpen}
        onClose={() => {
          setIsSuertesOpen(false)
          setPuntoSeleccionadoSuertes(null)
        }}
        puntoVenta={puntoSeleccionadoSuertes}
      />
    </motion.div>
  )
}

export default PuntosVenta
