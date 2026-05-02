import { Dashboard, Login } from '@/pages/index.pages'
import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={'/inicio-sesion'} replace />} />
      <Route path="/inicio-sesion" element={<Login />} />

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export default AppRouter
