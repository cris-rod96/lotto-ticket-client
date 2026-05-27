import { catalogoAPI } from '@/api/index.api'
import CatalogoModal from '@/components/CatalogoModal'
import CatalogoTableHeader from '@/components/headers/CatalogoTableHeader'
import CatalogoTableBody from '@/components/tables/CatalogoTableBody'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const rowVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.99, transition: { duration: 0.15 } },
}

const Catalogo = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [catalogos, setCatalogos] = useState([])

  const [countryFilter, setCountryFilter] = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('Todos')

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5 // Ajustado para consistencia

  const fetchData = async () => {
    try {
      const resp = await catalogoAPI.listarTodos()
      setCatalogos(resp.data?.catalogos || [])
    } catch (error) {
      error
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filtered = useMemo(() => {
    return catalogos.filter((c) => {
      const matchesCountry = countryFilter === 'Todos' || c.pais === countryFilter
      let matchesStatus = true
      if (statusFilter === 'Activos') matchesStatus = c.activo === true
      if (statusFilter === 'Inactivos') matchesStatus = c.activo === false
      return matchesCountry && matchesStatus
    })
  }, [catalogos, countryFilter, statusFilter])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filtered.slice(start, start + itemsPerPage)
  }, [filtered, currentPage])

  const handleOpenModal = (item = null) => {
    setSelectedItem(item)
    setShowModal(true)
  }

  const handleCloseModal = (refresh = false) => {
    setShowModal(false)
    setSelectedItem(null)
    if (refresh) fetchData()
  }

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: '¿Desactivar Juego?',
      text: `Vas a restringir el acceso a: ${item.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EAB308',
      // Eliminamos background y color para que tome el estilo por defecto (blanco)
    })

    if (!result.isConfirmed) return

    try {
      await catalogoAPI.eliminar(item.id)
      Swal.fire({
        title: 'Desactivado',
        text: 'El juego ha sido restringido correctamente.',
        icon: 'success',
      })
      fetchData()
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo procesar la solicitud.',
        icon: 'error',
      })
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [countryFilter, statusFilter])

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      <CatalogoTableHeader
        filtered={filtered}
        handleOpenModal={handleOpenModal}
        countryFilter={countryFilter}
        setCountryFilter={setCountryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <CatalogoTableBody
        containerVariants={containerVariants}
        rowVariants={rowVariants}
        currentData={currentData}
        handleOpenModal={handleOpenModal}
        handleDelete={handleDelete}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      <CatalogoModal
        isOpen={showModal}
        onClose={(refresh) => handleCloseModal(refresh)}
        initialData={selectedItem}
        fetchData={fetchData}
      />
    </motion.div>
  )
}

export default Catalogo
