import {
  Cajas,
  Catalogo,
  Cifras,
  Configuracion,
  Dashboard,
  Login,
  Movimientos,
  PuntosVentas,
  Reportes,
  Resultados,
  Roles,
  Sorteos,
  Tickets,
  Usuarios,
} from '@/pages/index.pages'
import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={'/inicio-sesion'} replace />} />
      <Route path="/inicio-sesion" element={<Login />} />

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cajas" element={<Cajas />} />
        <Route path="/cifras" element={<Cifras />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/movimientos" element={<Movimientos />} />
        <Route path="/puntos-venta" element={<PuntosVentas />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/sorteos" element={<Sorteos />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/catalogo" element={<Catalogo />} />
      </Route>
    </Routes>
  )
}

export default AppRouter
