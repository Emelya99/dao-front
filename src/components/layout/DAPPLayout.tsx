import { ReactNode } from 'react'
import { useAccount } from 'wagmi'
import { useWalletSync } from '@/hooks/useWalletSync'
import { useSiweAuth } from '@/hooks/useSiweAuth'
import { useAuthStore } from '@/stores/authStore'
import ConnectWalletButton from '@/components/wallet/ConnectWalletButton'

type Props = {
  children: ReactNode
}

const DAPPLayout = ({ children }: Props) => {
  const { isConnected } = useAccount()
  
  // Always call hooks (they handle isConnected internally)
  useWalletSync()
  useSiweAuth()
  
  const { isAuthenticated, loading, error } = useAuthStore()

  // Show auth prompts only if wallet is connected but not authenticated
  if (isConnected && loading) {
    return (
      <div className="wallet-connect-prompt">
        <div className="wallet-connect-content">
          <div className="wallet-connect-icon">⏳</div>
          <h2>Authenticating...</h2>
          <p>Please sign the message in your wallet to continue</p>
        </div>
      </div>
    )
  }

  if (isConnected && error) {
    return (
      <div className="wallet-connect-prompt">
        <div className="wallet-connect-content">
          <div className="wallet-connect-icon" style={{ color: 'var(--danger-red)' }}>⚠️</div>
          <h2>Authentication Error</h2>
          <p style={{ color: 'var(--danger-red)' }}>{error}</p>
          <ConnectWalletButton />
        </div>
      </div>
    )
  }

  if (isConnected && !isAuthenticated) {
    return (
      <div className="wallet-connect-prompt">
        <div className="wallet-connect-content">
          <div className="wallet-connect-icon">🔑</div>
          <h2>Waiting for Authentication</h2>
          <p>Please complete the authentication process</p>
        </div>
      </div>
    )
  }

  // Allow browsing proposals without wallet, but show connect prompt banner
  return (
    <>
      {!isConnected && (
        <div className="wallet-banner">
          <div className="app-container">
            <div className="wallet-banner-content">
              <div>
                <strong>🔐 Connect your wallet</strong> to vote and create proposals
              </div>
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  )
}

export default DAPPLayout