// import './App.css'
// import AppRouter from './AppRouter'



// function App() {
//   return <AppRouter />
// }

// export default App


import './App.css'
import AppRouter from './AppRouter'

function App() {
  // Cambia esto a false cuando el cliente resuelva el pago
  const isAccountBlocked = true

  return (
    <div className="relative min-h-screen bg-[#0d1110] overflow-x-hidden">
      {/* OVERLAY DE BLOQUEO GLOBAL */}
      {isAccountBlocked && (
        <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#161b1a] border border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-5">
            
            <div className="flex items-center space-x-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <h3 className="text-sm font-bold text-red-500 tracking-wider uppercase">
                Account Suspended / System Restricted
              </h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-zinc-300">
              <p className="font-semibold text-white">
                Account Notice: Bandwidth Usage Inconsistency & Non-Compliance
              </p>
              <p>
                Infrastructure logs registered repeated manual service resets and zero response following our October 13th notice. Artificially resetting bandwidth counters to alter usage metrics violates our Acceptable Use Policy.
              </p>
              <p>
                An adjusted unbilled overage and administrative penalty of <strong className="text-red-400 font-bold">$25.00 USD</strong> has been applied. Settling this balance is required immediately to restore operations.
              </p>
            </div>

            <hr className="border-white/10" />

            <div className="space-y-3 text-xs leading-relaxed text-zinc-400">
              <p className="font-semibold text-zinc-200">
                Aviso de Cuenta: Inconsistencia de Ancho de Banda y Restricción
              </p>
              <p>
                Se registraron reinicios manuales repetidos y falta de respuesta tras la notificación del 13 de octubre. El reinicio artificial de contadores para alterar el consumo viola la Política de Uso Aceptable.
              </p>
              <p>
                Se ha aplicado un ajuste por excedente y sanción administrativa de <strong className="text-red-400 font-bold">$25.00 USD</strong>. Es necesario liquidar este saldo de inmediato para desbloquear el acceso.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* TODA TU APLICACIÓN POR DEBAJO (Bloqueada, difuminada e ininteractuable) */}
      <div className={isAccountBlocked ? "pointer-events-none select-none opacity-20 filter blur-[2px]" : ""}>
        <AppRouter />
      </div>
    </div>
  )
}

export default App
