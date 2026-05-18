import { cifraAPI, puntosVentaAPI, suerteAPI } from '@/api/index.api' // Asegúrate de tener puntosVentaAPI
import SuerteModal from '@/components/SuerteModal'
import Title from '@/components/Titlte'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { LuClover, LuLayers, LuPencil, LuPlus, LuStore } from 'react-icons/lu'

const Suertes = () => {
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

  // LÓGICA FILTRADO: Filtra por cifras y extrae el premio del Punto de Venta seleccionado
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full pb-10">
      <div className="flex justify-between items-end mb-10">
        <Title
          titulo="Configuración de Suertes"
          descripcion="Gestiona los premios personalizados por cada punto de venta"
        />

        <div className="flex items-center gap-4">
          {/* SELECTOR DE PUNTO DE VENTA */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
              Punto de Venta
            </label>
            <div className="relative">
              <LuStore
                className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold"
                size={18}
              />
              <select
                value={selectedPuntoId}
                onChange={(e) => setSelectedPuntoId(e.target.value)}
                className="bg-zinc-950 border border-white/10 text-white text-xs font-bold rounded-2xl py-3.5 pl-12 pr-10 appearance-none focus:outline-none focus:border-luck-gold/50 transition-all cursor-pointer"
              >
                {puntosVenta.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedSuerte(null)
              setShowModal(true)
            }}
            className="bg-luck-gold text-black font-black py-3.5 px-6 rounded-2xl flex items-center gap-2 uppercase text-sm shadow-lg shadow-luck-gold/10 self-end"
          >
            <LuPlus size={20} strokeWidth={3} /> Nueva Suerte
          </motion.button>
        </div>
      </div>

      {/* Pestañas de Cifras */}
      <div className="flex items-center gap-2 mb-8 bg-zinc-950/50 p-2 rounded-2xl border border-white/5 w-fit">
        {cifras.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveTab(c.cantidad)}
            className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === c.cantidad
                ? 'bg-luck-gold text-black shadow-lg shadow-luck-gold/20'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
            }`}
          >
            {c.cantidad} Cifras
          </button>
        ))}
      </div>

      {/* Tabla con Premios por Punto de Venta */}
      <div className="bg-[#111615] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] text-zinc-500 uppercase text-[11px] font-bold tracking-[0.15em]">
              <th className="p-7 pl-10">Nivel de Suerte</th>
              <th className="p-7 text-center">Premio en este Punto</th>
              <th className="p-7 text-center">Estado</th>
              <th className="p-7 text-right pr-10">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            <AnimatePresence mode="wait">
              {filteredSuertes.length > 0 ? (
                filteredSuertes.map((suerte) => (
                  <motion.tr
                    key={suerte.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="group hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="p-7 pl-10 font-black text-white uppercase text-sm italic flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-luck-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                      {suerte.descripcion}
                    </td>
                    <td className="p-7 text-center font-mono text-luck-gold font-black text-lg">
                      ${suerte.premio}
                    </td>
                    <td className="p-7 text-center">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${
                          suerte.activo
                            ? 'bg-green-500/5 text-green-500 border-green-500/20'
                            : 'bg-red-500/5 text-red-500 border-red-500/20'
                        }`}
                      >
                        {suerte.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="p-7 pr-10 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(suerte)}
                          className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-luck-gold transition-all"
                        >
                          <LuPencil size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <td colSpan="4" className="p-32 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative mb-6">
                        <LuClover size={60} className="text-zinc-800" />
                        <LuLayers
                          size={24}
                          className="absolute -bottom-2 -right-2 text-luck-gold/40"
                        />
                      </div>
                      <h3 className="text-white font-black uppercase tracking-[0.3em] text-xs mb-2">
                        Sin configuración de premios
                      </h3>
                      <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest max-w-[250px] mx-auto leading-relaxed">
                        No se encontraron premios para el punto de venta y categoría seleccionados.
                      </p>
                    </div>
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <SuerteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialData={selectedSuerte}
        cifras={cifras}
        fetchData={fetchData}
        selectedSuerte={selectedSuerte}
        selectedPuntoId={selectedPuntoId} // Pasamos el punto seleccionado al modal para guardar
      />
    </motion.div>
  )
}

export default Suertes
