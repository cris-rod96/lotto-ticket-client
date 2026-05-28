import { motion } from 'framer-motion'

import RespaldoFilters from '@/components/filters/RespaldoFilters'
import RespaldoHeader from '@/components/headers/RespaldoHeader'
import RespaldoTable from '@/components/tables/RespaldoTable'
import useRespaldos from '@/hooks/useRespaldos'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const rowVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.99, transition: { duration: 0.15 } },
}

const Respaldos = () => {
  const {
    filterDate,
    setFilterDate,
    filteredRespaldos,
    loading,
    currentData,
    currentPage,
    setCurrentPage,
    totalPages,
    handleCopiarLink,
  } = useRespaldos()

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      <RespaldoHeader />

      <RespaldoFilters
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        filteredRespaldos={filteredRespaldos}
      />

      <RespaldoTable
        containerVariants={containerVariants}
        rowVariants={rowVariants}
        loading={loading}
        currentData={currentData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        handleCopiarLink={handleCopiarLink}
      />
    </motion.div>
  )
}

export default Respaldos
