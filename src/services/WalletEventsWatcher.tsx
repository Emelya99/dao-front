import { useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { useAccountStore } from '@/stores/accountStore'
import { useTokenStore } from '@/stores/tokenStore'
import { HOODI_CHAIN_ID } from '@/constants'
import { CONTRACT_ADDRESSES, CONTRACTS } from '@/contracts'

export const WalletEventsWatcher = () => {
  const { address, isConnected, chain } = useAccount()

  const nativeBalance = useBalance({ address })
  const tokenBalance = useBalance({
    address,
    token: CONTRACT_ADDRESSES[CONTRACTS.TOKEN_CONTRACT] as `0x${string}`
  })

  const setAddress = useAccountStore((s) => s.setAddress)
  const setBalance = useAccountStore((s) => s.setBalance)
  const setSymbol = useAccountStore((s) => s.setSymbol)
  const setChain = useAccountStore((s) => s.setChain)
  const setWrongNetwork = useAccountStore((s) => s.setWrongNetwork)
  const resetAccount = useAccountStore((s) => s.reset)

  const setToken = useTokenStore((s) => s.setToken)
  const resetToken = useTokenStore((s) => s.reset)

  // Account changed
  useEffect(() => {
    if (!isConnected || !address) {
      resetAccount()
      resetToken()
      return
    }
    setAddress(address)
  }, [isConnected, address])

  // Native balance changed
  useEffect(() => {
    if (nativeBalance.data) {
      setBalance(nativeBalance.data.formatted)
      setSymbol(nativeBalance.data.symbol)
    }
  }, [nativeBalance.data])

  // Token balance changed
  useEffect(() => {
    if (tokenBalance.data) {
      setToken(tokenBalance.data.formatted, tokenBalance.data.symbol)
    }
  }, [tokenBalance.data])

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
