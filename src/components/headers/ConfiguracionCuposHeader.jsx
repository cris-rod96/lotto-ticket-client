import { LuPlus } from "react-icons/lu";
import Title from "../Titlte";
import { motion } from "framer-motion";
const ConfiguracionCuposHeader = ({
  setSelectedConfiguration,
  setShowModal,
}) => {
  return (
    <div className="flex justify-between items-center mb-10">
      <Title
        titulo="Gestión de Cupos"
        descripcion="Configuración de máximo de cupos por jornadas."
      />
      <motion.button
        whileHover={{ scale: 1.02, backgroundColor: "#EAB308" }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setSelectedConfiguration(null);
          setShowModal(true);
        }}
        className="bg-luck-gold text-black font-black py-3.5 px-6 rounded-2xl flex items-center gap-2 uppercase text-xs shadow-lg shadow-luck-gold/10 transition-colors tracking-wider"
      >
        <LuPlus size={18} strokeWidth={3} /> Nuevo Cupo
      </motion.button>
    </div>
  );
};

export default ConfiguracionCuposHeader;
