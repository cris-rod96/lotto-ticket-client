import { resultadoAPI, sorteoAPI, suerteAPI } from '@/api/index.api'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { LuCalendar, LuCircleAlert, LuTrophy, LuX } from 'react-icons/lu'
import Swal from 'sweetalert2'

const ResultadoModal = ({ isOpen, onClose, fetchData }) => {
  const [loading, setLoading] = useState(false)
  const [sorteosCerrados, setSorteosCerrados] = useState([])
  const [allSuertes, setAllSuertes] = useState([])

  const [SorteoId, setSorteoId] = useState('')
  const [resultadosArr, setResultadosArr] = useState([]) // Solo las suertes de la cifra seleccionada

  const loadInitialData = async () => {
    try {
      const [respSorteos, respSuertes] = await Promise.all([
        sorteoAPI.listarCerrados(),
        suerteAPI.listarTodas(),
      ])
      setSorteosCerrados(respSorteos.data.sorteos || [])
      setAllSuertes(respSuertes.data.suertes || [])
    } catch (error) {
      console.error('Error al cargar datos', error)
    }
  }

  useEffect(() => {
    if (isOpen) loadInitialData()
  }, [isOpen])

  // Lógica para filtrar suertes según la CifraId del Sorteo seleccionado
  useEffect(() => {
    if (SorteoId) {
      const sorteoSeleccionado = sorteosCerrados.find((s) => s.id === SorteoId)
      if (sorteoSeleccionado) {
        const suertesFiltradas = allSuertes
          .filter((suerte) => suerte.CifraId === sorteoSeleccionado.CifraId)
          .map((s) => ({
            SuerteId: s.id,
            descripcion: s.descripcion, // El label (Primera Suerte, etc)
            numeroSorteado: '',
          }))
        setResultadosArr(suertesFiltradas)
      }
    } else {
      setResultadosArr([])
    }
  }, [SorteoId, sorteosCerrados, allSuertes])

  const handleInputChange = (suerteId, value) => {
    setResultadosArr((prev) =>
      prev.map((item) => (item.SuerteId === suerteId ? { ...item, numeroSorteado: value } : item))
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const incompleto = resultadosArr.some((r) => r.numeroSorteado === '')
    if (incompleto) return Swal.fire('Atención', 'Ingresa todos los números ganadores', 'warning')

    setLoading(true)
    try {
      await resultadoAPI.registrar({
        SorteoId,
        resultadosArr: resultadosArr.map(({ SuerteId, numeroSorteado }) => ({
          SuerteId,
          numeroSorteado,
        })),
      })
      Swal.fire('Éxito', 'Resultados publicados correctamente', 'success')
      fetchData()
      onClose()
    } catch (error) {
      Swal.fire('Error', 'No se pudieron guardar los resultados', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        layout // Esto hace que el modal crezca suavemente
        className="relative bg-[#111615] border border-white/10 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <LuTrophy className="text-luck-gold" size={22} />
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
              Registrar Resultados
            </h2>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <LuX size={24} />
          </button>
        </div>

        <form className="p-8" onSubmit={handleSubmit}>
          {/* 1. SELECCIÓN DE SORTEO */}
          <div className="mb-8">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-2 ml-1">
              Sorteo a finalizar
            </label>
            <div className="relative">
              <LuCalendar
                className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold"
                size={18}
              />
              <select
                required
                className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-luck-gold/50 outline-none transition-all appearance-none cursor-pointer"
                value={SorteoId}
                onChange={(e) => setSorteoId(e.target.value)}
              >
                <option value="">Seleccione el sorteo...</option>
                {sorteosCerrados.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.Catalogo.nombre} - {s.jornada} ({s.fechaSorteo}) | {s.Cifra.cantidad} Cifras
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. AREA DE SUERTES CON ANIMACIÓN */}
          <AnimatePresence mode="wait">
            {!SorteoId ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-12 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-zinc-600 gap-3"
              >
                <LuCircleAlert size={40} className="opacity-20" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] italic">
                  Debe seleccionar un sorteo primero
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-premium"
              >
                {resultadosArr.map((res) => (
                  <div
                    key={res.SuerteId}
                    className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl group hover:border-luck-gold/30 transition-all"
                  >
                    <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest block mb-2 group-hover:text-luck-gold transition-colors">
                      {res.descripcion}
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="----"
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-center text-2xl font-black text-luck-gold placeholder:text-zinc-800 focus:border-luck-gold outline-none transition-all font-mono"
                      value={res.numeroSorteado}
                      onChange={(e) =>
                        handleInputChange(res.SuerteId, e.target.value.replace(/\D/g, ''))
                      }
                    />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 mt-10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-zinc-900 text-zinc-500 font-bold py-4 rounded-xl hover:text-zinc-300 transition-all uppercase text-[10px] tracking-widest"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !SorteoId}
              className="flex-[2] bg-luck-gold hover:bg-yellow-600 disabled:opacity-20 text-black font-black py-4 rounded-xl transition-all uppercase text-[10px] tracking-widest shadow-lg shadow-luck-gold/10"
            >
              {loading ? 'Publicando...' : 'Finalizar y Publicar'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* ESTILOS PARA EL SCROLLBAR ASQUEROSO */}
      <style jsx>{`
        .scrollbar-premium::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-premium::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .scrollbar-premium::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.2);
          border-radius: 10px;
        }
        .scrollbar-premium::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }
      `}</style>
    </div>
  )
}

export default ResultadoModal
