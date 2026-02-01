import { useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { useAccountStore } from '@/stores/accountStore'
import { useTokenStore } from '@/stores/tokenStore'
import { CONTRACT_ADDRESSES, CONTRACTS } from '@/contracts'
import { HOODI_CHAIN_ID } from '@/constants'
import { TAddress } from '@/types/web3'

export const useWalletSync = () => {
  const { address, isConnected, chain } = useAccount()

  const nativeBalance = useBalance({ address })
  const tokenBalance = useBalance({
    address,
    token: CONTRACT_ADDRESSES[CONTRACTS.TOKEN_CONTRACT] as TAddress,
  })

  // Use selectors to get only the functions we need (they are stable)
  const setAddress = useAccountStore((state) => state.setAddress)
  const resetAccount = useAccountStore((state) => state.reset)
  const setBalance = useAccountStore((state) => state.setBalance)
  const setSymbol = useAccountStore((state) => state.setSymbol)
  const setWrongNetwork = useAccountStore((state) => state.setWrongNetwork)
  const setChain = useAccountStore((state) => state.setChain)

  const setToken = useTokenStore((state) => state.setToken)
  const resetToken = useTokenStore((state) => state.reset)

  // Account
  useEffect(() => {
    if (!isConnected || !address) {
      resetAccount()
      resetToken()
      return
    }
    setAddress(address)
  }, [isConnected, address, resetAccount, resetToken, setAddress])

  // Native balance
  useEffect(() => {
    if (nativeBalance.data) {
      setBalance(nativeBalance.data.formatted)
      setSymbol(nativeBalance.data.symbol)
    }
  }, [nativeBalance.data, setBalance, setSymbol])

  // Token balance
  useEffect(() => {
    if (tokenBalance.data) {
      setToken(
        tokenBalance.data.formatted, 
        tokenBalance.data.symbol,
        tokenBalance.data.decimals
      )
    }
  }, [tokenBalance.data, setToken])

  // Chain
  useEffect(() => {
    const wrong = !chain || chain.id !== HOODI_CHAIN_ID
    setWrongNetwork(wrong)

    if (chain) {
      setChain(chain.id, chain.name)
    } else {
      setChain(0, 'Unknown')
    }
  }, [chain, setWrongNetwork, setChain])
}
