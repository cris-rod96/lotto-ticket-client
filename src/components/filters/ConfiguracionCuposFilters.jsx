import { motion } from "framer-motion";
import { LuFilter, LuHash, LuRotateCcw } from "react-icons/lu";
const ConfiguracionCuposFilters = ({
  digitsFilter,
  setDigitsFilter,
  uniqueDigits,
  jornada,
  setJornada,
  paises,
  setPaises,
}) => {
  return (
    <motion.div className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-8 flex  items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative w-full sm:w-56">
          <LuHash
            className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold"
            size={16}
          />
          <select
            value={digitsFilter}
            onChange={(e) => setDigitsFilter(e.target.value)}
            className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-xs appearance-none cursor-pointer uppercase font-bold"
          >
            <option value="Todos">Todas las cifras</option>
            {uniqueDigits.map((digit) => (
              <option key={digit} value={String(digit)}>
                {digit} Cifras
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-56">
          <LuFilter
            className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold"
            size={16}
          />
          <select
            value={jornada}
            onChange={(e) => setJornada(e.target.value)}
            className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-xs appearance-none cursor-pointer uppercase font-bold"
          >
            <option value="Todos">Todos las jornadas</option>
            <option value="Mañanera">MAÑANERA</option>
            <option value="Matutina">MATUTINA</option>
            <option value="Vespertina">VESPERTINA</option>
            <option value="Nocturna">NOCTURNA</option>
          </select>
        </div>

        <div className="relative w-full sm:w-56">
          <LuFilter
            className="absolute left-4 top-1/2 -translate-y-1/2 text-luck-gold"
            size={16}
          />
          <select
            value={paises}
            onChange={(e) => setPaises(e.target.value)}
            className="w-full bg-[#1a1f1e] border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-xs appearance-none cursor-pointer uppercase font-bold"
          >
            <option value="Todos">Todos los países</option>
            <option value="EC">Ecuador</option>
            <option value="AR">Argentina</option>
          </select>
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          setDigitsFilter("Todos");
          setJornada("Todos");
          setPaises("Todos");
        }}
        className="w-full sm:w-56 bg-[#1a1f1e] border border-white/10 rounded-xl py-3 px-4 text-white hover:border-luck-gold/50 focus:outline-none focus:border-luck-gold/50 transition-all text-xs uppercase font-bold flex items-center justify-center gap-3 cursor-pointer group"
      >
        <LuRotateCcw
          className="text-luck-gold group-hover:rotate-180 transition-transform duration-300 shrink-0"
          size={16}
        />
        <span>Limpiar Filtros</span>
      </button>
    </motion.div>
  );
};

export default ConfiguracionCuposFilters;
