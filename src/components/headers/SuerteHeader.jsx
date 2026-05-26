import Title from "@/components/Titlte"
import { LuPlus, LuStore } from "react-icons/lu"
import { motion } from "framer-motion"
const SuerteHeader = ({
  selectedPuntoId,
  setSelectedPuntoId,
  puntosVenta,
  setSelectedSuerte,
  setShowModal

}) => {
  return (
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
  )
}

export default SuerteHeader