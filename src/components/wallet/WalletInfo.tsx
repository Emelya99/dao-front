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
      <WalletAvatar address={address} />
      <p><b>Address:</b> {address}</p>

      {isWrongNetwork ? (
        <>
          <p style={{color: 'red'}}>Wrong Network</p>
          <SwitchToHoodiButton />
        </>
      ) : (
        <>
          <p><b>Native Balance:</b> {balance} {symbol}</p>
          <p><b>Token Balance:</b> {tokenBalance} {tokenSymbol} </p>
          <p><b>ChainId:</b> {chainId}</p>
          <p><b>Network:</b> {chainName}</p>
        </>
      )}
    </section>
  )
}

export default WalletInfo