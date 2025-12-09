import '@/App.css'
import Header from '@/components/layout/Header'
import WalletInfo from '@/components/wallet/WalletInfo'
import { DAPPLayout } from '@/components/layout/DAPPLayout'
import { AppKitProvider } from '@/config'

function App() {
  return (
    <div className="app-container">
      <AppKitProvider>
        <Header />
        <DAPPLayout>
          <WalletInfo />
        </DAPPLayout>
      </AppKitProvider>
    </div>
  )
}

export default App
