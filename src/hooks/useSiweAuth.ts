import { useAuthStore } from '@/stores/authStore'
import { fetchNonce, verifySiwe } from '@/services/apiAuth'
import { SiweMessage } from 'siwe'
import { useSignMessage, useAccount, useChainId } from 'wagmi'

export function useSiweAuth() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { signMessageAsync } = useSignMessage()
  const { setAuthenticated, setLoading, setError, reset } = useAuthStore()

  async function authenticate() {
    if (!isConnected || !address) {
      reset()
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { nonce } = await fetchNonce(address)

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        chainId,
        uri: window.location.origin,
        version: '1',
        statement: 'Sign in with Ethereum',
        nonce
      })

      const prepared = message.prepareMessage()

      const signature = await signMessageAsync({ message: prepared })

      await verifySiwe(prepared, signature)

      setAuthenticated(true)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Authentication failed')
      }
      console.error(err)
      setAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  return { authenticate }
}
