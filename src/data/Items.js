import {
  LuArrowLeftRight,
  LuBinary,
  LuDice5,
  LuLibrary,
  LuSettings,
  LuShieldCheck,
  LuStore,
  LuTicket,
  LuTrendingUp,
  LuTrophy,
  LuUsers,
  LuWallet,
} from 'react-icons/lu'

export const ADMIN_DASHBOARD_ITEMS = [
  {
    label: 'Ventas de Tickets',
    path: '/tickets',
    icon: LuTicket,
    desc: 'Monitoreo de ventas globales',
  },
  {
    label: 'Gestión de Sorteos',
    path: '/sorteos',
    icon: LuDice5,
    desc: 'Configurar sorteos y premios',
  },
  {
    label: 'Resultados',
    path: '/resultados',
    icon: LuTrophy,
    desc: 'Historial de ganadores',
  },
  {
    label: 'Cifras',
    path: '/cifras',
    icon: LuBinary,
    desc: 'Control de números bloqueados',
  },
  {
    label: 'Auditoría de Cajas',
    path: '/cajas',
    icon: LuWallet,
    desc: 'Flujo de caja de terminales',
  },

  {
    label: 'Catálogo',
    path: '/catalogo',
    icon: LuLibrary,
    desc: 'Configuración de juegos',
  },
  {
    label: 'Puntos de Venta',
    path: '/puntos-venta',
    icon: LuStore,
    desc: 'Gestión de terminales',
  },
  {
    label: 'Reportes Globales',
    path: '/reportes',
    icon: LuTrendingUp,
    desc: 'Analítica de rendimiento',
  },
  {
    label: 'Usuarios',
    path: '/usuarios',
    icon: LuUsers,
    desc: 'Gestión de personal',
  },
  {
    label: 'Roles',
    path: '/roles',
    icon: LuShieldCheck,
    desc: 'Seguridad y permisos',
  },
  {
    label: 'Configuración',
    path: '/configuracion',
    icon: LuSettings,
    desc: 'Ajustes de plataforma',
  },
]

export const VENDEDOR_DASHBOARD_ITEMS = [
  {
    label: 'Vender Ticket',
    path: '/tickets', // Tu AppRouter cargará TicketsVendedor
    icon: LuTicket,
    desc: 'Emitir nueva apuesta',
  },
  {
    label: 'Mis Sorteos',
    path: '/mis-sorteos',
    icon: LuDice5,
    desc: 'Ver sorteos activos hoy',
  },
  {
    label: 'Mi Caja',
    path: '/mi-caja',
    icon: LuWallet,
    desc: 'Balance y cierre de turno',
  },
  {
    label: 'Movimientos',
    path: '/movimientos',
    icon: LuArrowLeftRight,
    desc: 'Mis ventas recientes',
  },
  {
    label: 'Resultados',
    path: '/resultados',
    icon: LuTrophy,
    desc: 'Consultar números ganadores',
  },
]
