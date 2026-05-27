import MainLayout from '@/layouts/MainLayout'
import { useAuthStore } from '@/store/useAuthStore'
import { Navigate, Route, Routes } from 'react-router-dom'

// Importamos todo desde tu index
import {
  Cajas,
  CajasVendedor,
  Catalogo,
  Cifras,
  Configuracion,
  DashboardAdmin,
  DashboardVendedor,
  Login,
  NotFound,
  PuntosVentas,
  Reportes,
  Resultados,
  Roles,
  Sorteos,
  SorteosVendedor,
  Suertes,
  Tickets,
  TicketsVendedor,
  Usuarios,
} from '@/pages/index.pages'

const AppRouter = () => {
  const token = useAuthStore((state) => state.token)
  const esAdmin = useAuthStore((state) => state.esAdministrador)
  const isAuthenticated = !!token

  return (
    <Routes>
      {/* RUTA PÚBLICA */}
      <Route
        path="/inicio-sesion"
        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
      />

      {/* RUTAS PRIVADAS (Requieren Token) */}
      {isAuthenticated ? (
        <>
          {/* Bloque con Layout para rutas válidas */}
          <Route element={<MainLayout />}>
            {/* --- VISTA DASHBOARD (Componente dinámico según rol) --- */}
            <Route
              path="/dashboard"
              element={esAdmin ? <DashboardAdmin /> : <DashboardVendedor />}
            />

            {/* --- RUTAS EXCLUSIVAS DE ADMINISTRADOR --- */}
            {esAdmin && (
              <>
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/roles" element={<Roles />} />
                <Route path="/sorteos" element={<Sorteos />} />
                <Route path="/cajas" element={<Cajas />} />
                <Route path="/reportes" element={<Reportes />} />
                <Route path="/puntos-venta" element={<PuntosVentas />} />
                <Route path="/cifras" element={<Cifras />} />
                <Route path="/configuracion" element={<Configuracion />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/catalogo" element={<Catalogo />} />
                <Route path="/suertes" element={<Suertes />} />
                <Route path="/resultados" element={<Resultados />} />
              </>
            )}

            {/* --- RUTAS EXCLUSIVAS DE VENDEDOR --- */}
            {!esAdmin && (
              <>
                <Route path="/tickets" element={<TicketsVendedor />} />
                <Route path="/mis-sorteos" element={<SorteosVendedor />} />
                <Route path="/cajas" element={<CajasVendedor />} />
                <Route path="/resultados" element={<Resultados />} />
              </>
            )}
          </Route>

          {/* SOLUCIÓN: Al estar aquí afuera, NotFound se renderiza de forma independiente, 
              evitando que el MainLayout dibuje el aside en pantalla. */}
          <Route path="*" element={<NotFound />} />
        </>
      ) : (
        /* Si no está autenticado y la ruta no es /inicio-sesion, directo al login */
        <Route path="*" element={<Navigate to="/inicio-sesion" replace />} />
      )}
    </Routes>
  )
}

export default AppRouter
