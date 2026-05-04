import {
  LuArrowLeftRight,
  LuBinary,
  LuDice5,
  LuSettings,
  LuShieldCheck,
  LuStore,
  LuTicket,
  LuTrendingUp,
  LuTrophy,
  LuUsers,
  LuWallet,
} from 'react-icons/lu'

export const DASHBOARD_ITEMS = [
  // --- SECCIÓN OPERATIVA ---
  {
    label: 'Ventas de Tickets',
    path: '/tickets',
    icon: LuTicket,
    desc: 'Tickets emitidos hoy',
    value: '1,284',
    stats: '+12% vs ayer',
  },
  {
    label: 'Gestión de Sorteos',
    path: '/sorteos',
    icon: LuDice5,
    desc: 'Sorteos programados',
    value: '08',
    stats: 'Próximo: 19:00',
  },
  {
    label: 'Resultados',
    path: '/resultados',
    icon: LuTrophy,
    desc: 'Premios entregados',
    value: '$4,250',
    stats: '15 ganadores',
  },
  {
    label: 'Cifras',
    path: '/cifras',
    icon: LuBinary,
    desc: 'Números bloqueados',
    value: '12',
    stats: 'Cifras calientes',
  },

  // --- SECCIÓN FINANCIERA Y PUNTOS ---
  {
    label: 'Caja',
    path: '/caja',
    icon: LuWallet,
    desc: 'Saldo actual en caja',
    value: '$2,840.50',
    stats: 'Caja Abierta',
  },
  {
    label: 'Movimientos',
    path: '/movimientos',
    icon: LuArrowLeftRight,
    desc: 'Transacciones hoy',
    value: '452',
    stats: 'Ver historial',
  },
  {
    label: 'Puntos de Venta',
    path: '/puntos-venta',
    icon: LuStore,
    desc: 'Terminales activas',
    value: '24/26',
    stats: '2 desconectadas',
  },
  {
    label: 'Estadísticas',
    path: '/reportes',
    icon: LuTrendingUp,
    desc: 'Rendimiento global',
    value: '94%',
    stats: 'Óptimo',
  },

  // --- SECCIÓN ADMINISTRATIVA ---
  {
    label: 'Usuarios',
    path: '/usuarios',
    icon: LuUsers,
    desc: 'Personal registrado',
    value: '18',
    stats: '4 en línea',
  },
  {
    label: 'Roles y Permisos',
    path: '/roles',
    icon: LuShieldCheck,
    desc: 'Niveles de acceso',
    value: '05',
    stats: 'Seguridad activa',
  },
  {
    label: 'Configuración',
    path: '/config',
    icon: LuSettings,
    desc: 'Ajustes del sistema',
    value: 'SISTEMA',
    stats: 'v2.4.0',
  },
]
