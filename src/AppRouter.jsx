import { Navigate, Route, Routes } from 'react-router-dom'
import { Login } from './pages/index.pages'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={'/inicio-sesion'} replace />} />
      <Route path="/inicio-sesion" element={<Login />} />
    </Routes>
  )
}

export default AppRouter
