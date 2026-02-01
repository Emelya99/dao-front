import { useEffect, useState } from 'react'
import { fetchProposalDetail } from '@/services/proposalApi'
import { useProposalStore } from '@/stores/proposalStore'
import { ApiError } from '@/types/web3'

export function useProposalDetail(id: number) {
  const { getProposalDetail, setProposalDetail } = useProposalStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cachedDetail = getProposalDetail(id)

  useEffect(() => {
    // If already cached, skip fetch
    if (cachedDetail) {
      return
    }

    async function loadDetail() {
      setLoading(true)
      setError(null)
      
      try {
        const detail = await fetchProposalDetail(id)
        setProposalDetail(id, detail)
      } catch (err) {
        const error = err as ApiError
        setError(error?.response?.data?.message || 'Failed to load proposal')
      } finally {
        setLoading(false)
      }
    }

    loadDetail()
  }, [id, cachedDetail, setProposalDetail])

  return {
    proposal: cachedDetail,
    loading,
    error,
  }
}

