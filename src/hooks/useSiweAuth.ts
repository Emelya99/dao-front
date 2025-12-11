import { useEffect, useCallback, useRef } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { fetchNonce, verifySiwe } from '@/services/apiAuth'
import { SiweMessage } from 'siwe'
import { useSignMessage, useAccount, useChainId, useDisconnect } from 'wagmi'
import toast from "react-hot-toast"

const MESSAGES = {
  NONCE_FAILED: "Failed to fetch SIWE nonce",
  PREPARE_FAILED: "Failed to prepare SIWE message",
  SIGN_REJECTED: "Message signing was rejected",
  SIGN_FAILED: "Message signing failed",
  VERIFY_FAILED: "Failed to verify SIWE message",
  AUTH_FAILED: "Authentication failed",
  AUTH_SUCCESS: "Authentication successful",
} as const

export function useSiweAuth() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { signMessageAsync } = useSignMessage()
  const { disconnect } = useDisconnect()
  const { isAuthenticated, loading, setAuthenticated, setLoading, setError, reset } = useAuthStore()
  const previousAddress = useRef<string | null>(null)

  const logout = useCallback(() => {
    reset()
    disconnect()
  }, [disconnect, reset])

  const authenticate = useCallback(async () => {
    if (!isConnected || !address) {
      reset()
      return
    }

    // Avoid duplicate authentication
    if (isAuthenticated || loading) {
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Fetch nonce
      let nonce: string
      try {
        const data = await fetchNonce(address)
        nonce = data?.nonce
        if (!nonce) throw new Error("Invalid nonce")
      } catch {
        toast.error(MESSAGES.NONCE_FAILED)
        throw new Error(MESSAGES.NONCE_FAILED)
      }
      
      // Prepare SIWE message
      let preparedMessage: string
      try {
        const message = new SiweMessage({
          domain: window.location.host,
          address,
          chainId,
          uri: window.location.origin,
          version: '1',
          statement: 'Sign in with Ethereum',
          nonce
        })
        preparedMessage = message.prepareMessage()
      } catch {
        toast.error(MESSAGES.PREPARE_FAILED)
        throw new Error(MESSAGES.PREPARE_FAILED)
      }

      // Sign
      let signature: string
      try {
        signature = await signMessageAsync({ message: preparedMessage })
      } catch (err: any) {
        if (err?.code === 4001) {
          toast.error(MESSAGES.SIGN_REJECTED)
          throw new Error(MESSAGES.SIGN_REJECTED)
        }
        toast.error(MESSAGES.SIGN_FAILED)
        throw new Error(MESSAGES.SIGN_FAILED)
      }

      // Verify
      try {
        await verifySiwe(preparedMessage, signature)
      } catch {
        toast.error(MESSAGES.VERIFY_FAILED)
        throw new Error(MESSAGES.VERIFY_FAILED)
      }

      toast.success(MESSAGES.AUTH_SUCCESS)
      setAuthenticated(true)

    } catch (err: any) {
      const msg = err?.message || MESSAGES.AUTH_FAILED  
      setError(msg)
      setAuthenticated(false)
      disconnect()
    } finally {
      setLoading(false)
    }
  }, [
    address,
    isConnected,
    loading,
    isAuthenticated,
    chainId,
    signMessageAsync,
    disconnect
  ])

  // auto SIWE after connect
  useEffect(() => {
    if (isConnected && address && !isAuthenticated && !loading) {
      authenticate()
    }
  }, [isConnected, address])

  // reset auth on disconnect
  useEffect(() => {
    if (!isConnected) reset()
  }, [isConnected])

  // logout on address change
  useEffect(() => {
    if (!address) {
      previousAddress.current = null
      return
    }

    if (!previousAddress.current) {
      previousAddress.current = address
      return
    }

    if (previousAddress.current !== address) {
      logout()
    }

    previousAddress.current = address
  }, [address])

  return { authenticate }
}