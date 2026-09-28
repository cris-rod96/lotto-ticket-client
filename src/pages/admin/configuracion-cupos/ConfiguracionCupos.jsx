import { cifraAPI } from "@/api/index.api";
import ConfiguracionCupoModal from "@/components/ConfiguracionCupoModal";
import ConfiguracionCuposFilters from "@/components/filters/ConfiguracionCuposFilters";
import ConfiguracionCupoHeader from "@/components/headers/ConfiguracionCuposHeader";
import useConfiguracionCupo from "@/hooks/useConfiguracionCupo";
import { AnimatePresence, motion } from "framer-motion";
import {
  LuChevronLeft,
  LuChevronRight,
  LuInbox,
  LuPencil,
  LuTrash2,
  LuRefreshCw,
} from "react-icons/lu";
import Swal from "sweetalert2";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const rowVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.99, transition: { duration: 0.15 } },
};

const ConfiguracionCupos = () => {
  const {
    setShowModal,
    showModal,
    digitsFilter,
    setDigitsFilter,
    uniqueDigits,
    currentData,
    currentPage,
    setCurrentPage,
    totalPages,
    handleEdit,
    fetchData,
    loading,

    cifras,
    catalogos,

    jornada,
    setJornada,
    setPaises,
    paises,
    selectedConfiguracion,
    setSelectedConfirguacion,
  } = useConfiguracionCupo();

  return (
    <motion.div initial="hidden" animate="visible" className="w-full pb-10">
      <ConfiguracionCupoHeader
        setSelectedConfiguration={setSelectedConfirguacion}
        setShowModal={setShowModal}
      />

      <ConfiguracionCuposFilters
        digitsFilter={digitsFilter}
        setDigitsFilter={setDigitsFilter}
        uniqueDigits={uniqueDigits}
        jornada={jornada}
        setJornada={setJornada}
        paises={paises}
        setPaises={setPaises}
      />

      <motion.div
        variants={containerVariants}
        className="bg-[#111615] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-zinc-500 uppercase text-[12px] font-black tracking-[0.18em] border-b border-white/5">
                <th className="p-5 pl-8">Cifras</th>
                <th className="p-5 pl-8 text-center">Jornada</th>
                <th className="p-5 pl-8 text-center">Lotería</th>
                <th className="p-5 pl-8 text-center">País</th>
                <th className="p-5 text-center">Cupo Máximo</th>
                <th className="p-5 text-center">Valor Mín. Ticket</th>
                <th className="p-5  pr-8 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              <AnimatePresence mode="popLayout" initial={false}>
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-16 text-center text-zinc-600 font-black text-xs uppercase"
                    >
                      Cargando registros...
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((cupJor) => (
                    <motion.tr
                      key={cupJor.id}
                      variants={rowVariants}
                      layout
                      className="group hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="p-5 pl-8">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-luck-gold/10 border border-luck-gold/20 flex items-center justify-center text-luck-gold font-black">
                            {cupJor.Cifra.cantidad}
                          </div>
                          <span className="text-white font-black text-[11px]">
                            {cupJor.Cifra.cantidad} Cifras
                          </span>
                        </div>
                      </td>

                      <td className="p-5 font-mono text-zinc-400 text-[14px] text-center">
                        {cupJor.jornada}
                      </td>

                      <td className="p-5 font-mono text-zinc-400 text-[14px] text-center">
                        {cupJor.Catalogo.nombre}
                      </td>
                      <td className="p-5 font-mono text-zinc-400 text-[14px] text-center">
                        {cupJor.Catalogo?.pais === "EC"
                          ? "ECUADOR"
                          : "ARGENTINA"}
                      </td>
                      <td className="p-5 font-mono text-zinc-400 text-[14px] text-center">
                        ${parseFloat(cupJor.cupoMaximo).toFixed(2)}
                      </td>
                      <td className="p-5 font-mono text-zinc-400 text-[14px] text-center">
                        ${parseFloat(cupJor.Cifra.valorMinimoTicket).toFixed(2)}
                      </td>

                      <td className="p-5 pr-8 flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(cupJor)}
                          className="px-10 py-2 bg-zinc-900/40 border border-white/5 rounded-lg text-zinc-500 hover:text-luck-gold transition-colors flex flex-row items-center justify-center gap-2.5 w-auto"
                        >
                          <LuPencil size={15} />
                          Editar
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-24 text-center">
                      <LuInbox
                        size={50}
                        className="mx-auto text-luck-gold opacity-30"
                      />
                      <p className="text-[10px] font-black uppercase text-white mt-4 tracking-widest opacity-30">
                        No se encontraron registros
                      </p>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-5 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-luck-gold transition-all"
              >
                <LuChevronLeft size={16} />
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-7 h-7 rounded-md text-[9px] font-black ${currentPage === i + 1 ? "bg-luck-gold text-black" : "text-zinc-500 hover:bg-white/5"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-luck-gold transition-all"
              >
                <LuChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {showModal && (
        <ConfiguracionCupoModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          initialData={selectedConfiguracion}
          fetchData={fetchData}
          catalogos={catalogos}
          cifras={cifras}
        />
      )}
    </motion.div>
  );
};

export default ConfiguracionCupos;
