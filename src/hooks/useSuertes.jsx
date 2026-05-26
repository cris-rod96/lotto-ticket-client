import { cifraAPI, puntosVentaAPI, suerteAPI } from '@/api/index.api'
import React from 'react'
import { useMemo } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const useSuertes = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedSuerte, setSelectedSuerte] = useState(null)
  const [suertes, setSuertes] = useState([])
  const [cifras, setCifras] = useState([])
  const [puntosVenta, setPuntosVenta] = useState([])

  // Estado para el punto de venta seleccionado (ID)
  const [selectedPuntoId, setSelectedPuntoId] = useState('')
  const [activeTab, setActiveTab] = useState(2)

  const fetchData = async () => {
    try {
      // Ahora traemos también los puntos de venta
      const [respSuertes, respCifras, respPuntos] = await Promise.all([
        suerteAPI.listarTodas(),
        cifraAPI.listarTodas(),
        puntosVentaAPI.listarTodos(), // Nueva API para obtener locales
      ])

      setSuertes(respSuertes.data?.suertes || [])

      const sortedCifras = (respCifras.data?.cifras || []).sort((a, b) => a.cantidad - b.cantidad)
      setCifras(sortedCifras)

      const puntos = respPuntos.data?.puntosVentas || []
      setPuntosVenta(puntos)

      // Por defecto seleccionamos el primero si existe
      if (puntos.length > 0 && !selectedPuntoId) {
        setSelectedPuntoId(puntos[0].id)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredSuertes = useMemo(() => {
    return suertes
      .filter((s) => s.Cifra?.cantidad === activeTab)
      .map((s) => {
        // Buscamos el detalle que corresponde al punto de venta seleccionado
        const detalle = s.DetallesSuertes?.find((d) => d.PuntoVentaId === selectedPuntoId)
        return {
          ...s,
          // El premio ahora viene del detalle, si no hay, ponemos 0
          premio: detalle ? detalle.premio : '0.00',
        }
      })
  }, [suertes, activeTab, selectedPuntoId])

  const handleEdit = (suerte) => {
    setSelectedSuerte(suerte)
    setShowModal(true)
  }
  return {
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
  }
}

export default useSuertes