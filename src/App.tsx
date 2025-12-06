import '@/App.css'
import Header from '@/components/layout/Header'
import { WalletEventsWatcher } from '@/services/WalletEventsWatcher'
import WalletInfo from '@/components/wallet/WalletInfo'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '@/config/wagmi'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletEventsWatcher />

        <div className="app-container">
          <Header />
          <WalletInfo />
        </div>

      </QueryClientProvider> 
    </WagmiProvider>
  )
}

export default App
