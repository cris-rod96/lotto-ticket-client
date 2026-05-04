import CifraModal from '@/components/CifraModal' // El modal que crearemos abajo
import Title from '@/components/Titlte'
import { useState } from 'react'
import { LuPencil, LuPlus, LuSearch, LuTrash2 } from 'react-icons/lu'

const Cifras = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedCifra, setSelectedCifra] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Simulación de datos basada en tu modelo de Sequelize
  const [cifras, setCifras] = useState([
    { id: '1', cantidad: 2, activo: true, cupoMaximoPorNumero: 500.0, valorMinimoTicket: 1.0 },
    { id: '2', cantidad: 3, activo: false, cupoMaximoPorNumero: 1000.0, valorMinimoTicket: 0.5 },
  ])

  const handleEdit = (cifra) => {
    setSelectedCifra(cifra)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta configuración de cifra?')) {
      setCifras(cifras.filter((c) => c.id !== id))
    }
  }

  const filteredCifras = cifras.filter((c) => c.cantidad.toString().includes(searchTerm))

  return (
    <div className="w-full pb-10">
      <div className="flex justify-between items-end mb-8">
        <Title
          titulo="Gestión de Cifras"
          descripcion="Configuración de límites y montos por cantidad de números"
        />
        <button
          onClick={() => {
            setSelectedCifra(null)
            setShowModal(true)
          }}
          className="bg-luck-gold hover:bg-yellow-600 text-black font-black py-3 px-6 rounded-2xl flex items-center gap-2 transition-all active:scale-95 uppercase italic text-sm"
        >
          <LuPlus size={20} /> Nueva Cifra
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-[#111615] border border-white/5 p-4 rounded-3xl mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input
            type="text"
            placeholder="Buscar por cantidad de cifras (ej: 2)..."
            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-luck-gold/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla Estilizada */}
      <div className="bg-[#111615] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] text-zinc-400 uppercase text-[10px] font-black tracking-[0.2em]">
              <th className="p-6">Cantidad</th>
              <th className="p-6">Cupo Máximo</th>
              <th className="p-6">Valor Mín. Ticket</th>
              <th className="p-6">Estado</th>
              <th className="p-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {filteredCifras.map((cifra) => (
              <tr key={cifra.id} className="group hover:bg-white/[0.01] transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-luck-gold/10 flex items-center justify-center text-luck-gold font-black italic">
                      {cifra.cantidad}
                    </div>
                    <span className="text-white font-bold text-lg">{cifra.cantidad} Cifras</span>
                  </div>
                </td>
                <td className="p-6 text-zinc-300 font-medium">${cifra.cupoMaximoPorNumero}</td>
                <td className="p-6 text-zinc-300 font-medium">${cifra.valorMinimoTicket}</td>
                <td className="p-6">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase italic ${cifra.activo ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
                  >
                    {cifra.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(cifra)}
                      className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-400 hover:text-luck-gold hover:border-luck-gold/30 transition-all"
                    >
                      <LuPencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(cifra.id)}
                      className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-400 hover:text-red-500 hover:border-red-500/30 transition-all"
                    >
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
        <CifraModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          initialData={selectedCifra}
        />
      )}
    </div>
  )
}

export default Cifras
