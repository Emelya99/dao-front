import { useAccountStore } from '@/stores/accountStore'
import { useTokenStore } from '@/stores/tokenStore'
import SwitchToHoodiButton from '@/components/wallet/SwitchToHoodiButton'
import { WalletAvatar } from '@/components/wallet/WalletAvatar'

const WalletInfo = () => {
  const { address, balance, symbol, chainId, chainName, isWrongNetwork } = useAccountStore()
  const { tokenBalance, tokenSymbol } = useTokenStore()

  if (!address) return null

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <WalletAvatar address={address} />
        <div>
          <h2 style={{ margin: 0 }}>Wallet Info</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem' }}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        </div>
      </div>

      {isWrongNetwork ? (
        <div style={{ 
          padding: '20px',
          background: 'var(--danger-red-light)',
          borderRadius: 'var(--radius-md)',
          borderLeft: '4px solid var(--danger-red)',
          marginBottom: '16px'
        }}>
          <p style={{ color: 'var(--danger-red)', fontWeight: 600, margin: '0 0 12px 0' }}>
            ⚠️ Wrong Network
          </p>
          <SwitchToHoodiButton />
        </div>
      ) : (
        <div className="wallet-info-grid">
          <div className="wallet-info-item">
            <strong>Native Balance</strong>
            <span>{balance} {symbol}</span>
          </div>
          <div className="wallet-info-item">
            <strong>Token Balance</strong>
            <span>{tokenBalance} {tokenSymbol}</span>
          </div>
          <div className="wallet-info-item">
            <strong>Network</strong>
            <span>{chainName}</span>
          </div>
          <div className="wallet-info-item">
            <strong>Chain ID</strong>
            <span>{chainId}</span>
          </div>
        </div>
      )}
    </section>
  )
}

export default WalletInfo