import { ReactNode, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useWalletSync } from '@/hooks/useWalletSync'
import { useSiweAuth } from '@/hooks/useSiweAuth'
import { useAuthStore } from '@/stores/authStore'

type Props = { children: ReactNode }

export const DAPPLayout = ({ children }: Props) => {
  useWalletSync()

  const { address, isConnected } = useAccount()
  const { authenticate } = useSiweAuth()
  const { isAuthenticated, loading, error, reset } = useAuthStore()

  useEffect(() => {
    if (!isConnected) {
      reset()
    }
  }, [isConnected])

  useEffect(() => {
    if (!address) return

    reset()
  }, [address])

  useEffect(() => {
    if (!isConnected || loading || isAuthenticated) return

    authenticate()
  }, [isConnected, isAuthenticated, loading])

  if (!isConnected) {
    return <p>Please connect your wallet</p>
  }

  if (loading) {
    return <p>Authenticating...</p>
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>
  }

  if (!isAuthenticated) {
    return <p>Waiting for authentication...</p>
  }

  return <>{children}</>
}
