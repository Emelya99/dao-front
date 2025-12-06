import { createAppKit } from '@reown/appkit/react'
import { ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { hoodi } from './customNetworks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

export const queryClient = new QueryClient()

export const projectId = import.meta.env.VITE_REOWN_PROJECT_ID
if (!projectId) {
  throw new Error('VITE_REOWN_PROJECT_ID is required')
}

export const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: window.location.origin,
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

const wagmiAdapter = new WagmiAdapter({
  networks: [hoodi],
  projectId,
  ssr: false
})

createAppKit({
  adapters: [wagmiAdapter],
  networks: [hoodi],
  projectId,
  metadata,
  features: {
    analytics: false,
  }
})

export function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}