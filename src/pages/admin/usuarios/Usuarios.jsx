import { motion } from 'framer-motion'

import ActividadUsuarioModal from '@/components/ActividadUsuarioModal'
import UsuarioFilters from '@/components/filters/UsuarioFilters'
import UsuarioHeader from '@/components/headers/UsuarioHeader'
import UsuarioTable from '@/components/tables/UsuarioTable'
import UsuarioModal from '@/components/UsuarioModal'
import useUsuarios from '@/hooks/useUsuarios'

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

const Usuarios = () => {
  const {
    setSelectedUser,
    setShowModal,
    roleFilter,
    setRoleFilter,
    roles,
    setStatusFilter,
    statusFilter,
    puntosVenta,
    puntoFilter,
    setPuntoFilter,
    filteredUsers,
    loading,
    currentData,
    handleDeleteUser,
    handleEdit,
    handleRestoreUser,
    handleViewActivity,
    currentPage,
    setCurrentPage,
    totalPages,
    showModal,
    selectedUser,
    fetchData,
    showActivityModal,
    setShowActivityModal,
  } = useUsuarios()
  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      {/* Encabezado */}
      <UsuarioHeader setSelectedUser={setSelectedUser} setShowModal={setShowModal} />

      {/* BARRA DE FILTROS SELECTS */}
      <UsuarioFilters
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        roles={roles}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        puntosVenta={puntosVenta}
        puntoFilter={puntoFilter}
        setPuntoFilter={setPuntoFilter}
        filteredUsers={filteredUsers}
      />

      {/* Tabla Estilizada */}
      <UsuarioTable
        containerVariants={containerVariants}
        rowVariants={rowVariants}
        loading={loading}
        currentData={currentData}
        handleDeleteUser={handleDeleteUser}
        handleEdit={handleEdit}
        handleRestoreUser={handleRestoreUser}
        handleViewActivity={handleViewActivity}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      {showModal && (
        <UsuarioModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          initialData={selectedUser}
          roles={roles}
          puntosVenta={puntosVenta}
          fetchData={fetchData}
        />
      )}

      {showActivityModal && (
        <ActividadUsuarioModal
          isOpen={showActivityModal}
          onClose={() => setShowActivityModal(false)}
          usuario={selectedUser}
        />
      )}
    </motion.div>
  )
}

export default Usuarios
