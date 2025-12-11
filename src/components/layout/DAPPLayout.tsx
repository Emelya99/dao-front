import { ReactNode } from 'react'
import { useAccount } from 'wagmi'
import { useWalletSync } from '@/hooks/useWalletSync'
import { useSiweAuth } from '@/hooks/useSiweAuth'
import { useAuthStore } from '@/stores/authStore'

type Props = {
  children: ReactNode
}

const DAPPLayout = ({ children }: Props) => {
  useWalletSync()
  useSiweAuth()
  
  const { isConnected } = useAccount()
  const { isAuthenticated, loading, error } = useAuthStore()

  if (!isConnected) {
    return <div>Please connect your wallet</div>
  }

  if (loading) {
    return <div>Authenticating...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!isAuthenticated) {
    return <div>Waiting for authentication...</div>
  }

  return <>{children}</>
}

export default DAPPLayout