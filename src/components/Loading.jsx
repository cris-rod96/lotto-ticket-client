const Loading = ({
  mensaje = 'Sincronizando Sistema',
  subtitulo = 'El Golpe de la Suerte | 2026',
}) => {
  return (
    /* 
       Cambio clave: z-[10000] y !important (vía inline style si fuera necesario) 
       para asegurar que nada quede por encima.
    */
    <div
      className="fixed inset-0 bg-[#0a0a0a] flex flex-col justify-center items-center"
      style={{ zIndex: 99999 }} // Inline style para asegurar prioridad máxima
    >
      {/* Glow de fondo */}
      <div className="absolute w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative flex justify-center items-center">
        {/* Spinner */}
        <div className="w-32 h-32 border-[2px] border-white/5 border-t-[#D4AF37] rounded-full animate-spin"></div>

        {/* Logo */}
        <div className="absolute flex flex-col items-center">
          <span className="text-[#D4AF37] font-black text-2xl uppercase tracking-tighter italic leading-none">
            GS
          </span>
          <div className="h-[1px] w-6 bg-[#D4AF37]/20 my-1"></div>
          <span className="text-white/30 font-bold text-[8px] uppercase tracking-[0.4em]">
            LUCK
          </span>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center gap-5 z-10">
        <h2 className="text-[12px] font-black text-white uppercase tracking-[0.7em] animate-pulse italic text-center px-4">
          {mensaje}
        </h2>

        {/* Barra de progreso */}
        <div className="w-64 h-[1px] bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent animate-progress"></div>
        </div>

        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] mt-2">
          {subtitulo}
        </span>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress {
          width: 100%;
          animation: progress 2s infinite linear;
        }
      `,
        }}
      />
    </div>
  )
}

export default Loading
