import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { LuLayoutDashboard } from 'react-icons/lu'
import { useOutletContext } from 'react-router-dom'

import { cajaAPI, puntosVentaAPI } from '@/api/index.api'
import CajaOperacionesModal from '@/components/CajaOperacionesModal'
import { useCajaStore } from '@/store/useCajaStore'

// Componentes Modularizados
import CajasHeader from '@/components/headers/CajasAdminHeader'
import CajasStats from '@/components/stats/CajasAdminStats'
import CajasTable from '@/components/tables/CajasAdminTable'

const CajasAdmin = () => {
  const { setIsLoading, setLoadingMsg } = useOutletContext()
  const { setCaja, setCajas, cajas, caja } = useCajaStore()

  const [modalType, setModalType] = useState(null)
  const [puntoSeleccionado, setPuntoSeleccionado] = useState('')
  const [listaPuntos, setListaPuntos] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const formatter = useMemo(
    () => new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }),
    []
  )

  useEffect(() => {
    puntosVentaAPI.listarTodos().then(({ data }) => setListaPuntos(data.puntosVentas || []))
  }, [])

  useEffect(() => {
    if (!puntoSeleccionado) return
    const cargarDatos = async () => {
      setIsLoading(true)
      setLoadingMsg('Consultando estado...')
      try {
        const [respHist, respAct] = await Promise.all([
          cajaAPI.listarPorPuntoVenta(puntoSeleccionado),
          cajaAPI.obtenerCajaAbierta(puntoSeleccionado),
        ])
        setCajas(respHist.data.cajas || [])
        setCaja(respAct.data.caja || null)
        setCurrentPage(1)
      } finally {
        setIsLoading(false)
      }
    }
    cargarDatos()
  }, [puntoSeleccionado, setCaja, setCajas, setIsLoading, setLoadingMsg])

  const totalPages = Math.ceil(cajas.length / itemsPerPage)
  const currentData = useMemo(() => {
    return cajas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  }, [currentPage, cajas])

  const esCajaAbierta = caja?.estado === 'Abierta'

  return (
    <div className="w-full pb-10">
      <CajasHeader
        puntoSeleccionado={puntoSeleccionado}
        setPuntoSeleccionado={setPuntoSeleccionado}
        listaPuntos={listaPuntos}
        esCajaAbierta={esCajaAbierta}
        setModalType={setModalType}
      />

      {puntoSeleccionado ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <CajasStats caja={caja} esCajaAbierta={esCajaAbierta} formatter={formatter} />
          <CajasTable
            currentData={currentData}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            formatter={formatter}
          />
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-white/5 rounded-[3rem] opacity-30">
          <LuLayoutDashboard size={60} className="mb-4 text-luck-gold" />
          <p className="text-xs font-black uppercase tracking-[0.4em]">
            Seleccione un punto de venta para auditar
          </p>
        </div>
      )}

      {modalType && (
        <CajaOperacionesModal
          type={modalType}
          onClose={() => setModalType(null)}
          puntoVentaId={puntoSeleccionado}
          cajaActiva={caja}
        />
      )}
    </div>
  )
}

export default CajasAdmin
