import { useMemo } from 'react'

const usePaginationWindow = (currentPage, totalPages, maxVisibleButtons = 5) => {
  return useMemo(() => {
    const pages = []

    // Si el total de páginas es pequeño, las mostramos todas de golpe
    if (totalPages <= maxVisibleButtons + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      let startPage = Math.max(2, currentPage - 2)
      let endPage = Math.min(totalPages - 1, currentPage + 2)

      // Ajustes de extremos para que la cantidad de botones visibles sea constante
      if (currentPage <= 3) {
        endPage = maxVisibleButtons
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxVisibleButtons + 1
      }

      // Añadimos la primera página
      pages.push(1)

      // Añadimos puntos suspensivos a la izquierda si es necesario
      if (startPage > 2) pages.push('ellipsis-left')

      // Añadimos las páginas centrales de la ventana
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      // Añadimos puntos suspensivos a la derecha si es necesario
      if (endPage < totalPages - 1) pages.push('ellipsis-right')

      // Añadimos la última página
      pages.push(totalPages)
    }
    return pages
  }, [totalPages, currentPage, maxVisibleButtons])
}

export default usePaginationWindow
