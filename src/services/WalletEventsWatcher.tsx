import { useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { useAccountStore } from '@/stores/accountStore'
import { HOODI_CHAIN_ID } from '@/constants'

export const WalletEventsWatcher = () => {
  const { address, isConnected, chain } = useAccount()
  const balanceQuery = useBalance({ address })

  const setAddress = useAccountStore((s) => s.setAddress)
  const setBalance = useAccountStore((s) => s.setBalance)
  const setChain = useAccountStore((s) => s.setChain)
  const setWrongNetwork = useAccountStore((s) => s.setWrongNetwork)
  const reset = useAccountStore((s) => s.reset)

  // Account changed
  useEffect(() => {
    if (!isConnected || !address) {
      reset()
      return
    }
    setAddress(address)
  }, [isConnected, address])

  // Balance changed
  useEffect(() => {
    if (balanceQuery.data) {
      setBalance(`${balanceQuery.data.formatted} ${balanceQuery.data.symbol}`)
    }
  }, [balanceQuery.data])

  // Chain changed
  useEffect(() => {
    const wrong = !chain || chain.id !== HOODI_CHAIN_ID
    setWrongNetwork(wrong)

    if (chain) {
      setChain(chain.id, chain.name)
    } else {
      setChain(0, 'Unknown')
    }
  }, [chain])
  
  return null
}
