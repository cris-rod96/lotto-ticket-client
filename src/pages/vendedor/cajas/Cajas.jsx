import { cajaAPI } from '@/api/index.api'
import CajasVendedorHeader from '@/components/headers/CajasVendedorHeader'
import CajasVendedorStats from '@/components/stats/CajasVendedorStats'
import CajasVendedorTable from '@/components/tables/CajasVendedorTable'
import { useAuthStore } from '@/store/useAuthStore'
import { useCajaStore } from '@/store/useCajaStore'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

const Cajas = () => {
  const { user } = useAuthStore()
  const { setIsLoading } = useOutletContext()
  const { cajas, setCaja, setCajas, caja } = useCajaStore()

  const [filtroVista, setFiltroVista] = useState('movimientos')
  const [cajaSeleccionada, setCajaSeleccionada] = useState(null)
  const [soloMisMovimientos, setSoloMisMovimientos] = useState(false) // FILTRO EXTRA
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const formatter = new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' })

  useEffect(() => {
    const cargarDatos = async () => {
      if (!user?.PuntoVentaId) return
      setIsLoading(true)
      try {
        const [respHistorial, respActual] = await Promise.all([
          cajaAPI.listarPorPuntoVenta(user.PuntoVentaId),
          cajaAPI.obtenerCajaAbierta(user.PuntoVentaId),
        ])
        setCajas(respHistorial.data.cajas || [])
        const activa = respActual.data.caja || null
        setCaja(activa)
        if (activa) setCajaSeleccionada(activa)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    cargarDatos()
  }, [user?.PuntoVentaId])

  const dataAMostrar = useMemo(() => {
    if (filtroVista === 'movimientos') {
      let movimientos = cajaSeleccionada?.Movimientos || []
      // Si el toggle está activo, filtramos, si no, mostramos TODO
      if (soloMisMovimientos) {
        return movimientos.filter((m) => m.UsuarioId === user?.id)
      }
      return movimientos
    }
    return cajas
  }, [filtroVista, cajaSeleccionada, cajas, soloMisMovimientos, user?.id])

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return dataAMostrar.slice(start, start + itemsPerPage)
  }, [currentPage, dataAMostrar])

  return (
    <div className="w-full pb-10 px-4">
      <CajasVendedorHeader
        usuario={user}
        filtroVista={filtroVista}
        setFiltroVista={(v) => {
          setFiltroVista(v)
          setCurrentPage(1)
        }}
      />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <CajasVendedorStats user={user} caja={caja} formatter={formatter} />

        <CajasVendedorTable
          tipoVista={filtroVista}
          data={currentData}
          currentPage={currentPage}
          totalPages={Math.ceil(dataAMostrar.length / itemsPerPage)}
          onPageChange={setCurrentPage}
          formatter={formatter}
          // Props de filtrado
          soloMisMovimientos={soloMisMovimientos}
          setSoloMisMovimientos={setSoloMisMovimientos}
          userId={user?.id}
          onSelectCaja={(c) => {
            setCajaSeleccionada(c)
            setFiltroVista('movimientos')
          }}
        />
      </motion.div>
    </div>
  )
}

export default Cajas
