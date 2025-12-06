import { useAccountStore } from '@/stores/accountStore'
import SwitchToHoodiButton from '@/components/wallet/SwitchToHoodiButton'
import { WalletAvatar } from '@/components/wallet/WalletAvatar'

const WalletInfo = () => {
  const { address, balance, chainId, chainName, isWrongNetwork } = useAccountStore()

  if (!address) return null

  return (
    <section>
      <WalletAvatar address={address} />
      <p><b>Address:</b> {address}</p>
      <p><b>Balance:</b> {balance}</p>
      <p><b>ChainId:</b> {chainId}</p>
      <p><b>Network:</b> {chainName}</p>

      {isWrongNetwork && (
        <>
          <p style={{color: 'red'}}>Wrong Network</p>
          <SwitchToHoodiButton />
        </>
      )}
    </section>
  )
}

export default WalletInfo