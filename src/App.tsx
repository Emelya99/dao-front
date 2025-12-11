import '@/App.css'
import Header from '@/components/layout/Header'
import WalletInfo from '@/components/wallet/WalletInfo'
import DAPPLayout from '@/components/layout/DAPPLayout'
import { AppKitProvider } from '@/config'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <div className="app-container">
      <AppKitProvider>
        <Header />
        <Toaster />
        <DAPPLayout>
          <WalletInfo />
        </DAPPLayout>
      </AppKitProvider>
    </div>
  )
}

export default App
