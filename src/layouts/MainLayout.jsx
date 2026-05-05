import Loading from '@/components/Loading'
import Sidebar from '@/components/Sidebar'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  // Estados globales de carga
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      {/* 
         Al estar aquí, con z-[9999], tapará tanto al Sidebar 
         como al contenido del main 
      */}
      {isLoading && <Loading mensaje={loadingMsg} />}

      <Sidebar />

      <main className="flex-1 min-h-screen p-10 overflow-y-auto bg-[#0a0f0e] relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-luck-gold/5 blur-[120px] pointer-events-none opacity-50" />

        <div className="relative z-10">
          {/* Pasamos los setters a través del context del Outlet */}
          <Outlet context={{ setIsLoading, setLoadingMsg, isLoading }} />
        </div>
      </main>
    </div>
  )
}

export default MainLayout
