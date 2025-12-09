import { useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { useAccountStore } from '@/stores/accountStore'
import { useTokenStore } from '@/stores/tokenStore'
import { CONTRACT_ADDRESSES, CONTRACTS } from '@/contracts'
import { HOODI_CHAIN_ID } from '@/constants'

export const useWalletSync = () => {
  const { address, isConnected, chain } = useAccount()

  const nativeBalance = useBalance({ address })
  const tokenBalance = useBalance({
    address,
    token: CONTRACT_ADDRESSES[CONTRACTS.TOKEN_CONTRACT] as `0x${string}`,
  })

  const accountStore = useAccountStore()
  const tokenStore = useTokenStore()

  // Account
  useEffect(() => {
    if (!isConnected || !address) {
      accountStore.reset()
      tokenStore.reset()
      return
    }
    accountStore.setAddress(address)
  }, [isConnected, address])

  // Native balance
  useEffect(() => {
    if (nativeBalance.data) {
      accountStore.setBalance(nativeBalance.data.formatted)
      accountStore.setSymbol(nativeBalance.data.symbol)
    }
  }, [nativeBalance.data])

  // Token balance
  useEffect(() => {
    if (tokenBalance.data) {
      tokenStore.setToken(tokenBalance.data.formatted, tokenBalance.data.symbol)
    }
  }, [tokenBalance.data])

  // Chain
  useEffect(() => {
    const wrong = !chain || chain.id !== HOODI_CHAIN_ID
    accountStore.setWrongNetwork(wrong)

    if (chain) {
      accountStore.setChain(chain.id, chain.name)
    } else {
      accountStore.setChain(0, 'Unknown')
    }
  }, [chain])
}
