import { http } from '@/services/http'
import { handleApiError } from '@/services/errorHandler'

type ApiResponse<T> = {
  status: string
  data?: T
  message?: string
}

type FaucetData = {
  txHash: string
  amountMinted: string
}

export async function requestFaucetTokens(address: string): Promise<FaucetData> {
  try {
    const response = await http.post<ApiResponse<FaucetData>>('/faucet', { address })
    
    if (response.data.status !== 'ok' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to request tokens')
    }
    
    return response.data.data
  } catch (err) {
    handleApiError(err, 'Failed to request faucet tokens')
    throw err
  }
}

