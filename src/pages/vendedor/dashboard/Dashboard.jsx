import { cajaAPI, movimientoAPI, sorteoAPI, ticketAPI } from '@/api/index.api'
import Title from '@/components/Titlte'
import { VENDEDOR_DASHBOARD_ITEMS } from '@/data/Items' // Importamos tus ítems operativos
import { useAuthStore } from '@/store/useAuthStore'
import { useCajaStore } from '@/store/useCajaStore'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { NavLink, useOutletContext } from 'react-router-dom'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

const DashboardVendedor = () => {
  const token = useAuthStore((store) => store.token)
  const user = useAuthStore((state) => state.user)
  const { setCaja } = useCajaStore()
  const { setIsLoading, setLoadingMsg, isLoading } = useOutletContext()
  const [stats, setStats] = useState({})

  useEffect(() => {
    const fetchVendedorData = async () => {
      setIsLoading(true)
      setLoadingMsg('Sincronizando tu terminal...')

      try {
        // Solo pedimos lo que el vendedor necesita ver
        const [respTicket, respSorteo, respCaja, respMovimientos] = await Promise.all([
          ticketAPI.listarTodos(), // El backend debería filtrar por usuario/punto en el token
          sorteoAPI.listarTodos(),
          cajaAPI.listarPorPuntoVenta(user.PuntoVentaId),
          movimientoAPI.listarPorPuntoVenta(user.PuntoVentaId),
        ])

        const tickets = respTicket.data.tickets || []
        const sorteos = respSorteo.data.sorteos || []
        const movimientos = respMovimientos.data.movimientos || []

        // Sincronizar estado de caja local
        const cajaActiva = respCaja.data?.caja
        if (cajaActiva) setCaja(cajaActiva)

        const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
        const hoy = new Date().toLocaleDateString('en-CA')

        // Cálculo de mis ventas de hoy
        const ventasHoy = tickets
          .filter((t) => new Date(t.createdAt).toLocaleDateString('en-CA') === hoy)
          .reduce((acc, t) => acc + parseFloat(t.valor || 0), 0)

        setStats({
          'Vender Ticket': {
            p: formatter.format(ventasHoy),
            s: 'Vendido hoy',
          },
          'Mis Sorteos': {
            p: sorteos.filter((s) => s.estado === 'Activo').length,
            s: 'Sorteos disponibles',
          },
          'Mi Caja': {
            p: cajaActiva?.estado || 'Cerrada',
            s: `Saldo: ${formatter.format(cajaActiva?.saldoActual || 0)}`,
          },
          Movimientos: {
            p: movimientos.length,
            s: 'Transacciones hoy',
          },
          Resultados: {
            p: 'Premios',
            s: 'Consultar ganadores',
          },
        })
      } catch (err) {
        console.error('Error Vendedor Dashboard:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (token) fetchVendedorData()
    return () => setIsLoading(false)
  }, [token, user?.PuntoVentaId, setIsLoading, setLoadingMsg, setCaja])

  return (
    <div className="w-full pb-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: isLoading ? 0 : 1 }}>
        <Title
          titulo="Punto de Venta"
          descripcion={`Bienvenido, ${user?.nombre || 'Vendedor'}. Gestiona tus ventas y sorteos.`}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {VENDEDOR_DASHBOARD_ITEMS.map((item, index) => {
            const data = stats[item.label]

            return (
              <motion.div key={index} variants={itemVariants} whileHover={{ y: -8 }}>
                <NavLink
                  to={item.path}
                  className="group relative bg-[#0d1110] border border-white/5 p-8 rounded-[2rem] min-h-[220px] flex flex-col justify-between transition-all duration-500 hover:border-luck-gold/40 shadow-xl overflow-hidden"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-br from-luck-gold/5 to-transparent pointer-events-none"
                  />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-xl border border-white/5 bg-zinc-900 text-zinc-400 flex items-center justify-center group-hover:text-luck-gold group-hover:border-luck-gold/20 transition-all">
                        <item.icon size={24} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                        {item.label}
                      </p>
                      <h2 className="text-2xl font-black italic tracking-tight uppercase text-white">
                        {data?.p ?? '--'}
                      </h2>
                    </div>
                  </div>

                  <div className="relative z-10 mt-4 pt-4 border-t border-white/[0.03]">
                    <p className="text-xs text-zinc-500 font-medium">{item.desc}</p>
                    <p className="text-[10px] font-black mt-1 uppercase text-luck-gold">
                      {data?.s ?? 'Actualizando...'}
                    </p>
                  </div>
                </NavLink>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default DashboardVendedor
