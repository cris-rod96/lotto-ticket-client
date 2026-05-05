import { cifraAPI, suerteAPI } from '@/api/index.api'
import SuerteModal from '@/components/SuerteModal'
import Title from '@/components/Titlte'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { LuClover, LuLayers, LuPencil, LuPlus } from 'react-icons/lu'

const Suertes = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedSuerte, setSelectedSuerte] = useState(null)
  const [suertes, setSuertes] = useState([])
  const [cifras, setCifras] = useState([])

  // Estado para el filtro de cifras (por defecto 2)
  const [activeTab, setActiveTab] = useState(2)

  const fetchData = async () => {
    try {
      const [respSuertes, respCifras] = await Promise.all([
        suerteAPI.listarTodas(),
        cifraAPI.listarTodas(),
      ])
      setSuertes(respSuertes.data?.suertes || [])
      // Ordenamos las cifras de menor a mayor para las pestañas
      const sortedCifras = (respCifras.data?.cifras || []).sort((a, b) => a.cantidad - b.cantidad)
      setCifras(sortedCifras)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Filtrado por la pestaña activa
  const filteredSuertes = useMemo(() => {
    return suertes.filter((s) => s.Cifra?.cantidad === activeTab)
  }, [suertes, activeTab])

  const handleEdit = (suerte) => {
    setSelectedSuerte(suerte)
    setShowModal(true)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full pb-10">
      <div className="flex justify-between items-center mb-10">
        <Title
          titulo="Configuración de Suertes"
          descripcion="Premios y niveles de victoria segmentados por cifras"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setSelectedSuerte(null)
            setShowModal(true)
          }}
          className="bg-luck-gold text-black font-black py-3.5 px-6 rounded-2xl flex items-center gap-2 uppercase text-sm shadow-lg shadow-luck-gold/10"
        >
          <LuPlus size={20} strokeWidth={3} /> Nueva Suerte
        </motion.button>
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

      {/* Tabla con AnimatePresence para cambios suaves entre pestañas */}
      <div className="bg-[#111615] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] text-zinc-500 uppercase text-[11px] font-bold tracking-[0.15em]">
              <th className="p-7 pl-10">Nivel de Suerte</th>
              <th className="p-7 text-center">Monto Premio</th>
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
                        Sin suertes para {activeTab} cifras
                      </h3>
                      <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest max-w-[250px] mx-auto leading-relaxed">
                        Aún no has configurado los premios para esta categoría. Haz clic en "Nueva
                        Suerte" para comenzar.
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
      />
    </motion.div>
  )
}

export default Suertes
