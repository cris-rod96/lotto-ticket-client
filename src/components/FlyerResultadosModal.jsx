import { toPng } from 'html-to-image'
import { useMemo, useRef } from 'react'
import { LuCalendar, LuDownload, LuTicket, LuTrophy, LuX } from 'react-icons/lu'

const FlyerResultadosModal = ({ isOpen, onClose, data }) => {
  const flyerRef = useRef(null)

  // Lógica para formatear la fecha con el día de la semana
  const fechaFormateada = useMemo(() => {
    if (!data?.Sorteo?.fechaSorteo) return ''
    try {
      const fechaObj = new Date(data.Sorteo.fechaSorteo + 'T12:00:00')
      return new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(fechaObj)
    } catch (e) {
      return data.Sorteo.fechaSorteo
    }
  }, [data])

  const { resultados3, resultados2, maxFilas } = useMemo(() => {
    if (!data?.DetallesResultados) return { resultados3: [], resultados2: [], maxFilas: 0 }
    const r3 = data.DetallesResultados.filter(
      (d) => (d.Sorteo?.Cifra?.cantidad || d.numeroGanador?.length) === 3
    ).sort((a, b) => (a.prioridad || 0) - (b.prioridad || 0))
    const r2 = data.DetallesResultados.filter(
      (d) => (d.Sorteo?.Cifra?.cantidad || d.numeroGanador?.length) === 2
    ).sort((a, b) => (a.prioridad || 0) - (b.prioridad || 0))
    return { resultados3: r3, resultados2: r2, maxFilas: Math.max(r3.length, r2.length, 8) }
  }, [data])

  if (!isOpen || !data) return null

  const catalogo = data.Sorteo?.Catalogo || {}
  const codigoPais = catalogo.pais?.toLowerCase() || 'ec'

  const descargarFlyer = async () => {
    if (!flyerRef.current) return
    try {
      const dataUrl = await toPng(flyerRef.current, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: '#0c0c0c',
      })
      const link = document.createElement('a')
      link.download = `Flyer-${catalogo.nombre}-Sorteo-${data.Sorteo?.numero}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-[#111615] border border-white/10 w-full max-w-5xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh]">
        {/* LADO IZQUIERDO: FLYER */}
        <div className="flex-1 bg-zinc-950 p-6 flex items-center justify-center border-r border-white/5 overflow-y-auto no-scrollbar">
          <div className="scale-[0.5] lg:scale-[0.65] origin-center shadow-2xl">
            <div
              ref={flyerRef}
              className="w-[500px] min-h-[850px] bg-[#0c0c0c] p-12 text-white relative overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(12, 12, 12, 0.8), rgba(12, 12, 12, 1)), url('https://flagcdn.com/w1280/${codigoPais}.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="relative z-10 text-center mb-6">
                <img
                  src="/logo_principal.png"
                  alt="Logo"
                  className="w-36 mx-auto mb-4 drop-shadow-2xl"
                />
                <h2 className="text-luck-gold text-5xl font-black italic tracking-widest uppercase">
                  {catalogo.nombre || 'LOTTO'}
                </h2>

                {/* FECHA MÁS GRANDE Y CON DÍA */}
                <div className="bg-white text-black px-6 py-2 rounded-full inline-block mt-4 font-black text-xs uppercase tracking-wider shadow-lg">
                  {fechaFormateada}
                </div>
              </div>

              {/* TÍTULO NÚMEROS GANADORES */}
              <div className="relative z-10 text-center mb-6">
                <h3 className="text-white text-2xl font-black italic uppercase tracking-tighter border-b-2 border-luck-gold/50 inline-block pb-1">
                  Números Ganadores
                </h3>
              </div>

              <div className="relative z-10 grid grid-cols-[60px_1fr_1fr] gap-4 mb-4 px-2 text-[10px] font-black text-zinc-500 uppercase text-center tracking-widest">
                <span>Suerte</span>
                <span className="text-luck-gold">2 Dígitos</span>
                <span className="text-emerald-400">3 Dígitos</span>
              </div>

              <div className="relative z-10 space-y-2.5">
                {Array.from({ length: maxFilas }).map((_, i) => (
                  <div key={i} className="grid grid-cols-[60px_1fr_1fr] gap-4 items-center">
                    <div className="bg-zinc-900/60 h-12 flex items-center justify-center rounded-xl border border-white/5 text-xl font-black italic text-zinc-600">
                      {i + 1}
                    </div>
                    <div className="bg-luck-gold h-12 rounded-xl flex items-center justify-center text-black text-2xl font-black tracking-widest shadow-lg">
                      {resultados2[i]?.numeroGanador || '--'}
                    </div>
                    <div className="bg-emerald-700/80 h-12 rounded-xl flex items-center justify-center text-2xl font-black tracking-widest border-y border-white/10 shadow-lg">
                      {resultados3[i]?.numeroGanador || '---'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative z-10 mt-10 pt-6 border-t border-white/10 text-center">
                <p className="text-2xl text-luck-gold mb-4 font-black italic uppercase tracking-tighter">
                  Valor 0.25 Ctvs.
                </p>
                <div className="flex justify-between px-4 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  <span>№ {data.Sorteo?.numero}</span>
                  <span>Jornada: {data.Sorteo?.jornada}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: PANEL DE INFORMACIÓN */}
        <div className="w-full md:w-80 p-8 flex flex-col bg-[#111615]">
          <div className="flex justify-between items-start mb-8">
            <h3 className="text-white font-black text-xl uppercase italic">Arte Generado</h3>
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
              <LuX size={28} />
            </button>
          </div>

          <div className="flex-1 space-y-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-xl">
                <LuTrophy size={20} />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase">Registros</p>
                <p className="text-white font-black text-lg leading-none">
                  {data.DetallesResultados?.length}
                </p>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
              <div className="p-3 bg-luck-gold/20 text-luck-gold rounded-xl">
                <LuCalendar size={20} />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase">Sorteo №</p>
                <p className="text-white font-black text-sm uppercase leading-none">
                  {data.Sorteo?.numero}
                </p>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 text-blue-500 rounded-xl">
                <LuTicket size={20} />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase">País</p>
                <p className="text-white font-black text-xs uppercase leading-none">
                  {codigoPais.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={descargarFlyer}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-emerald-500/10 uppercase italic mt-8"
          >
            <LuDownload size={22} /> Descargar Imagen
          </button>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

export default FlyerResultadosModal
