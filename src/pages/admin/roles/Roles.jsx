import { motion } from 'framer-motion'

import RolModal from '@/components/RolModal'
import UsuariosPorRolModal from '@/components/UsuariosPorRolModal'
import RolFilters from '@/components/filters/RolFilters'
import RolHeader from '@/components/headers/RolHeader'
import RolTable from '@/components/tables/RolTable'
import useRoles from '@/hooks/useRoles'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const rowVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.99, transition: { duration: 0.15 } },
}

const Roles = () => {
  const {
    setSelectedRol,
    setShowModal,
    searchTerm,
    setSearchTerm,
    filteredRoles,
    loading,
    currentData,
    currentPage,
    setCurrentPage,
    totalPages,
    handleDeleteRol,
    setSelectedRolUsers,
    setShowUserModal,
    showModal,
    selectedRol,
    fetchData,
    showUserModal,
    selectedRolUsers,
  } = useRoles()

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      <RolHeader setSelectedRol={setSelectedRol} setShowModal={setShowModal} />

      <RolFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredRoles={filteredRoles}
      />

      <RolTable
        containerVariants={containerVariants}
        rowVariants={rowVariants}
        loading={loading}
        currentData={currentData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        handleDeleteRol={handleDeleteRol}
        setSelectedRolUsers={setSelectedRolUsers}
        setSelectedRol={setSelectedRol}
        setShowModal={setShowModal}
        setShowUserModal={setShowUserModal}
      />

      <RolModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialData={selectedRol}
        fetchData={fetchData}
      />

      <UsuariosPorRolModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        rolNombre={selectedRolUsers.nombre}
        usuarios={selectedRolUsers.usuarios}
      />
    </motion.div>
  )
}

export default Roles
