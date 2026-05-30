import MainLayout from '@/layouts/MainLayout'
import VendedorLayout from '@/layouts/VendedorLayout' // <--- NUEVO: Crea este layout POS para tus vendedores
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
  Respaldos,
  Resultados,
  ResultadosVendedor,
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
          {/* =========================================================
              ENTORNO DE ADMINISTRADOR (MainLayout con Sidebar Completo)
             ========================================================= */}
          {esAdmin && (
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardAdmin />} />
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
              <Route path="/respaldos" element={<Respaldos />} />
              {/* Redirección interna por si un admin intenta entrar a rutas de vendedor */}
              <Route path="/mis-sorteos" element={<Navigate to="/sorteos" replace />} />
            </Route>
          )}

          {/* =========================================================
              ENTORNO DE VENDEDOR / POS (VendedorLayout 100% Limpio)
             ========================================================= */}
          {!esAdmin && (
            <Route element={<VendedorLayout />}>
              <Route path="/dashboard" element={<DashboardVendedor />} />
              <Route path="/tickets" element={<TicketsVendedor />} />
              <Route path="/mis-sorteos" element={<SorteosVendedor />} />
              <Route path="/cajas" element={<CajasVendedor />} />
              <Route path="/resultados" element={<ResultadosVendedor />} />
            </Route>
          )}

          {/* Caída para sincronizar la ruta raíz "/" según el rol correspondientemente */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* RUTA NOT FOUND INDEPENDIENTE */}
          <Route path="*" element={<NotFound />} />
        </>
      ) : (
        /* Si no está autenticado, directo al login */
        <Route path="*" element={<Navigate to="/inicio-sesion" replace />} />
      )}
    </Routes>
  )
}

export default AppRouter
