import SorteoModal from '@/components/SorteoModal'
import Title from '@/components/Titlte'
import { useState } from 'react'
import { LuCalendar, LuClock, LuGlobe, LuPencil, LuPlus, LuSearch, LuTrash2 } from 'react-icons/lu'

const Sorteos = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedSorteo, setSelectedSorteo] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Datos extendidos con Juego, País y Cifras (Relaciones de tu modelo)
  const [sorteos, setSorteos] = useState([
    {
      id: '1',
      numero: '2540',
      jornada: 'Nocturna',
      fechaSorteo: '2026-05-04',
      horaSorteo: '21:00',
      juego: 'Lotto', // Viene de CatalogoId
      pais: 'Ecuador', // Viene de CatalogoId
      cifras: 2, // Viene de CifraId
      estado: 'Abierto',
      montoRecaudado: 450.5,
    },
    {
      id: '2',
      numero: '1102',
      jornada: 'Matutina',
      fechaSorteo: '2026-05-05',
      horaSorteo: '11:00',
      juego: 'Quini 6',
      pais: 'Argentina',
      cifras: 3,
      estado: 'Abierto',
      montoRecaudado: 120.0,
    },
  ])

  const handleEdit = (sorteo) => {
    setSelectedSorteo(sorteo)
    setShowModal(true)
  }

  const filteredSorteos = sorteos.filter(
    (s) => s.numero.includes(searchTerm) || s.juego.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-full pb-10">
      <div className="flex justify-between items-end mb-8">
        <Title
          titulo="Gestión de Sorteos"
          descripcion="Programación y control de eventos de lotería"
        />
        <button
          onClick={() => {
            setSelectedSorteo(null)
            setShowModal(true)
          }}
          className="bg-luck-gold hover:bg-yellow-600 text-black font-black py-3 px-6 rounded-2xl flex items-center gap-2 transition-all active:scale-95 uppercase text-sm"
        >
          <LuPlus size={20} /> Programar Sorteo
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input
            type="text"
            placeholder="Buscar por número o nombre de juego..."
            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-luck-gold/50 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla Estilizada con toda la info */}
      <div className="bg-[#111615] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] text-zinc-400 uppercase text-[10px] font-black tracking-[0.2em]">
              <th className="p-6">Sorteo</th>
              <th className="p-6">Lotería / País</th>
              <th className="p-6">Cifras</th>
              <th className="p-6">Jornada</th>
              <th className="p-6">Fecha / Hora</th>
              <th className="p-6">Estado</th>
              <th className="p-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {filteredSorteos.map((sorteo) => (
              <tr key={sorteo.id} className="group hover:bg-white/[0.01] transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-luck-gold/10 flex items-center justify-center text-luck-gold font-black">
                      #{sorteo.numero.slice(-2)}
                    </div>
                    <span className="text-white font-bold text-lg">{sorteo.numero}</span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="text-zinc-200 font-bold text-xs uppercase tracking-wider">
                      {sorteo.juego}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase">
                      <LuGlobe size={10} /> {sorteo.pais}
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 font-black text-xs border border-white/5">
                    {sorteo.cifras}
                  </div>
                </td>
                <td className="p-6">
                  <span className="text-zinc-400 font-bold bg-zinc-900/80 px-2 py-1 rounded border border-white/5 text-[9px] uppercase">
                    {sorteo.jornada}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2 text-[11px] text-zinc-200 font-bold">
                      <LuCalendar size={13} className="text-luck-gold" /> {sorteo.fechaSorteo}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
                      <LuClock size={13} /> {sorteo.horaSorteo}
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                      sorteo.estado === 'Abierto'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}
                  >
                    {sorteo.estado}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(sorteo)}
                      className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-400 hover:text-luck-gold hover:border-luck-gold/30 transition-all"
                    >
                      <LuPencil size={18} />
                    </button>
                    <button className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-400 hover:text-red-500 hover:border-red-500/30 transition-all">
                      <LuTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <SorteoModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          initialData={selectedSorteo}
        />
      )}
    </div>
  )
}

export default Sorteos
