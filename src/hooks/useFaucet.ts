import { useState } from 'react'
import { useAccount } from 'wagmi'
import toast from 'react-hot-toast'
import { requestFaucetTokens } from '@/services/faucetApi'

const TOAST = {
  REQUESTING: 'Requesting tokens from faucet...',
  SUCCESS: 'Tokens minted successfully!',
  ERROR: 'Failed to get tokens',
}

export function useFaucet() {
  const [isLoading, setIsLoading] = useState(false)
  const { address } = useAccount()

  async function claimTokens(onSuccess?: () => void) {
    if (!address) {
      toast.error('Connect wallet first')
      return
    }

    const toastId = toast.loading(TOAST.REQUESTING)
    setIsLoading(true)

    try {
      const result = await requestFaucetTokens(address)
      
      toast.success(TOAST.SUCCESS, { id: toastId })
      
      // Trigger token balance refetch by calling the success callback
      onSuccess?.()
      
      return result
    } catch (err) {
      const error = err as Error
      toast.error(error.message || TOAST.ERROR, { id: toastId })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    claimTokens,
    isLoading,
  }
}

