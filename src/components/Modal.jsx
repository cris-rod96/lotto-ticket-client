import { LuX } from 'react-icons/lu'

const Modal = ({ isOpen, onClose, titulo, children, icon: Icon }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop con Blur sutil */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#0d1211] border border-white/10 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Línea decorativa superior dorada */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-luck-gold to-transparent opacity-60" />

        {/* Cabecera del Modal */}
        <div className="p-8 pb-0 flex justify-between items-center">
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
            {Icon && <Icon className="text-luck-gold" size={24} />}
            {titulo}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
          >
            <LuX size={24} />
          </button>
        </div>

        {/* Contenido Inyectado */}
        <div className="p-10 pt-6">{children}</div>
      </div>
    </div>
  )
}

export default Modal
