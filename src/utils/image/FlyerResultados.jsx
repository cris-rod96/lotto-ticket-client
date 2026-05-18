import { toPng } from 'html-to-image'
import { useRef } from 'react'
import { LuImage } from 'react-icons/lu'

const FilaResultado = ({ index, numero, cantidad }) => {
  return (
    <div className="flex h-16 shadow-2xl shadow-black/60">
      {/* Indicador de Suerte */}
      <div className="bg-[#1a1a1a]/95 backdrop-blur-sm w-14 rounded-l-2xl flex items-center justify-center border-r border-white/5 relative">
        <span
          className="text-[7px] font-black text-zinc-500 absolute left-2 rotate-180"
          style={{ writingMode: 'vertical-rl' }}
        >
          SUERTE
        </span>
        <span className="text-xl font-black text-white ml-3">{index + 1}</span>
      </div>
      {/* Número Ganador */}
      <div className="flex-1 bg-green-700/90 backdrop-blur-md flex items-center justify-center border-y border-white/10 rounded-r-2xl">
        <span className="text-4xl font-black tracking-[0.3em] text-white pl-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          {numero.padStart(cantidad, '0')}
        </span>
      </div>
    </div>
  )
}

const FlyerResultados = ({ data }) => {
  const flyerRef = useRef(null)

  // Mapeo dinámico desde el objeto Catalogo
  const catalogo = data.Sorteo?.Catalogo || {}
  const codigoPais = catalogo.pais?.toLowerCase() || '' // "ec" o "ar"
  const nombreJuego = catalogo.nombre || 'SORTEO'

  const getCountryStyle = () => {
    if (codigoPais) {
      // Usamos un degradado ligeramente más oscuro para países con banderas claras (como Argentina)
      const darkOverlay = codigoPais === 'ar' ? '0.85' : '0.75'

      return {
        backgroundImage: `linear-gradient(to bottom, rgba(12, 12, 12, ${darkOverlay}), rgba(12, 12, 12, 0.98)), url('https://flagcdn.com/w1280/${codigoPais}.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    }
    return { backgroundColor: '#0c0c0c' }
  }

  const generarImagen = async () => {
    if (!flyerRef.current) return
    try {
      const dataUrl = await toPng(flyerRef.current, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: '#0c0c0c', // Asegura fondo sólido en la exportación
      })
      const link = document.createElement('a')
      link.download = `Flyer-${nombreJuego}-${codigoPais.toUpperCase()}-N${data.Sorteo?.numero}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Error al generar la imagen', err)
    }
  }

  const cifraConfig = data.Sorteo?.Cifra?.cantidad || 2

  return (
    <>
      <button
        onClick={generarImagen}
        className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-emerald-400 hover:border-emerald-400/30 transition-all uppercase text-[10px] font-black flex items-center gap-2 shadow-lg group"
      >
        <LuImage size={16} className="group-hover:scale-110 transition-transform" />
        Generar Flyer {nombreJuego} ({codigoPais.toUpperCase()})
      </button>

      {/* Contenedor de Captura (Invisible en UI) */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div
          ref={flyerRef}
          className="w-[500px] p-10 text-white font-sans border-[6px] border-luck-gold/20 relative overflow-hidden"
          style={getCountryStyle()}
        >
          {/* Viñeta de enfoque central */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_10%,#0c0c0c_110%)] opacity-80" />

          <div className="relative z-10">
            {/* Header Personalizado */}
            <div className="flex flex-col items-center mb-6">
              <img
                src="/logo_principal.png"
                alt="Logo"
                className="w-52 h-52 object-contain mb-2 drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)]"
              />

              <div className="text-luck-gold font-black text-4xl tracking-widest uppercase italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {nombreJuego}
              </div>

              <div className="h-[2px] w-32 bg-luck-gold/40 mt-2 mb-4 rounded-full"></div>

              <h2 className="text-white font-black text-2xl uppercase tracking-tighter italic leading-none drop-shadow-lg">
                Resultados Oficiales
              </h2>

              <div className="bg-black/40 backdrop-blur-md text-white text-[9px] font-black px-5 py-1.5 rounded-full mt-4 uppercase tracking-[0.2em] border border-white/10 shadow-inner">
                Sorteo de {cifraConfig} Cifras
              </div>

              <p className="text-zinc-400 font-bold text-xs tracking-[0.2em] uppercase mt-4">
                № {data.Sorteo?.numero} | {data.Sorteo?.jornada}
              </p>
            </div>

            {/* Listado de Premios */}
            <div className="space-y-3.5 mt-2">
              {(data.DetallesResultados || []).map((item, index) => (
                <FilaResultado
                  key={item.id || index}
                  index={index}
                  numero={item.numeroGanador}
                  cantidad={cifraConfig}
                />
              ))}
            </div>

            {/* Footer Dinámico */}
            <div className="mt-10 pt-6 border-t border-white/10 flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-none mb-1">
                  Fecha de Sorteo
                </span>
                <span className="text-sm font-bold text-white leading-none">
                  {data.Sorteo?.fechaSorteo}
                </span>
                <p className="text-2xl font-black text-luck-gold italic mt-4 drop-shadow-md">
                  VALOR {data.Sorteo?.Cifra?.valorMinimoTicket} CTVS.
                </p>
              </div>
              <div className="text-right max-w-[170px]">
                <p className="text-[9px] text-zinc-300 font-bold uppercase leading-tight italic opacity-70">
                  Consulta tus premios en puntos autorizados de{' '}
                  {codigoPais === 'ar' ? 'Argentina' : 'Ecuador'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FlyerResultados
