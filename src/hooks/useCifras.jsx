import { cifraAPI } from '@/api/index.api'
import React from 'react'
import { useMemo } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const useCifras = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedCifra, setSelectedCifra] = useState(null)
  const [cifras, setCifras] = useState([])
  const [loading, setLoading] = useState(true)

  const [digitsFilter, setDigitsFilter] = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('Todos')

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const fetchData = async () => {
    setLoading(true)
    try {
      const resp = await cifraAPI.listarTodas()
      setCifras(resp.data?.cifras || [])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const uniqueDigits = useMemo(() => {
    const list = cifras.map((c) => c.cantidad).filter((val) => val !== undefined && val !== null)
    return [...new Set(list)].sort((a, b) => a - b)
  }, [cifras])

  const filteredCifras = useMemo(() => {
    return cifras.filter((c) => {
      const matchesDigits = digitsFilter === 'Todos' || c.cantidad.toString() === digitsFilter
      let matchesStatus = true
      if (statusFilter === 'Activos') matchesStatus = c.activo === true
      if (statusFilter === 'Inactivos') matchesStatus = c.activo === false
      return matchesDigits && matchesStatus
    })
  }, [cifras, digitsFilter, statusFilter])

  const totalPages = Math.ceil(filteredCifras.length / itemsPerPage)
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredCifras.slice(start, start + itemsPerPage)
  }, [filteredCifras, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [digitsFilter, statusFilter])

  const handleEdit = (cifra) => {
    setSelectedCifra(cifra)
    setShowModal(true)
  }
  return {
    setCifras,
    cifras,
    setSelectedCifra,
    setShowModal,
    showModal,
    digitsFilter,
    setDigitsFilter,
    uniqueDigits,
    statusFilter,
    setStatusFilter,
    filteredCifras,
    currentData,
    currentPage,
    setCurrentPage,
    totalPages,
    handleEdit,
    selectedCifra,
    fetchData,
    loading
  }
}

export default useCifras