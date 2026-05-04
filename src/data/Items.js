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

export const DASHBOARD_ITEMS = [
  {
    label: 'Ventas de Tickets',
    path: '/tickets',
    icon: LuTicket,
    desc: 'Tickets emitidos hoy',
    value: '1,284',
    stats: '+12% vs ayer',
    soloAdmin: false, // Disponible para todos
  },

  {
    label: 'Catálogo de Juegos', // <-- NUEVA OPCIÓN
    path: '/catalogo',
    icon: LuLibrary,
    desc: 'Tipos de sorteos y loterías',
    value: '06',
    stats: 'EC / AR activos',
    soloAdmin: true, // Por lo general, solo el admin define los productos
  },
  {
    label: 'Gestión de Sorteos',
    path: '/sorteos',
    icon: LuDice5,
    desc: 'Sorteos programados',
    value: '08',
    stats: 'Próximo: 19:00',
    soloAdmin: false,
  },
  {
    label: 'Resultados',
    path: '/resultados',
    icon: LuTrophy,
    desc: 'Premios entregados',
    value: '$4,250',
    stats: '15 ganadores',
    soloAdmin: false,
  },
  {
    label: 'Cifras',
    path: '/cifras',
    icon: LuBinary,
    desc: 'Números bloqueados',
    value: '12',
    stats: 'Cifras calientes',
    soloAdmin: false,
  },
  {
    label: 'Cajas',
    path: '/cajas',
    icon: LuWallet,
    desc: 'Saldo actual en caja',
    value: '$2,840.50',
    stats: 'Caja Abierta',
    soloAdmin: false,
  },
  {
    label: 'Movimientos',
    path: '/movimientos',
    icon: LuArrowLeftRight,
    desc: 'Transacciones hoy',
    value: '452',
    stats: 'Ver historial',
    soloAdmin: false,
  },
  {
    label: 'Puntos de Venta',
    path: '/puntos-venta',
    icon: LuStore,
    desc: 'Terminales activas',
    value: '24/26',
    stats: '2 desconectadas',
    soloAdmin: true, // SOLO ADMIN
  },
  {
    label: 'Estadísticas',
    path: '/reportes',
    icon: LuTrendingUp,
    desc: 'Rendimiento global',
    value: '94%',
    stats: 'Óptimo',
    soloAdmin: true, // SOLO ADMIN
  },
  {
    label: 'Usuarios',
    path: '/usuarios',
    icon: LuUsers,
    desc: 'Personal registrado',
    value: '18',
    stats: '4 en línea',
    soloAdmin: true, // SOLO ADMIN
  },
  {
    label: 'Roles y Permisos',
    path: '/roles',
    icon: LuShieldCheck,
    desc: 'Niveles de acceso',
    value: '05',
    stats: 'Seguridad activa',
    soloAdmin: true, // SOLO ADMIN
  },
  {
    label: 'Configuración',
    path: '/configuracion',
    icon: LuSettings,
    desc: 'Ajustes del sistema',
    value: 'SISTEMA',
    stats: 'v2.4.0',
    soloAdmin: true, // SOLO ADMIN
  },
]
