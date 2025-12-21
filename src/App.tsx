import '@/App.css'
import { Routes, Route } from 'react-router-dom'
import Header from '@/components/layout/Header'
import DAPPLayout from '@/components/layout/DAPPLayout'
import HomePage from '@/pages/HomePage'
import ProposalDetailPage from '@/pages/ProposalDetailPage'
import { EventListener } from '@/components/EventListener'
import { AppKitProvider } from '@/config'
import { Toaster } from 'react-hot-toast'
import { usePendingTxWatcher } from '@/hooks/usePendingTxWatcher'
import { ROUTES } from '@/constants/routes'

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
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.PROPOSAL_DETAIL} element={<ProposalDetailPage />} />
          </Routes>
        </DAPPLayout>
      
      </AppKitProvider>
    </div>
  )
}

export default App
