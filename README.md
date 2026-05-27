# Lotto Ticket Client

Aplicacion web de gestion para loteria con dos perfiles principales:

- **Administrador**: configura catalogos, sorteos, usuarios, reportes y operacion general.
- **Vendedor**: registra tickets, consulta sorteos y gestiona su caja.

El frontend esta construido con **React + Vite**, usa **React Router** para navegacion, **Zustand** para estado global y **Axios** para comunicacion con backend.

## Requisitos

- Node.js 18+
- npm 9+

## Instalacion y ejecucion

1. Instalar dependencias:

```bash
npm install
```

2. Crear archivo `.env` en la raiz del proyecto:

```env
VITE_BACKEND_URL_DEV=http://localhost:3000
VITE_BACKEND_URL_PROD=https://tu-backend-produccion.com
```

3. Ejecutar en desarrollo:

```bash
npm run dev
```

4. Build de produccion:

```bash
npm run build
```

5. Previsualizar build:

```bash
npm run preview
```

## Estructura principal

- `src/main.jsx`: punto de entrada de la app.
- `src/App.jsx`: renderiza el enrutador principal.
- `src/AppRouter.jsx`: define rutas publicas/privadas y control por rol.
- `src/layouts/MainLayout.jsx`: layout privado con sidebar + contenido.
- `src/store/useAuthStore.js`: persistencia de sesion y rol (`esAdministrador`).
- `src/api/base.api.js`: instancia Axios y envio automatico de `x-token`.
- `src/api/index.api.js`: exporta modulos API (auth, ticket, sorteo, caja, etc).
- `src/pages/`: paginas agrupadas por dominio y tipo de usuario.

## Flujo de autenticacion

- Ruta publica: `/inicio-sesion`
- Al iniciar sesion correctamente:
  - se guarda `token`, `user` y `esAdministrador` en `auth-storage` (Zustand persist).
  - se redirige a `/dashboard`.
- Todas las rutas privadas requieren token.
- Si no hay sesion, cualquier ruta redirige a `/inicio-sesion`.

## Rutas de la aplicacion

### Rutas publicas

- `/inicio-sesion`: pantalla de login.

### Rutas privadas comunes

- `/dashboard`: dashboard dinamico segun rol.
- `/cajas`: existe para ambos roles, pero renderiza paginas distintas.
- `/tickets`: existe para ambos roles, pero renderiza paginas distintas.
- `/resultados`: consulta de resultados.

### Rutas privadas de administrador

- `/usuarios`: gestion de usuarios del sistema.
- `/roles`: gestion de roles y permisos.
- `/sorteos`: administracion de sorteos.
- `/reportes`: reportes operativos/comerciales.
- `/puntos-venta`: administracion de puntos de venta.
- `/cifras`: gestion de cifras disponibles.
- `/configuracion`: configuraciones generales del sistema.
- `/catalogo`: catalogo de juegos/productos.
- `/suertes`: gestion de suertes.

### Rutas privadas de vendedor

- `/mis-sorteos`: consulta de sorteos para el vendedor.

### Ruta de error

- `*`: pagina `NotFound` para rutas no existentes estando autenticado.

## Paginas del modulo Administrador

- `src/pages/admin/dashboard/Dashboard.jsx`: panel principal administrativo.
- `src/pages/admin/tickets/Tickets.jsx`: gestion integral de tickets.
- `src/pages/admin/suertes/Suertes.jsx`: CRUD y mantenimiento de suertes.
- `src/pages/admin/catalogo/Catalogo.jsx`: mantenimiento de catalogo.
- `src/pages/admin/sorteos/Sorteos.jsx`: creacion/edicion de sorteos.
- `src/pages/admin/resultados/Resultados.jsx`: publicacion/consulta de resultados.
- `src/pages/admin/cifras/Cifras.jsx`: administracion de cifras.
- `src/pages/admin/cajas/Cajas.jsx`: monitoreo y gestion de cajas.
- `src/pages/admin/reportes/Reportes.jsx`: vistas de reporteria.
- `src/pages/admin/puntos-venta/PuntosVentas.jsx`: gestion de puntos de venta.
- `src/pages/admin/usuarios/Usuarios.jsx`: administracion de usuarios.
- `src/pages/admin/roles/Roles.jsx`: configuracion de roles.
- `src/pages/admin/configuracion/Configuracion.jsx`: ajustes globales.

## Paginas del modulo Vendedor

- `src/pages/vendedor/dashboard/Dashboard.jsx`: panel operativo del vendedor.
- `src/pages/vendedor/tickets/Tickets.jsx`: registro y gestion de tickets de venta.
- `src/pages/vendedor/sorteos/Sorteos.jsx`: consulta de sorteos disponibles.
- `src/pages/vendedor/cajas/Cajas.jsx`: gestion de caja del vendedor.

## Modulos API disponibles

Desde `src/api/index.api.js` se exponen:

- `authAPI`
- `ticketAPI`
- `sorteoAPI`
- `resultadoAPI`
- `cajaAPI`
- `movimientoAPI`
- `catalogoAPI`
- `suerteAPI`
- `cifraAPI`
- `puntosVentaAPI`
- `usuarioAPI`
- `rolAPI`
- `statsAPI`

Todos usan la instancia definida en `src/api/base.api.js`, que adjunta `x-token` automaticamente cuando hay sesion activa.

## Navegacion lateral (Sidebar)

La barra lateral del layout privado muestra las opciones segun rol:

- Opciones solo administrador se bloquean visualmente para vendedor.
- Opciones operativas compartidas (tickets/cajas) estan disponibles para ambos.
- Incluye cierre de sesion con limpieza de estado de autenticacion y caja.

## Scripts npm

- `npm run dev`: iniciar entorno local.
- `npm run build`: generar build de produccion.
- `npm run preview`: levantar build generado.
- `npm run lint`: ejecutar ESLint.
