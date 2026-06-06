import { resultadoAPI } from '@/api/index.api'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { LuRefreshCw, LuX } from 'react-icons/lu'
import Swal from 'sweetalert2'

const ActualizarResultadoModal = ({ isOpen, onClose, fetchData, sorteoData }) => {
  const [loading, setLoading] = useState(false)
  const [resultadosArr, setResultadosArr] = useState([])

  useEffect(() => {
    if (isOpen && sorteoData && sorteoData.DetallesResultados) {
      const ordenSuertes = {
        PRIMERA: 1,
        SEGUNDA: 2,
        TERCERA: 3,
        CUARTA: 4,
        QUINTA: 5,
        SEXTA: 6,
        SEPTIMA: 7,
        OCTAVA: 8,
        NOVENA: 9,
        DECIMA: 10,
      }

      const existentes = sorteoData.DetallesResultados.map((dr) => ({
        SuerteId: dr.SuerteId,
        descripcion: dr.Suerte.descripcion,
        numeroSorteado: dr.numeroGanador,
      }))

      // Ordenar basándose en el nombre de la suerte
      existentes.sort((a, b) => {
        const nombreA = a.descripcion.split(' ')[0].toUpperCase()
        const nombreB = b.descripcion.split(' ')[0].toUpperCase()
        return (ordenSuertes[nombreA] || 99) - (ordenSuertes[nombreB] || 99)
      })

      setResultadosArr(existentes)
    }
  }, [isOpen, sorteoData])

  const handleInputChange = (suerteId, value) => {
    setResultadosArr((prev) =>
      prev.map((item) => (item.SuerteId === suerteId ? { ...item, numeroSorteado: value } : item))
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await resultadoAPI.actualizar({
        SorteoId: sorteoData.SorteoId,
        resultadosArr: resultadosArr.map(({ SuerteId, numeroSorteado }) => ({
          SuerteId,
          numeroSorteado,
        })),
      })

      Swal.fire('Éxito', 'Resultados actualizados correctamente', 'success')
      fetchData()
      onClose()
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'No se pudo actualizar', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        layout
        className="relative bg-[#111615] border border-white/10 w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <LuRefreshCw className="text-cyan-400" size={22} />
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
              Recalcular: {sorteoData.Sorteo.Catalogo.nombre}
            </h2>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <LuX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-8 max-h-[400px] overflow-y-auto pr-2 scrollbar-premium">
            {resultadosArr.map((res) => (
              <div
                key={res.SuerteId}
                className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl"
              >
                <label className="text-[9px] font-black uppercase text-zinc-500 mb-2 block">
                  {res.descripcion}
                </label>
                <input
                  type="text"
                  maxLength={sorteoData.Sorteo.Cifra.cantidad}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-center text-2xl font-black text-cyan-400 font-mono outline-none"
                  value={res.numeroSorteado}
                  onChange={(e) =>
                    handleInputChange(res.SuerteId, e.target.value.replace(/\D/g, ''))
                  }
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-black py-4 rounded-xl uppercase text-[10px] tracking-widest"
          >
            {loading ? 'Recalculando...' : 'Confirmar Recálculo'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default ActualizarResultadoModal
