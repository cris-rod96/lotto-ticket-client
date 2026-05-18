import { cifraAPI, rolAPI, statsAPI } from '@/api/index.api'
import Title from '@/components/Titlte'
import { ADMIN_DASHBOARD_ITEMS } from '@/data/Items.js'
import { useAuthStore } from '@/store/useAuthStore'
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
  const { setIsLoading, setLoadingMsg, isLoading } = useOutletContext()
  const [stats, setStats] = useState({})

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      setLoadingMsg('Sincronizando Torre de Control...')

      try {
        // Ejecutamos la analítica optimizada y datos estáticos necesarios
        const [respStats, respCifras, respRoles] = await Promise.all([
          statsAPI.listarEstadisticas(),
          cifraAPI.listarTodas(),
          rolAPI.listarTodos(),
        ])

        const s = respStats.data.stats // La info que viene de tu nuevo Service
        const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

        // Mapeo directo de la respuesta del servidor a tus ítems del Dashboard
        setStats({
          'Gestión de Tickets': {
            p: formatter.format(s.ventasHoy || 0),
            s: `${s.totalTicketsHoy || 0} ventas hoy (neto)`,
          },
          'Gestión de Sorteos': {
            p: s.totalSorteosActivos || 0,
            s: 'Sorteos en curso ahora',
          },
          Resultados: {
            p: s.totalGanadores || 0,
            s: 'Tickets ganadores totales',
          },
          Cifras: {
            p: respCifras.data.cifras?.length || 0,
            s: 'Reglas de números activas',
          },
          'Auditoría de Cajas': {
            p: s.cajasAbiertas || 0,
            s: `Terminales activas actualmente`,
          },
          Catálogo: {
            p: s.totalCatalogos || 0,
            s: 'Modalidades de juego',
          },
          'Puntos de Venta': {
            p: s.totalPuntos || 0,
            s: 'Sucursales en la red',
          },
          'Reportes Globales': {
            p: formatter.format(s.deudaPremios || 0),
            s: 'Riesgo: Premios por pagar',
          },
          Usuarios: {
            p: s.totalUsuarios || 0,
            s: 'Personal registrado',
          },
          Roles: {
            p: respRoles.data.roles?.length || 0,
            s: 'Niveles de seguridad',
          },
          Configuración: {
            p: 'SISTEMA',
            s: 'Ajustes de plataforma',
          },
        })
      } catch (err) {
        console.error('Error Admin Dashboard:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (token) fetchDashboardData()
  }, [token, setIsLoading, setLoadingMsg])

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

            // Lógica visual: Si hay deuda de premios, resaltamos Reportes Globales
            const isCritical =
              item.label === 'Reportes Globales' && data?.p !== '$0.00' && data?.p !== '--'

            return (
              <motion.div key={index} variants={itemVariants} whileHover={{ y: -8 }}>
                <NavLink
                  to={item.path}
                  className={`group relative bg-[#111615] border p-8 rounded-[2rem] min-h-[250px] flex flex-col justify-between transition-all duration-500 shadow-2xl overflow-hidden ${
                    isCritical
                      ? 'border-orange-500/40'
                      : 'border-white/10 hover:border-luck-gold/50'
                  }`}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className={`absolute inset-0 bg-gradient-to-br pointer-events-none ${
                      isCritical ? 'from-orange-500/10' : 'from-luck-gold/10'
                    } to-transparent`}
                  />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <div
                        className={`w-14 h-14 rounded-2xl border border-white/5 bg-zinc-900 flex items-center justify-center transition-all ${
                          isCritical
                            ? 'text-orange-500 border-orange-500/20'
                            : 'text-zinc-400 group-hover:text-luck-gold group-hover:border-luck-gold/30'
                        }`}
                      >
                        <item.icon size={28} />
                      </div>
                      <span className="relative flex h-2 w-2">
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isCritical ? 'bg-orange-500' : 'bg-luck-gold'}`}
                        ></span>
                        <span
                          className={`relative inline-flex rounded-full h-2 w-2 ${isCritical ? 'bg-orange-500' : 'bg-luck-gold'}`}
                        ></span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                        {item.label}
                      </p>
                      <h2
                        className={`text-2xl font-black italic tracking-tight uppercase ${isCritical ? 'text-orange-500' : 'text-white'}`}
                      >
                        {data?.p ?? '--'}
                      </h2>
                    </div>
                  </div>

                  <div className="relative z-10 mt-6 pt-4 border-t border-white/[0.03]">
                    <p className="text-sm text-zinc-600 font-medium">{item.desc}</p>
                    <p
                      className={`text-xs font-black mt-1 uppercase tracking-tighter ${isCritical ? 'text-orange-500' : 'text-luck-gold'}`}
                    >
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
