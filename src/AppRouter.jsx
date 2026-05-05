import MainLayout from '@/layouts/MainLayout'
import { useAuthStore } from '@/store/useAuthStore'
import { Navigate, Route, Routes } from 'react-router-dom'

// Importamos todo desde tu nuevo index
import {
  Cajas,
  CajasVendedor,
  Catalogo,
  Cifras,
  Configuracion,
  DashboardAdmin,
  DashboardVendedor,
  Login,
  Movimientos,
  PuntosVentas,
  Reportes,
  Resultados,
  Roles,
  Sorteos,
  SorteosVendedor,
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
        <Route element={<MainLayout />}>
          {/* --- VISTA DASHBOARD (Componente dinámico según rol) --- */}
          <Route path="/dashboard" element={esAdmin ? <DashboardAdmin /> : <DashboardVendedor />} />

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
              {/* El admin también puede ver tickets y catálogo general */}
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/catalogo" element={<Catalogo />} />
            </>
          )}

          {/* --- RUTAS EXCLUSIVAS DE VENDEDOR --- */}
          {!esAdmin && (
            <>
              <Route path="/tickets" element={<TicketsVendedor />} />
              <Route path="/mis-sorteos" element={<SorteosVendedor />} />
              <Route path="/mi-caja" element={<CajasVendedor />} />
              <Route path="/movimientos" element={<Movimientos />} />
              <Route path="/resultados" element={<Resultados />} />
            </>
          )}

          {/* Redirección por defecto si entran a una ruta que no les pertenece */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      ) : (
        /* Si no está autenticado y trata de ir a cualquier lado, al login */
        <Route path="*" element={<Navigate to="/inicio-sesion" replace />} />
      )}
    </Routes>
  )
}

export default AppRouter
