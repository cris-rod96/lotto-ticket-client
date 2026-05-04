import CatalogoModal from '@/components/CatalogoModal'
import Title from '@/components/Titlte'
import { useState } from 'react'
import { LuGlobe, LuPencil, LuPlus, LuSearch, LuTrash2 } from 'react-icons/lu'

const Catalogo = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Datos de ejemplo basados en tu modelo
  const [catalogos, setCatalogos] = useState([
    { id: '1', nombre: 'Lotto', pais: 'EC', activo: true },
    { id: '2', nombre: 'Lotería Nacional', pais: 'EC', activo: true },
    { id: '3', nombre: 'Quini 6', pais: 'AR', activo: false },
  ])

  const filtered = catalogos.filter((c) =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-full pb-10">
      <div className="flex justify-between items-end mb-8">
        <Title
          titulo="Catálogo de Juegos"
          descripcion="Definición de productos de lotería por región"
        />
        <button
          onClick={() => {
            setSelectedItem(null)
            setShowModal(true)
          }}
          className="bg-luck-gold hover:bg-yellow-600 text-black font-black py-3 px-6 rounded-2xl flex items-center gap-2 transition-all active:scale-95 uppercase  text-sm"
        >
          <LuPlus size={20} /> Nuevo Juego
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-6">
        <div className="relative">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input
            type="text"
            placeholder="Buscar juego (ej: Lotto)..."
            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-luck-gold/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-[#111615] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] text-zinc-400 uppercase text-[10px] font-black tracking-[0.2em]">
              <th className="p-6">Nombre del Juego</th>
              <th className="p-6">País</th>
              <th className="p-6">Estado</th>
              <th className="p-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {filtered.map((item) => (
              <tr key={item.id} className="group hover:bg-white/[0.01] transition-colors">
                <td className="p-6 font-bold text-white uppercase text-[13px]">{item.nombre}</td>
                <td className="p-6">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <LuGlobe size={14} className="text-luck-gold" />
                    <span className="font-bold">
                      {item.pais === 'EC' ? 'Ecuador' : 'Argentina'}
                    </span>
                  </div>
                </td>
                <td className="p-6">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase  ${item.activo ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
                  >
                    {item.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedItem(item)
                        setShowModal(true)
                      }}
                      className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-400 hover:text-luck-gold transition-all"
                    >
                      <LuPencil size={18} />
                    </button>
                    <button className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-400 hover:text-red-500 transition-all">
                      <LuTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CatalogoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialData={selectedItem}
      />
    </div>
  )
}

export default Catalogo
