import Title from '@/components/Titlte'
import { AnimatePresence, motion } from 'framer-motion'
import { LuCircleX, LuPlus, LuStore, LuWallet } from 'react-icons/lu'

const CajasAdminHeader = ({
  puntoSeleccionado,
  setPuntoSeleccionado,
  listaPuntos,
  esCajaAbierta,
  setModalType,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
      <div className="w-full md:w-auto">
        <Title
          titulo="AUDITORÍA DE CAJAS"
          descripcion="SUPERVISIÓN Y CONTROL DE FLUJOS POR SUCURSAL"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
        <div className="relative min-w-[280px] w-full md:w-auto">
          <LuStore className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold" size={18} />
          <select
            value={puntoSeleccionado}
            onChange={(e) => setPuntoSeleccionado(e.target.value)}
            className="w-full bg-[#111615] border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.15em] py-4 pl-12 pr-10 rounded-2xl appearance-none focus:border-luck-gold/50 outline-none cursor-pointer transition-all"
          >
            <option value="">Seleccione Punto de Venta </option>
            {listaPuntos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        <AnimatePresence mode="wait">
          {puntoSeleccionado && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex gap-2 w-full md:w-auto"
            >
              {esCajaAbierta ? (
                <>
                  <button
                    onClick={() => setModalType('inyectar')}
                    className="flex-1 md:flex-none bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase text-[10px] tracking-widest border border-white/5"
                  >
                    <LuPlus className="text-luck-gold" size={16} /> Inyectar
                  </button>
                  <button
                    onClick={() => setModalType('cerrar')}
                    className="flex-1 md:flex-none bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase text-[10px] tracking-widest border border-red-500/20"
                  >
                    <LuCircleX size={16} /> Forzar Cierre
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setModalType('abrir')}
                  className="flex-1 md:flex-none bg-green-500/10 hover:bg-green-500/20 text-green-500 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase text-[10px] tracking-widest border border-green-500/20"
                >
                  <LuWallet size={16} /> Apertura Remota
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default CajasAdminHeader
