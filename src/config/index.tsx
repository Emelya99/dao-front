import { createAppKit } from '@reown/appkit/react'
import { ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { hoodi } from './customNetworks'
import { QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { queryClient, projectId, metadata } from './constants'
import { createStorage } from 'wagmi'

const wagmiAdapter = new WagmiAdapter({
  networks: [hoodi],
  projectId,
  ssr: false,
  // @ts-expect-error - WagmiAdapter types don't include storage option, but it works at runtime
  storage: createStorage({
    storage: window.sessionStorage, // Use sessionStorage instead of localStorage
  }),
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