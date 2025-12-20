import '@/App.css'
import Header from '@/components/layout/Header'
import WalletInfo from '@/components/wallet/WalletInfo'
import DAPPLayout from '@/components/layout/DAPPLayout'
import ProposalsSection from '@/components/proposals/ProposalsSection'
import { EventListener } from '@/components/EventListener'
import { AppKitProvider } from '@/config'
import { Toaster } from 'react-hot-toast'
import { usePendingTxWatcher } from '@/hooks/usePendingTxWatcher'

function AppSideEffects() {
  usePendingTxWatcher()
  return null
}

function App() {
  return (
    <div className="app-container">
      <AppKitProvider>
        <AppSideEffects />

        <Header />
        <Toaster />
        <EventListener />

        <DAPPLayout>
          <WalletInfo />
          <ProposalsSection />
        </DAPPLayout>
      
      </AppKitProvider>
    </div>
  )
}

export default App
