import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

// Componentes propios
import CajaOperacionesModal from '@/components/CajaOperacionesModal'

// Hooks y API
import { cajaAPI } from '@/api/index.api'
import CajasVendedorHeader from '@/components/headers/CajasVendedorHeader'
import CajasVendedorStats from '@/components/stats/CajasVendedorStats'
import CajasVendedorTable from '@/components/tables/CajasVendedorTable'
import { useAuthStore } from '@/store/useAuthStore'
import { useCajaStore } from '@/store/useCajaStore'
import { useOutletContext } from 'react-router-dom'

const CajasVendedor = () => {
  // 1. ESTADOS Y CONTEXTOS
  const { user } = useAuthStore()
  const { setIsLoading, setLoadingMsg } = useOutletContext()
  const { isCajaAbierta, cajas, setCaja, setCajas, caja } = useCajaStore()

  const [modalType, setModalType] = useState(null)

  // Lógica de Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const formatter = new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
  })

  // 2. CARGA DE DATOS ÚNICA PARA EL VENDEDOR
  useEffect(() => {
    const cargarDatosFinancieros = async () => {
      if (!user?.PuntoVentaId) return

      setIsLoading(true)
      setLoadingMsg('Sincronizando terminal de cobro...')

      try {
        const [respHistorial, respActual] = await Promise.all([
          cajaAPI.listarPorPuntoVenta(user.PuntoVentaId),
          cajaAPI.obtenerCajaAbierta(user.PuntoVentaId),
        ])

        setCajas(respHistorial.data.cajas || [])
        setCaja(respActual.data.caja || null)
      } catch (error) {
        console.error('Error cargando datos de caja:', error)
      } finally {
        setIsLoading(false)
      }
    }

    cargarDatosFinancieros()
  }, [user?.PuntoVentaId, setCaja, setCajas, setIsLoading, setLoadingMsg])

  // 3. CÁLCULOS DE PAGINACIÓN
  const totalPages = Math.ceil(cajas.length / itemsPerPage)
  const currentData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage
    const lastPageIndex = firstPageIndex + itemsPerPage
    return cajas.slice(firstPageIndex, lastPageIndex)
  }, [currentPage, cajas])

  return (
    <div className="w-full pb-10">
      {/* CABECERA */}
      <CajasVendedorHeader isCajaAbierta={isCajaAbierta} onOpenModal={setModalType} />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* TARJETAS DE ESTADO */}
        <CajasVendedorStats
          user={user}
          isCajaAbierta={isCajaAbierta}
          caja={caja}
          formatter={formatter}
        />

        {/* TABLA DE HISTORIAL */}
        <CajasVendedorTable
          data={currentData}
          totalRecords={cajas.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          formatter={formatter}
        />
      </motion.div>

      {modalType && (
        <CajaOperacionesModal
          type={modalType}
          onClose={() => setModalType(null)}
          puntoVentaId={user?.PuntoVentaId}
          cajaActiva={caja}
        />
      )}
    </div>
  )
}

export default CajasVendedor
