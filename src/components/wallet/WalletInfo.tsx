import { useAccountStore } from '@/stores/accountStore'
import { useTokenStore } from '@/stores/tokenStore'
import SwitchToHoodiButton from '@/components/wallet/SwitchToHoodiButton'
import { WalletAvatar } from '@/components/wallet/WalletAvatar'
import { useFaucet } from '@/hooks/useFaucet'
import { useReadContract, useBalance } from 'wagmi'
import { CONTRACTS, getContractInfo } from '@/contracts'
import { TAddress } from '@/types/web3'
import { CONTRACT_ADDRESSES } from '@/contracts'

const WalletInfo = () => {
  const { address, balance, symbol, chainId, chainName, isWrongNetwork } = useAccountStore()
  const { tokenBalance, tokenSymbol } = useTokenStore()
  const { claimTokens, isLoading } = useFaucet()
  
  // Read minTokensToCreateProposal from DAO contract
  const daoContract = getContractInfo(CONTRACTS.DAO_CONTRACT)
  const { data: minTokens } = useReadContract({
    address: daoContract.address as TAddress,
    abi: daoContract.abi,
    functionName: 'minTokensToCreateProposal',
  })

  // Refetch token balance after claiming
  const { refetch: refetchTokenBalance } = useBalance({
    address: address as TAddress,
    token: CONTRACT_ADDRESSES[CONTRACTS.TOKEN_CONTRACT] as TAddress,
  })

  const currentBalance = tokenBalance ? parseFloat(tokenBalance) : 0
  const minRequired = minTokens ? Number(minTokens) / 100_000_000 : 0 // 8 decimals
  const needsTokens = currentBalance < minRequired && minRequired > 0

  const handleClaimTokens = async () => {
    await claimTokens(async () => {
      // Refetch balance after successful claim
      await refetchTokenBalance()
    })
  }

  if (!address) return null

  return (
    <section>
      <div className="wallet-header">
        <WalletAvatar address={address} />
        <div>
          <h2 className="wallet-header-title">Wallet Info</h2>
          <p className="wallet-address">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        </div>
      </div>

      {isWrongNetwork ? (
        <div className="wallet-wrong-network">
          <p className="wallet-wrong-network-title">
            ⚠️ Wrong Network
          </p>
          <SwitchToHoodiButton />
        </div>
      ) : (
        <>
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

          {needsTokens && (
            <div className="wallet-faucet-card">
              <p className="wallet-faucet-title">
                💧 Need tokens to create proposals?
              </p>
              <p className="wallet-faucet-description">
                Minimum required: {minRequired} {tokenSymbol}
              </p>
              <button 
                onClick={handleClaimTokens}
                disabled={isLoading}
                className="wallet-faucet-button"
              >
                {isLoading ? 'Claiming...' : 'Get Tokens'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default WalletInfo