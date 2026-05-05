import {
  cajaAPI,
  catalogoAPI,
  cifraAPI,
  movimientoAPI,
  puntosVentaAPI,
  rolAPI,
  sorteoAPI,
  ticketAPI,
  usuarioAPI,
} from '@/api/index.api'
import Title from '@/components/Titlte'
import { ADMIN_DASHBOARD_ITEMS } from '@/data/Items.js' // Importamos tus nuevos ítems
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

const DashboardAdmin = () => {
  const token = useAuthStore((store) => store.token)
  const { setCajas } = useCajaStore()
  const { setIsLoading, setLoadingMsg, isLoading } = useOutletContext()
  const [stats, setStats] = useState({})

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      setLoadingMsg('Cargando Torre de Control...')

      try {
        // Llamadas directas: Como es Admin, pedimos TODO lo global
        const [
          respTicket,
          respCatalogo,
          respSorteo,
          respCifra,
          respCaja,
          respUsuarios,
          respRoles,
          respPuntosVentas,
          respMovimientos,
        ] = await Promise.all([
          ticketAPI.listarTodos(),
          catalogoAPI.listarTodos(),
          sorteoAPI.listarTodos(),
          cifraAPI.listarTodas(),
          cajaAPI.listarTodas(), // Global
          usuarioAPI.listarTodos(),
          rolAPI.listarTodos(),
          puntosVentaAPI.listarTodos(),
          movimientoAPI.listarTodos(), // Global
        ])

        const tickets = respTicket.data.tickets || []
        const sorteos = respSorteo.data.sorteos || []
        const cajaData = respCaja.data.cajas || []
        const cifras = respCifra.data.cifras || []
        const roles = respRoles.data.roles || []
        const movimientos = respMovimientos.data.movimientos || []
        setCajas(cajaData)

        const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
        const hoy = new Date().toLocaleDateString('en-CA')

        // Cálculo de ventas globales hoy
        const ventasHoy = tickets
          .filter((t) => new Date(t.createdAt).toLocaleDateString('en-CA') === hoy)
          .reduce((acc, t) => acc + parseFloat(t.valor || 0), 0)

        setStats({
          Usuarios: {
            p: respUsuarios.data.usuarios?.length || 0,
            s: 'Usuarios registrados',
          },
          'Gestión de Sorteos': {
            p: sorteos.filter((s) => s.estado === 'Activo').length,
            s: 'Sorteos activos ahora',
          },
          'Auditoría de Cajas': {
            p: cajaData.length,
            s: 'Terminales con caja',
          },
          Roles: {
            p: roles.length,
            s: 'Roles registrados',
          },
          Cifras: {
            p: cifras.length,
            s: 'Registradas',
          },
          Movimientos: {
            p: movimientos.length,
            s: 'Movimientos',
          },
          'Ventas de Tickets': {
            p: formatter.format(ventasHoy),
            s: `Hoy: ${tickets.filter((t) => new Date(t.createdAt).toLocaleDateString('en-CA') === hoy).length} tickets`,
          },
          'Puntos de Venta': {
            p: respPuntosVentas.data.puntosVentas?.length || 0,
            s: 'Sucursales activas',
          },
          Catálogo: {
            p: respCatalogo.data.catalogos?.length || 0,
            s: 'Juegos configurados',
          },
          'Reportes Globales': {
            p: 'Analítica',
            s: 'Ver rendimiento global',
          },
          Configuración: {
            p: 'Sistema',
            s: 'Ajustes generales',
          },
        })
      } catch (err) {
        console.error('Error Admin Dashboard:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (token) fetchDashboardData()
    return () => setIsLoading(false)
  }, [token, setIsLoading, setLoadingMsg, setCajas])

  return (
    <div className="w-full pb-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: isLoading ? 0 : 1 }}>
        <Title
          titulo="Torre de Control"
          descripcion="Panel administrativo global y gestión de red"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {ADMIN_DASHBOARD_ITEMS.map((item, index) => {
            const data = stats[item.label]

            return (
              <motion.div key={index} variants={itemVariants} whileHover={{ y: -8 }}>
                <NavLink
                  to={item.path}
                  className="group relative bg-[#111615] border border-white/10 p-8 rounded-[2rem] min-h-[250px] flex flex-col justify-between transition-all duration-500 hover:border-luck-gold/50 shadow-2xl overflow-hidden"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-br from-luck-gold/10 to-transparent pointer-events-none"
                  />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-14 h-14 rounded-2xl border border-white/5 bg-zinc-900 text-zinc-400 flex items-center justify-center group-hover:text-luck-gold group-hover:border-luck-gold/30 transition-all">
                        <item.icon size={28} />
                      </div>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-luck-gold opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-luck-gold"></span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                        {item.label}
                      </p>
                      <h2 className="text-2xl font-black italic tracking-tight uppercase text-white">
                        {data?.p ?? '--'}
                      </h2>
                    </div>
                  </div>

                  <div className="relative z-10 mt-6 pt-4 border-t border-white/[0.03]">
                    <p className="text-sm text-zinc-600 font-medium">{item.desc}</p>
                    <p className="text-xs font-black mt-1 uppercase tracking-tighter text-luck-gold">
                      {data?.s ?? 'Cargando...'}
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

export default DashboardAdmin
