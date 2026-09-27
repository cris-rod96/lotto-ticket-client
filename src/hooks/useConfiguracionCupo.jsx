import {
  catalogoAPI,
  cifraAPI
} from "@/api/index.api"
import { useEffect, useState, useMemo } from "react"

const useConfiguracionCupos = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedConfiguracion, setSelectedConfirguacion] = useState(null)
  const [catalogos, setCatalogos] = useState([])
  const [cifras, setCifras] = useState([])
  const [jornada, setJornada] = useState(null)
  const [loading, setLoading] = useState(true)

  const [digitsFilter, setDigitsFilter] = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('Todos')


  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 5




  const fetchData = async () => {
    setLoading(true)
    try {
      const [respCatalogos, respCifras] = await Promise.all([
        catalogoAPI.listarTodos(),
        cifraAPI.listarActivas()
      ])

      console.log(respCatalogos)

      console.log("Cifras: ", respCifras.data)

      setCatalogos(respCatalogos.data?.catalogos)
      setCifras(respCifras.data?.cifras)

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const uniqueDigits = useMemo(() => {
    const list = cifras.map((c) => c.cantidad).filter((val) => val !== undefined && val !== null)
    return [...new Set(list)].sort((a, b) => a - b)
  }, [cifras])

  const totalPages = Math.ceil(cifras.length / itemsPerPage)
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return cifras.slice(start, start + itemsPerPage)
  }, [cifras, currentPage])


  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [digitsFilter])


  const handleEdit = () => {}


  return {
    cifras,
    setCifras,
    catalogos,
    setCatalogos,
    showModal,
    setShowModal,
    totalPages,
    currentData,
    currentPage,
    loading,
    fetchData,
    uniqueDigits,
    jornada,
    setJornada



  }

}
export default useConfiguracionCupos